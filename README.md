# VOXEL — Minecraft Mod Universe

A responsive, space-themed Minecraft mod discovery platform built with vanilla HTML, CSS, and JavaScript. No build step or dependencies required.

## Run it

Open `index.html` in a browser, or serve this directory with any static file server (for example, `python -m http.server 8000`).

## Features

- Search by mod name, creator, category, and tags; category filters and sorting.
- Featured mods and responsive mod cards.
- Mod detail popup with a screenshot gallery and interactive community ratings.
- Creator Studio dashboard with add, edit, delete, and featured controls.
- Persistent browser storage for dashboard edits and ratings.
- Animated starfield, optional light theme, keyboard search shortcut (`⌘/Ctrl + K`), and reduced-motion support.

## Prototype notes

This is a front-end demo. Dashboard changes and ratings are saved to local storage in the current browser only. There is no authentication, shared database, or real mod download integration. Sample cover art is loaded from Unsplash; replace image URLs in `app.js` with your own mod screenshots and add real download links when connecting a backend.
