# Nets of Polyhedra

Four models: cube, rectangular prism, triangular prism, and square pyramid.
The square pyramid has five faces, eight edges, and five vertices. Its net
has one square with a triangle hinged to each of its four sides.

## Upload

Replace the `nets-ar` folder in the existing GitHub Pages repository with this
folder. The root `index.html` in the update package also mentions the pyramid.
The original three printed markers still work. The fourth page of
`print-markers.pdf` is the new square pyramid marker.

## AR viewport repair

The AR.js 3.4.7 portrait image path and the embedded A-Frame viewport previously
used different aspect-ratio assumptions. `ar-viewport.js` fits native video
frames into the tracking canvas without stretching and transforms the calibrated
projection to the same centered cover crop as the displayed video. The WebGL
canvas uses the window viewport. No model dimensions are changed.

The adapter targets the pinned AR.js version; review it before upgrading AR.js.
Default camera calibration remains approximate and physical-phone testing is
required. Do not compensate for camera distortion by stretching model geometry.

## Validation

Numerical tests check rigid face dimensions, shared hinge endpoints, fully flat
nets, camera/video pixel alignment across portrait/landscape camera dimensions,
and the projection adapter lifecycle. Run with a local Three.js ES module:

    node nets-ar/tests/geometry.mjs /absolute/path/to/three.module.mjs

The square pyramid solid and top-view net have also been checked in browser
preview. The marker PDF has four pages and its new page has been visually checked.

Before classroom use, scan each marker on iPhone Safari and Android Chrome.
Check a front, oblique, and side view with the unfold slider at 0%, 50%, and 100%.
Rotate the phone between portrait and landscape. Confirm the solid remains
aligned with the marker, keeps its proportions, and folds without separating
its faces. A live iPhone scan has not yet been performed for this update.

`tools/pyramid-marker.py` regenerates the pyramid PNG/pattern and fourth PDF page
using Pillow, pypdf, and reportlab. Existing marker pages are retained.
