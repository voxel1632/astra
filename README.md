# VOXEL — Minecraft Mod Universe

Responsive, space-themed Minecraft mod discovery platform built with vanilla HTML, CSS, and JavaScript.

## Run
Open `index.html` in a modern browser, or serve this directory (for example: `python -m http.server 8000`). Browser IndexedDB is used for uploaded binary assets. Using a local HTTP server is recommended because `file://` browser storage behavior differs by browser.

## Uploads and downloads
Creator Studio accepts `.mcpack`, `.mcaddon`, and `.zip` files (up to 250 MB), plus optional icon, banner, and screenshot images. Mod binaries and image uploads are persisted as Blob records in IndexedDB; listing metadata, ratings, and download counts are kept in localStorage. The detail page shows file type and size. Download starts from the stored binary and increments its listing's count.

This is a **single-browser local demo**, not a shared file hosting service. Files are only available in the browser profile/device where they were uploaded. Clearing site data removes them. Browser storage limits and availability vary. A production multi-user platform needs authenticated creator accounts, server-side validation/scanning, object storage, and a database/API; this static prototype does not provide secure authentication or cross-user downloads.

## Other features
Search, category filters, sorting, featured listings, ratings, image gallery, responsive layout, animated stars, light theme, and `⌘/Ctrl + K` search shortcut.
