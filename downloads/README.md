# Downloads: integration and poster uploads

This page matches the existing Mathematics collection homepage: orange accents, serif heading, system body font, rounded cards, and existing category navigation. It adds All posters / For teachers / For students filters, image previews, View PDF and Download PDF links. A poster can belong to both audiences.

## Install on the existing GitHub Pages website

1. Open the `luisfernandez0422/UTRGV_math_manipulatives` repository on GitHub and use the branch/folder already configured for GitHub Pages.
2. Upload the entire `downloads` folder from this package to the same folder as the site's `index.html`. Unzip the package first; uploading the ZIP itself will not install the page.
3. Edit the existing homepage `index.html`. Within `<nav class="category-nav" ...>`, directly after the Course Tools link, add:

   ```html
   <a href="downloads/">Downloads</a>
   ```

   A ready-to-use updated homepage is included. It was based on repository commit `2c7bc66`; its only change is this link. If the homepage has changed since then, add the one line manually instead of replacing the file.
4. Commit the changes. Wait for the repository's existing GitHub Pages deployment to finish, then visit:
   https://luisfernandez0422.github.io/UTRGV_math_manipulatives/downloads/
5. Confirm that all category links return to the correct homepage sections.

No new service, build system, dependencies, or hosting configuration is needed. The Downloads page is installed in this repository.

## Add your first poster

GitHub Pages serves static files. Upload posters using GitHub's **Add file → Upload files** or a local repository, then update the catalog. There is no public upload form on this page.

1. Put your PDF in `downloads/posters/`, for example `fraction-models.pdf`.
2. Export the first page as a PNG, JPEG, or WebP and put it in `downloads/previews/`, for example `fraction-models.png`. A preview about 900 pixels wide is a useful starting point. Keep the full poster visible rather than cropping it. The preview and PDF should show the same poster.
3. Edit `downloads/posters.js`. Replace its empty array with your poster entry:

   ```js
   window.MATH_POSTERS = [
     {
       title: "Fraction Models",
       description: "Compare fractions using area models and number lines.",
       audiences: ["teachers", "students"],
       pdf: "posters/fraction-models.pdf",
       preview: "previews/fraction-models.png",
       previewAlt: "Fraction area models and number lines arranged for comparison.",
       paperSize: "US Letter · 8.5 × 11 in",
       fileSize: "1.2 MB"
     }
   ];
   ```

   This is an example only: no Fraction Models poster is included. Replace all details with those of your actual file, including its paper size and file size. For teacher-only posters use `["teachers"]`; student-only posters use `["students"]`. The optional `paperSize` and `fileSize` fields may be omitted.
4. For additional posters, add objects separated by commas inside the same array. Catalog order is display order. Use straight quotes and exact, case-sensitive filenames; lowercase hyphenated filenames are easiest to maintain.
5. Commit the PDF, image, and catalog together. After deployment, check the preview, each audience filter, and both PDF links. Some browser settings may open a PDF instead of saving it; use the PDF viewer's download button if needed.

Only same-folder PDF/image paths are accepted. Missing previews have a text fallback; missing PDFs must be corrected in the catalog (the page cannot verify file existence before a visitor opens a link). Titles and descriptions are inserted as plain text. JavaScript must be enabled to display the catalog.

## Initial content and maintenance

The catalog is intentionally empty because no poster files were supplied. The existing AR marker PDF was not relabeled as a mathematics poster. Visitors see “Posters are on the way” until you add your files. No sample download links are published.

The Downloads page copies the homepage's current design styles to stay self-contained. If you later redesign the site, update these styles and the navigation links as well. Existing manipulative pages are unchanged.
