import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  SpeakerHigh,
  SpeakerSlash,
  Sun,
  Moon,
  MagnifyingGlass,
  X,
  Rows,
  ArrowCounterClockwise,
  CaretDown,
} from "@phosphor-icons/react";
import catalogue from "virtual:demo-catalogue";
import { PinballSimulation, TARGETS } from "./game/simulation";
import { ArcadeAudio } from "./game/audio";
import type { ArcadeRenderer } from "./game/renderer";
import type { Demo } from "./types";

const SOURCE = "https://github.com/marco-machado/tech-demos";
const featured = catalogue.slice(0, 5);
const categories = [...new Set(catalogue.map((demo) => demo.category))].sort();
const shellTransition = {
  type: "spring" as const,
  stiffness: 310,
  damping: 34,
};

function Thumb({ demo }: { demo: Demo }) {
  return (
    <img
      className={`thumb thumb-${demo.slug}`}
      src={demo.image}
      alt=""
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/assets/bumper-red.webp";
      }}
    />
  );
}

export default function App() {
  const [selected, setSelected] = useState<Demo>(featured[0]);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [sound, setSound] = useState(false);
  const [engineState, setEngineState] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const [engineError, setEngineError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [pressed, setPressed] = useState({ left: false, right: false });
  const [hitIndex, setHitIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("Good ideas deserve a launch.");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const reduceMotion = useReducedMotion();
  const surface = useRef<HTMLDivElement>(null);
  const renderer = useRef<ArcadeRenderer | null>(null);
  const simulation = useRef(new PinballSimulation());
  const audio = useRef(new ArcadeAudio());
  const searchInput = useRef<HTMLInputElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const select = useCallback((demo: Demo, index?: number) => {
    setSelected(demo);
    setStatus(`${demo.title} in focus. Open the demo when you're ready.`);
    if (index !== undefined) {
      renderer.current?.impact(index);
      setHitIndex(index);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setHitIndex(null), 400);
      audio.current.play("hit", index);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sim = simulation.current;
    sim.onHit = (index) => {
      if (featured[index]) select(featured[index], index);
    };
    sim.onDrain = () => {
      setPlaying(false);
      setStatus("One more? Launch another ball.");
    };
    // The heavy renderer loads after the accessible catalogue has mounted.
    import("./game/renderer")
      .then(({ createArcadeRenderer }) =>
        createArcadeRenderer(
          surface.current!,
          sim,
          document.documentElement.dataset.theme === "dark",
          !!reduceMotion,
        ),
      )
      .then((engine) => {
        if (cancelled) {
          engine.dispose();
          return;
        }
        renderer.current = engine;
        setEngineState("ready");
      })
      .catch((error) => {
        if (!cancelled) {
          setEngineState("unavailable");
          setEngineError(
            error instanceof Error
              ? error.message
              : "The playfield could not start. Every demo is available in the collection.",
          );
        }
      });
    return () => {
      cancelled = true;
      renderer.current?.dispose();
      renderer.current = null;
      clearTimeout(timeout.current);
    };
    // One scene lifetime; theme and motion preferences are updated below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("beyond-theme", theme);
    } catch {
      /* Private browsing can deny storage. */
    }
    renderer.current?.theme(theme === "dark");
  }, [theme, engineState]);
  useEffect(() => {
    renderer.current?.reducedMotion(!!reduceMotion);
  }, [reduceMotion]);
  useEffect(() => {
    audio.current.enabled = sound;
  }, [sound]);
  useEffect(() => () => audio.current.dispose(), []);

  const flipper = useCallback((side: "left" | "right", down: boolean) => {
    if (simulation.current.paused && down) return;
    simulation.current[side] = down;
    setPressed((current) =>
      current[side] === down ? current : { ...current, [side]: down },
    );
    if (down) audio.current.play("flipper");
  }, []);
  const launch = useCallback(() => {
    if (engineState !== "ready") return;
    if (simulation.current.launch()) {
      setPlaying(true);
      audio.current.play("launch");
      setStatus("Ball in play. Left and right to flip.");
    }
  }, [engineState]);
  const reset = useCallback(() => {
    simulation.current.reset();
    setPlaying(false);
    setPressed({ left: false, right: false });
    setStatus("Fresh start. Launch when you’re ready.");
  }, []);

  useEffect(() => {
    const visibility = () => {
      simulation.current.paused = archiveOpen || document.hidden;
      if (simulation.current.paused) {
        flipper("left", false);
        flipper("right", false);
      }
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const blur = () => {
      flipper("left", false);
      flipper("right", false);
    };
    window.addEventListener("blur", blur);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
    };
  }, [archiveOpen, flipper]);

  useEffect(() => {
    const key = (event: KeyboardEvent, down: boolean) => {
      if (
        event.target instanceof HTMLElement &&
        /^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName)
      )
        return;
      if (event.key === "Escape" && down) {
        setArchiveOpen(false);
        return;
      }
      if (archiveOpen || event.metaKey || event.ctrlKey || event.altKey) return;
      if (["ArrowLeft", "a", "A"].includes(event.key)) {
        event.preventDefault();
        flipper("left", down);
      }
      if (["ArrowRight", "d", "D"].includes(event.key)) {
        event.preventDefault();
        flipper("right", down);
      }
      if (
        event.code === "Space" &&
        !(event.target instanceof HTMLButtonElement) &&
        !(event.target instanceof HTMLAnchorElement)
      ) {
        event.preventDefault();
        if (down && !event.repeat) launch();
      }
      if (event.key.toLowerCase() === "r" && down && !event.repeat) reset();
    };
    const down = (event: KeyboardEvent) => key(event, true);
    const up = (event: KeyboardEvent) => key(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [archiveOpen, flipper, launch, reset]);

  useEffect(() => {
    if (!archiveOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchInput.current?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setArchiveOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = drawer.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input, select",
      );
      if (!focusable?.length) return;
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [archiveOpen]);

  const filtered = catalogue
    .filter(
      (demo) =>
        (category === "all" || demo.category === category) &&
        `${demo.title} ${demo.description} ${demo.category}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "az"
        ? a.title.localeCompare(b.title)
        : b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );

  const controlEvents = (side: "left" | "right") => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      flipper(side, true);
    },
    onPointerUp: () => flipper(side, false),
    onPointerCancel: () => flipper(side, false),
    onLostPointerCapture: () => flipper(side, false),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!event.repeat) flipper(side, true);
      }
    },
    onKeyUp: (event: React.KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flipper(side, false);
      }
    },
  });

  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#collection"
        onClick={() => setArchiveOpen(true)}
      >
        Browse the demos
      </a>
      <div
        className="arcade-shell"
        data-engine={engineState}
        data-playing={playing}
        data-paused={archiveOpen}
      >
        <aside
          className="identity-panel"
          aria-label="Beyond Localhost"
          inert={archiveOpen}
        >
          <p className="eyebrow">A playable web lab</p>
          <h1>
            <span>Beyond</span>
            <span>Local</span>
            <span>host</span>
          </h1>
          <div className="identity-bottom">
            <p className="eyebrow table-heading">
              On the table{" "}
              <b>{String(featured.length).padStart(2, "0")} experiments</b>
            </p>
            <nav aria-label="Featured demos" className="quick-index">
              {featured.map((demo, index) => (
                <button
                  key={demo.slug}
                  onClick={() => select(demo, index)}
                  className={selected.slug === demo.slug ? "current" : ""}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{demo.title}</span>
                  <ArrowUpRight size={19} />
                </button>
              ))}
            </nav>
            <button
              className="sidebar-launch"
              onClick={launch}
              disabled={playing || engineState !== "ready"}
            >
              {playing ? "Ball in play" : "Launch ball"}
              <ArrowUpRight size={25} weight="bold" />
            </button>
            <span className="key-hint">Space to launch · ← → flippers</span>
            <button
              className="all-demos-sidebar"
              onClick={() => setArchiveOpen(true)}
            >
              <Rows size={23} />
              All demos <span>{catalogue.length}</span>
              <ArrowUpRight size={21} />
            </button>
            <p className="identity-note">
              Small experiments.
              <br />
              Bigger possibilities.
            </p>
          </div>
        </aside>

        <main
          className="machine"
          aria-label="Playable demo collection"
          inert={archiveOpen}
        >
          <header className="machine-header">
            <span className="mobile-brand">Beyond Localhost</span>
            <span className="machine-serial">
              BL—001 <span>Independent experiments</span>
            </span>
            <div className="utility-controls">
              <button
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                title={`${theme === "light" ? "Dark" : "Light"} mode`}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon size={21} /> : <Sun size={21} />}
              </button>
              <button
                aria-label={sound ? "Mute sound" : "Enable sound"}
                title={sound ? "Sound on" : "Sound off"}
                onClick={() => setSound(!sound)}
              >
                {sound ? <SpeakerHigh size={22} /> : <SpeakerSlash size={22} />}
              </button>
              <a
                href={SOURCE}
                target="_blank"
                rel="noreferrer"
                className="source-link"
              >
                Source
                <ArrowUpRight size={16} />
              </a>
            </div>
          </header>

          <div className="backglass" aria-label="Selected experiment">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="focus-content"
                key={selected.slug}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                <Thumb demo={selected} />
                <div>
                  <p className="eyebrow">Now in focus</p>
                  <h2>{selected.title}</h2>
                </div>
              </motion.div>
            </AnimatePresence>
            <a className="open-demo" href={selected.href}>
              Open demo
              <ArrowUpRight size={22} weight="bold" />
            </a>
          </div>

          <div className="playfield" data-testid="playfield">
            <div ref={surface} className="scene" />
            {engineState !== "ready" && (
              <div className="scene-poster" aria-hidden="true">
                <img src="/assets/playfield.webp" alt="" />
                {TARGETS.map((target) => (
                  <img
                    key={target.texture}
                    className="poster-target"
                    src={`/assets/${target.texture}.webp`}
                    alt=""
                    style={{
                      left: `${(target.x / 720) * 100}%`,
                      top: `${(target.y / 960) * 100}%`,
                      width: `${(target.width / 720) * 100}%`,
                    }}
                  />
                ))}
              </div>
            )}
            <div className="targets" aria-label="Select an experiment">
              {featured.map((demo, index) => {
                const target = TARGETS[index];
                return (
                  <button
                    key={demo.slug}
                    className={`target-label ${selected.slug === demo.slug ? "selected" : ""} ${hitIndex === index ? "hit" : ""}`}
                    style={{
                      left: `${(target.x / 720) * 100}%`,
                      top: `${((target.y - target.height / 2 - 48) / 960) * 100}%`,
                    }}
                    aria-label={`Preview ${demo.title}`}
                    aria-pressed={selected.slug === demo.slug}
                    onClick={() => select(demo, index)}
                  >
                    <span className="target-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="target-insert">{demo.title}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {archiveOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pause-indicator"
                >
                  Paused while browsing
                </motion.span>
              )}
            </AnimatePresence>
            {engineState === "loading" && (
              <div className="engine-message">
                <span className="loading-dot" />
                Warming up the machine…
              </div>
            )}
            {engineState === "unavailable" && (
              <div className="engine-message error">
                <p>{engineError}</p>
                <button onClick={() => setArchiveOpen(true)}>
                  Explore all demos
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
            <div className="board-corner">
              <span>{playing ? "Ball in play" : "Ready when you are"}</span>
              <button
                aria-label="Reset the table"
                title="Reset · R"
                onClick={reset}
              >
                <ArrowCounterClockwise size={20} />
              </button>
            </div>
          </div>

          <div className="control-deck" aria-label="Pinball touch controls">
            <button
              className={`flipper-control left ${pressed.left ? "is-pressed" : ""}`}
              aria-label="Left flipper"
              {...controlEvents("left")}
            >
              Left<span>← / A</span>
            </button>
            <button
              className="launch-control"
              onClick={launch}
              disabled={playing || engineState !== "ready"}
            >
              {playing ? "In play" : "Launch"}
              <span>{playing ? "Keep it moving" : "Space"}</span>
            </button>
            <button
              className={`flipper-control right ${pressed.right ? "is-pressed" : ""}`}
              aria-label="Right flipper"
              {...controlEvents("right")}
            >
              Right<span>→ / D</span>
            </button>
          </div>
          <button
            className="all-demos-mobile"
            onClick={() => setArchiveOpen(true)}
          >
            <Rows size={25} weight="bold" />
            <span>All demos · {catalogue.length}</span>
            <ArrowUpRight size={27} />
          </button>
          <footer className="machine-footer">
            <span>Tap a target to preview. Play to discover.</span>
            <span className="engine-credit">Three.js / WebGPU</span>
          </footer>
        </main>

        <AnimatePresence>
          {archiveOpen && (
            <>
              <motion.button
                className="drawer-backdrop"
                aria-label="Close collection"
                tabIndex={-1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setArchiveOpen(false)}
              />
              <motion.aside
                ref={drawer}
                id="collection"
                role="dialog"
                aria-modal="true"
                aria-labelledby="collection-title"
                className="archive-drawer"
                initial={{ x: "-102%" }}
                animate={{ x: 0 }}
                exit={{ x: "-102%" }}
                transition={shellTransition}
              >
                <div className="archive-spine" aria-hidden="true">
                  Beyond Localhost
                </div>
                <div className="archive-body">
                  <div className="archive-topline">
                    <button onClick={() => setArchiveOpen(false)}>
                      <ArrowLeft size={22} />
                      <span>Table</span>
                    </button>
                    <span className="eyebrow archive-label">
                      The collection
                    </span>
                    <span className="archive-mobile-brand">
                      Beyond Localhost
                    </span>
                    <button
                      aria-label="Close collection"
                      onClick={() => setArchiveOpen(false)}
                    >
                      <X size={23} />
                    </button>
                  </div>
                  <div className="archive-title">
                    <h2 id="collection-title">All demos</h2>
                    <span>{catalogue.length}</span>
                  </div>
                  <p className="archive-paused eyebrow">
                    Game paused. Curiosity on.
                  </p>
                  <label className="search-box">
                    <MagnifyingGlass size={22} />
                    <input
                      ref={searchInput}
                      aria-label="Find an experiment"
                      placeholder="Find an experiment…"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    {query && (
                      <button
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <X size={19} />
                      </button>
                    )}
                  </label>
                  <div className="archive-filters">
                    <label>
                      <span className="sr-only">Category</span>
                      <select
                        aria-label="Category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                      >
                        <option value="all">All categories</option>
                        {categories.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                      <CaretDown size={15} />
                    </label>
                    <label>
                      <span className="sr-only">Sort demos</span>
                      <select
                        aria-label="Sort demos"
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                      >
                        <option value="newest">Newest first</option>
                        <option value="az">Name A–Z</option>
                      </select>
                      <CaretDown size={15} />
                    </label>
                  </div>
                  <div className="archive-list" aria-label="Demo catalogue">
                    {filtered.length ? (
                      filtered.map((demo) => (
                        <button
                          key={demo.slug}
                          className={`archive-row ${selected.slug === demo.slug ? "selected" : ""}`}
                          onClick={() => select(demo)}
                          aria-pressed={selected.slug === demo.slug}
                        >
                          <Thumb demo={demo} />
                          <span className="row-copy">
                            <strong>{demo.title}</strong>
                            <span>{demo.category}</span>
                          </span>
                          {featured.some((item) => item.slug === demo.slug) && (
                            <small>On table</small>
                          )}
                          <ArrowUpRight size={22} />
                        </button>
                      ))
                    ) : (
                      <div className="empty-state">
                        <h3>No experiments found.</h3>
                        <p>Try another word, or open the whole collection.</p>
                        <button
                          onClick={() => {
                            setQuery("");
                            setCategory("all");
                          }}
                        >
                          Clear filters
                          <ArrowRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="archive-selected">
                    <Thumb demo={selected} />
                    <div>
                      <strong>{selected.title}</strong>
                      <span>{selected.category}</span>
                    </div>
                    <a href={selected.href}>
                      Open demo
                      <ArrowUpRight size={22} />
                    </a>
                  </div>
                  <div className="archive-footer">
                    <span>
                      {filtered.length} of {catalogue.length} experiments
                    </span>
                    <a href={SOURCE} target="_blank" rel="noreferrer">
                      Open source
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        <div className="sr-only" aria-live="polite">
          {status}
        </div>
      </div>
    </MotionConfig>
  );
}
