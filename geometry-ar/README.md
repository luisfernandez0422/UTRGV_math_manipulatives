# Dr. Fernandez's Cube AR

A free, static marker-based WebAR prototype. Open the page, tap **Start camera**, allow the rear camera, and point at the custom F marker. A teal cube rests on the marker. Move the phone to see its faces; toggle its edges. No app, account, backend, build step, or 3D model download is required.

## Add to your existing GitHub Pages site

1. Copy the **entire `geometry-ar` folder** into your existing Pages publishing directory (the repository root, `/docs`, or your configured build output). Keep its file names and subfolders together. Do not replace your site's existing homepage.
2. Commit/upload the files and wait for your normal Pages deployment to complete.
3. Open `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/geometry-ar/` (or `https://YOUR-DOMAIN/geometry-ar/` for a custom domain).
4. Add a link from your manipulatives menu, for example `<a href="./geometry-ar/">Cube in AR</a>` when the menu is at the site's publishing root.
5. Print `print-marker.pdf` at 100% on matte white paper. The black square is 4 inches / 10.16 cm across. Keep the white margin. Share the hosted page link with students separately.

The URL examples are placeholders; this package has not been published. A QR code may later link to your real hosted page, but the included F marker is what anchors the cube. It is not a QR code and does not open the webpage by itself.

## Phone test (required before classroom use)

**iPhone:** Open the HTTPS link directly in Safari, tap Start camera, and allow camera access. Avoid an embedded browser inside an email/social app. If access was denied, use Safari's page/site settings to allow the camera, then reload.

**Android:** Open the HTTPS link directly in Chrome, tap Start camera, and allow access. If denied, update the site's camera permission in Chrome and reload.

For both: place the sheet flat in even light; start about 20–40 cm away with the whole black border visible. Move closer/farther as needed. Tilt the phone slightly to see the top and sides. The cube should remain attached to the sheet as the phone moves and disappear when the marker leaves the camera view. Reacquire it, toggle edges, rotate the phone, then tap Exit and confirm the camera stops. Test both portrait and landscape on the actual classroom devices. Some jitter is normal; no ARKit/ARCore installation is needed, but browser camera access and WebGL are required.

## Troubleshooting

- **No permission prompt / blank view:** use HTTPS and a full browser tab; check site and OS camera permissions. Close other camera apps and reload. Camera capture is not supported by opening the HTML as a local file.
- **Viewer loads but no cube:** ensure the `.patt` and calibration file return successfully at their relative paths. Print this exact marker, keep all four black corners visible, avoid glare, improve lighting, and move slowly. Do not substitute a stylized F or crop the border.
- **Libraries won't load:** the phone needs internet access to `aframe.io` and `cdn.jsdelivr.net`. School filters may block them. For managed/offline hosting, download the exact pinned scripts below, retain their licenses, and change the two `loadScript` URLs to local files. This package does not include those library scripts.
- **Scale:** cube width is 80% of the black marker width (about 8.1 cm on the supplied print). This is an instructional visual, not a calibrated measuring tool.

## Files and customization

- `index.html`: complete viewer, styles and app code; A-Frame 1.6.0 and AR.js 3.4.7 loaded only after Start.
- `print-marker.pdf`: one-page US Letter handout (also fits A4 using fit-to-page).
- `assets/fernandez-marker.svg` / `.png`: marker with white quiet zone.
- `assets/fernandez-cube.patt`: matching 16 x 16 pattern, BGR channels, four rotations.
- `assets/marker-inner.png`: training artwork without the black frame.
- `assets/camera_para.dat`: official AR.js camera calibration data from release 3.4.7.

To replace the cube, edit the children of `<a-marker>` in the scene template. The marker plane is XZ; positive Y is up. The cube has height 0.8 and center Y=0.4, so its bottom is on the paper. `size=1` is a normalized marker width; model dimensions are proportional to the printed marker. Tracking smoothing is disabled initially to avoid motion lag; tune it after physical testing if needed.

To add another custom marker, train its inner high-contrast asymmetric artwork with the official generator, save both the printable marker and `.patt` file, and add another `a-marker` with its own URL and shape. Keep `patternRatio: 0.5` when using the supplied border proportions. The custom F artwork is original to this prototype.

Camera frames stay in the browser; the app contains no recording, uploads, analytics, or storage. Loading the page and third-party libraries still makes ordinary network requests.

## References and third-party notices

- AR.js marker documentation: https://ar-js-org.github.io/AR.js-Docs/marker-based/
- Official marker generator: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
- A-Frame 1.6.0 (MIT): https://aframe.io/releases/1.6.0/aframe.min.js
- AR.js 3.4.7 (MIT, with embedded third-party notices): https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.js
- AR.js license: https://github.com/AR-js-org/AR.js/blob/3.4.7/LICENSE
- Camera calibration source: https://github.com/AR-js-org/AR.js/blob/3.4.7/data/data/camera_para.dat
- GitHub Pages HTTPS: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
