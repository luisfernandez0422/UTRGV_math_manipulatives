# Verification

Checked locally on September 24, 2026:

- Loaded the actual A-Frame 1.6.0 and AR.js 3.4.7 scripts in an isolated headless desktop Chrome session, with a simulated camera.
- Opened the page at a 390 x 844 phone-sized viewport; checked the layout visually and clicked Start through the normal UI.
- Confirmed camera initialization and creation of the ARToolKit controller using the packaged calibration file and custom pattern.
- Fed the packaged marker image into the real ARToolKit tracker: recognized as pattern ID 0 with confidence 0.99948 in this controlled frontal image test. This is template-match confidence, not a real-world success-rate estimate.
- Checked the edge toggle and tracking tips controls; no uncaught browser errors.
- Rendered and visually inspected the one-page PDF for layout and readable instructions.

Not yet verified: physical printed-marker tracking, live iPhone Safari or Android Chrome camera behavior, school network filtering, or deployment to your existing site. Complete the phone checklist in README.md before classroom use. Browser tests used local copies of the exact pinned CDN scripts; actual devices still need access to the listed CDN hosts.
