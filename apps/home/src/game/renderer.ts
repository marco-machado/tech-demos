import * as THREE from "three/webgpu";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { PinballSimulation, TARGETS, WIDTH, HEIGHT } from "./simulation";

export type ArcadeRenderer = {
  dispose: () => void;
  theme: (dark: boolean) => void;
  impact: (index: number) => void;
  reducedMotion: (value: boolean) => void;
};

export async function createArcadeRenderer(
  container: HTMLElement,
  simulation: PinballSimulation,
  dark: boolean,
  reduced: boolean,
): Promise<ArcadeRenderer> {
  const gpu = (
    navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown> };
    }
  ).gpu;
  if (!gpu || !(await gpu.requestAdapter()))
    throw new Error(
      "WebGPU is unavailable in this browser. You can still explore every demo in the collection.",
    );
  const renderer = new THREE.WebGPURenderer({
    antialias: true,
    alpha: true,
    forceWebGL: false,
  });
  await renderer.init();
  if (
    !(renderer.backend as unknown as { isWebGPUBackend?: boolean })
      .isWebGPUBackend
  ) {
    renderer.dispose();
    throw new Error(
      "This browser could not start WebGPU. Explore the collection, or try a WebGPU-enabled browser.",
    );
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.dataset.renderer = "webgpu";
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -WIDTH / 2,
    WIDTH / 2,
    HEIGHT / 2,
    -HEIGHT / 2,
    0.1,
    3000,
  );
  camera.position.set(0, 0, 1400);
  const table = new THREE.Group();
  scene.add(table);
  const ambient = new THREE.HemisphereLight(0xffffff, 0x54617e, 2.2);
  const key = new THREE.DirectionalLight(0xfff1de, 3.1);
  key.position.set(-250, 500, 650);
  const fill = new THREE.DirectionalLight(0xa9c7ff, 1.5);
  fill.position.set(360, -180, 450);
  scene.add(ambient, key, fill);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = await pmrem.fromSceneAsync(environment, 0.04);
  scene.environment = envMap.texture;
  environment.dispose();
  const textureLoader = new THREE.TextureLoader();
  const names = [
    "playfield",
    ...TARGETS.map((t) => t.texture),
    "flipper-red",
    "flipper-blue",
  ];
  const textures = await Promise.all(
    names.map(async (name) => {
      const texture = await textureLoader.loadAsync(`/assets/${name}.webp`);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      return texture;
    }),
  );
  const baseMaterial = new THREE.MeshBasicMaterial({
    map: textures[0],
    toneMapped: false,
  });
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(WIDTH, HEIGHT, 12),
    baseMaterial,
  );
  board.position.z = -8;
  table.add(board);
  const metal = new THREE.MeshStandardMaterial({
    color: 0xc5cbd1,
    metalness: 1,
    roughness: 0.2,
  });
  const blue = new THREE.MeshStandardMaterial({
    color: 0x114fba,
    metalness: 0.62,
    roughness: 0.24,
  });
  const world = (x: number, y: number, z = 0) =>
    new THREE.Vector3((x - WIDTH / 2) * simulation.scaleX, HEIGHT / 2 - y, z);
  const rails: THREE.Mesh[] = [];
  function rail(points: number[][], material: THREE.Material, radius: number) {
    const path = new THREE.CatmullRomCurve3(
      points.map(([x, y]) => new THREE.Vector3(x - WIDTH / 2, HEIGHT / 2 - y, 4)),
      false,
      "centripetal",
    );
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(path, 48, radius, 10, false),
      material,
    );
    table.add(mesh);
    rails.push(mesh);
  }
  rail(
    [
      [16, 950],
      [14, 650],
      [12, 100],
      [45, 18],
      [350, 12],
      [670, 18],
      [706, 90],
      [706, 950],
    ],
    metal,
    4,
  );
  rail(
    [
      [30, 600],
      [40, 665],
      [185, 814],
    ],
    blue,
    8,
  );
  rail(
    [
      [650, 615],
      [635, 686],
      [535, 806],
    ],
    blue,
    8,
  );
  const targetObjects: THREE.Group[] = [];
  const hitLights: THREE.PointLight[] = [];
  TARGETS.forEach((target, index) => {
    const group = new THREE.Group();
    group.position.copy(world(target.x, target.y, 4));
    const support = new THREE.Mesh(
      new THREE.CylinderGeometry(
        target.radius * 0.84,
        target.radius * 0.88,
        11,
        40,
      ),
      metal,
    );
    support.rotation.x = Math.PI / 2;
    group.add(support);
    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(target.width, target.height),
      new THREE.MeshBasicMaterial({
        map: textures[index + 1],
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    surface.position.z = 9;
    group.add(surface);
    const light = new THREE.PointLight(target.color, 0, 250, 1);
    light.position.set(0, 0, 55);
    group.add(light);
    table.add(group);
    targetObjects.push(group);
    hitLights.push(light);
  });
  function flipper(x: number, name: "red" | "blue", texture: THREE.Texture) {
    const group = new THREE.Group();
    group.position.copy(world(x, 842, 12));
    const origin = name === "red" ? 0.127 : 0.875;
    const width = 170;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, width / 2.8),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    mesh.position.x = width * (0.5 - origin);
    mesh.position.z = 12;
    group.add(mesh);
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 16, 12, 24),
      metal,
    );
    hinge.rotation.x = Math.PI / 2;
    group.add(hinge);
    table.add(group);
    return group;
  }
  const left = flipper(200, "red", textures[6]);
  const right = flipper(520, "blue", textures[7]);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(13, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xd3dfef,
      metalness: 1,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
    }),
  );
  table.add(ball);
  const trail = Array.from({ length: 7 }, () => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(5, 10, 8),
      new THREE.MeshBasicMaterial({
        color: 0xe86031,
        transparent: true,
        opacity: 0,
      }),
    );
    table.add(mesh);
    return mesh;
  });
  let history: THREE.Vector3[] = [];
  const hitTimes = TARGETS.map(() => -100);
  let elapsed = 0;
  let previous = performance.now();
  let disposed = false;
  let reduceMotion = reduced;
  const resize = () => {
    if (disposed) return;
    const scale =
      container.clientWidth / container.clientHeight / (WIDTH / HEIGHT);
    simulation.resize(scale);
    camera.left = (-WIDTH * scale) / 2;
    camera.right = (WIDTH * scale) / 2;
    camera.updateProjectionMatrix();
    board.scale.x = scale;
    rails.forEach((mesh) => {
      mesh.scale.x = scale;
    });
    targetObjects.forEach((group, index) =>
      group.position.copy(world(TARGETS[index].x, TARGETS[index].y, 4)),
    );
    left.position.copy(world(200, 842, 12));
    right.position.copy(world(520, 842, 12));
    (left.children[0] as THREE.Mesh).scale.set(scale, Math.sqrt(scale), 1);
    (right.children[0] as THREE.Mesh).scale.set(scale, Math.sqrt(scale), 1);
    renderer.setSize(container.clientWidth, container.clientHeight, false);
  };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickTarget = (event: MouseEvent) => {
    if (simulation.paused) return;
    const bounds = container.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(targetObjects, true)[0];
    if (!hit) return;
    let object: THREE.Object3D | null = hit.object;
    while (object && !targetObjects.includes(object as THREE.Group))
      object = object.parent;
    const index = targetObjects.indexOf(object as THREE.Group);
    if (index >= 0) simulation.onHit(index);
  };
  container.addEventListener("click", pickTarget);
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  function setTheme(isDark: boolean) {
    baseMaterial.color.set(isDark ? 0x394657 : 0xffffff);
    renderer.toneMappingExposure = isDark ? 0.78 : 1.15;
    ambient.intensity = isDark ? 1.25 : 2.2;
  }
  setTheme(dark);
  renderer.setAnimationLoop((now: number) => {
    if (disposed) return;
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    simulation.update(dt);
    if (!simulation.paused) elapsed += dt;
    ball.position.set(
      simulation.ball.x - (WIDTH * simulation.scaleX) / 2,
      HEIGHT / 2 - simulation.ball.y,
      18,
    );
    ball.rotation.x += (simulation.ball.vy * dt) / 25;
    ball.rotation.y += (simulation.ball.vx * dt) / 25;
    left.rotation.z = -simulation.leftAngle;
    right.rotation.z = -(simulation.rightAngle - Math.PI);
    if (simulation.active && !simulation.paused) {
      history.unshift(ball.position.clone());
      history = history.slice(0, 21);
    }
    trail.forEach((particle, index) => {
      const position = history[index * 3];
      if (position) particle.position.copy(position);
      (particle.material as THREE.MeshBasicMaterial).opacity =
        simulation.active && !reduceMotion && position
          ? 0.19 * (1 - index / trail.length)
          : 0;
    });
    targetObjects.forEach((group, index) => {
      const age = elapsed - hitTimes[index];
      const pulse = Math.max(0, 1 - age / 0.28);
      group.position.z =
        4 + (reduceMotion ? 0 : Math.sin(age * 30) * pulse * 4);
      group.scale.setScalar(
        Math.sqrt(simulation.scaleX) * (1 + (reduceMotion ? 0 : pulse * 0.055)),
      );
      hitLights[index].intensity = pulse * 13;
    });
    if (!reduceMotion && !simulation.paused)
      key.position.x = -250 + Math.sin(elapsed * 0.24) * 85;
    renderer.render(scene, camera);
  });
  return {
    theme: setTheme,
    impact(index) {
      if (index < hitTimes.length) hitTimes[index] = elapsed;
    },
    reducedMotion(value) {
      reduceMotion = value;
    },
    dispose() {
      container.removeEventListener("click", pickTarget);
      disposed = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      textures.forEach((texture) => texture.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
