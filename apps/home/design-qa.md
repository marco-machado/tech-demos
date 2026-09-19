# Launch Arcade design QA

final result: passed

## Findings

No remaining actionable P0/P1/P2 findings in the tested desktop, tablet, and mobile states. This is a responsive implementation of the approved arcade direction, not a pixel-for-pixel reproduction of the perspective concept painting.

- **[P2, resolved] Mobile archive lost the red brand header.** The first combined archive comparison showed a plain utility row where the approved mobile design had a strong red identity bar. Restored the red bar, condensed wordmark, return control, and close control. The revised `validation/comparison-archive.jpg` shows the fix at the same viewport.
- **[P2, resolved] Wordmark overflow and compressed hardware.** Initial desktop review exposed a wordmark wider than its column and flattened target/flipper artwork. Reduced the wordmark scale, decoupled target scaling from the board aspect ratio, and increased the flipper depth. Revised desktop/mobile captures show contained text and readable hardware.
- **[P2, resolved] Resized 3D rails could be scaled twice during scene initialization.** Rail geometry now starts in unscaled table coordinates; resizing applies the horizontal factor once. Verified the settled production desktop frame after a mobile-to-desktop resize.
- **[P2, resolved] Mobile archive returned focus to a hidden desktop control.** Capture and restore the actual opener instead. Verified Escape returns focus to the mobile All demos button. Background regions are inert while the modal is open.

## Source and implementation evidence

Source directory: `/Users/machado/.codex/generated_images/01a0b820-1850-7df2-a2a3-2acde7fb43b5/`.

| State | Source visual truth | Running implementation | Comparison |
| --- | --- | --- | --- |
| Desktop light table | `exec-786d36d1-c28b-4df5-b1bb-547d6d2b3217.png` | `validation/desktop-light.png` | `validation/comparison-desktop.jpg` |
| Mobile light table | `exec-b94823ba-848f-4ad0-a321-bed21a7affd7.png` | `validation/mobile-light.png` | `validation/comparison-mobile.jpg` |
| Mobile archive | `exec-10384693-6169-4a6c-b684-8532724a9475.png` | `validation/mobile-archive.png` | `validation/comparison-archive.jpg` |

Additional captures: `desktop-dark.png`, `desktop-archive.png`, `mobile-dark.png`, and `tablet.png` in `validation/`. `mobile-walkthrough.mp4` records the running production app, including launch, moving ball, impact-driven selection, archive, manual selection, and theme switching.

Browser: Codex in-app Chromium, WebGPU backend verified from the rendered canvas. Final production preview: `http://localhost:5182/`. No browser chrome or device frame is included in captures.

Desktop viewport/capture: 1440 × 1000 CSS/pixels; mobile: 390 × 844 CSS/pixels; tablet: 810 × 1080 CSS/pixels; device pixel ratio 1. The source desktop is 1512 × 1040 pixels; mobile table is 853 × 1844 pixels. Source images are proportionally downsampled and letterboxed into the matching implementation canvas before pairing. Archive source is 853 × 1844 pixels and is normalized to 390 × 844 in the same way. The reference's 30-item scale study differs intentionally from the five real entries currently in the repo.

Combined images were opened and inspected together. The full desktop comparison covers hierarchy and layout; the mobile and archive comparisons remain at readable, native CSS size, making labels, icons, focus rings, filters, and controls directly inspectable without a separate magnified crop.

## Required fidelity surfaces

- **Typography:** locally bundled Anton supplies the condensed display character; Barlow Condensed supplies supporting labels and navigation. The wordmark stays in its column; mobile demo names and drawer rows remain legible. Longer target titles can wrap on tablet. The mock's painted lettering is represented by live text where content changes.
- **Spacing/layout:** retains the red desktop identity column, dominant cream playfield, black preview display, five target positions, lower flippers, and persistent explicit demo navigation. Mobile has a portrait table, touch deck, full-width archive access, and full-screen archive. No horizontal overflow at the three tested sizes. Desktop controls are also available onscreen, so its playfield is shorter than the initial painting.
- **Colors/tokens:** warm paper, red-orange identity, cobalt hardware, teal accent, and dark backglass retain the palette. Dark mode uses charcoal surfaces, cream text, visible selected states, and separately adjusted scene lighting. Theme survives reload. Focus indicators stay visible in both themes.
- **Image quality:** the playfield, five bumpers, flippers, and display plates are generated raster assets with transparent edges where needed, shipped as WebP. The ball, rails, hinges, and supports use real Three.js geometry. Artwork is about 819 KB total. Existing-demo screenshots replace fictional preview illustrations. Neutral bumper artwork allows new demos to occupy any featured slot without rebaking labels into images.
- **Copy/content:** uses Beyond Localhost throughout, the approved launch slogan, real demo titles and counts, explicit Open demo navigation, and short playable controls. Only five real demos ship. New folders enter the archive automatically; dates choose the five featured entries. The sample collection remains test data.
- **Icons and affordances:** Phosphor icons share consistent sizes and weights. Bumpers and their DOM labels select previews. Links open demos explicitly; impacts never navigate unexpectedly. Mobile controls use semantic buttons and pointer capture.

## Comparison history

1. Source and running desktop/mobile/archive were paired into combined comparison inputs. The mobile archive brand treatment was identified as P2; the result remained blocked while it was corrected. Earlier responsive text, hardware proportions, rail initialization, and focus issues were also fixed during implementation review.
2. Captured the revised archive at 390 × 844 and reopened the updated combined comparison. Captured the settled desktop after resizing and reopened the desktop pair. Brand hierarchy, target spacing, text containment, and readable controls now pass. Replaced one capture taken before the browser had finished painting after resize; that transient capture was not treated as a product defect.

## Interaction and build validation

- Root `bun run build`: passed, building all five demos plus the homepage.
- Final homepage TypeScript check and production build: passed.
- `bun test`: 5 tests, 2,418 assertions. Covers all-target reachability at mobile/desktop simulation scales, pause, frame-rate independence, drain/relaunch, and automatic catalogue growth from 30 to 31 apps.
- All six production HTML routes return 200 with their own expected titles. Open demo was followed in the browser and rendered Cult UI locally.
- Browser: launch, ball impacts, direct bumper/label selection, reset, theme persistence, search, empty state, category filter, A–Z sorting, archive pause, Escape close, focus trapping/restoration, and responsive resizing checked.
- Production navigation produced no captured runtime console errors. A development HMR reload error occurred while replacing image formats; it did not recur in the production build.

## Open questions and test limits

No decision blocks this implementation. Physical iOS/Android devices and browsers without WebGPU were not available for live testing. The WebGPU guard retains the DOM catalogue and direct links; it never renders the game through a WebGL backend. Reduced-motion behavior is implemented through MotionConfig, CSS media queries, and renderer preferences and was reviewed in code, rather than tested through an OS preference change. Multitouch hardware testing remains outside this desktop browser session.

## Implementation checklist

- [x] Three.js WebGPU scene and independent fixed-step simulation.
- [x] Responsive light/dark table and searchable archive.
- [x] Catalogue discovery and existing route preservation.
- [x] Browser screenshots, source comparisons, and actual running-app video.
- [x] Build, meaningful simulation/catalogue tests, and browser interaction checks.

## Follow-up polish

- [P3] Future demos can provide focused preview artwork through package metadata instead of using full-page screenshots or the generic fallback thumbnail.
- [P3] The native touch deck is visually simpler than the painted hardware in the concept; additional decorative bezels can be considered without changing its input model.
