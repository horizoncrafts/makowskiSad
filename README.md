# Makowski Sad Website

## Description

Just a simple website for a company that sells natural juices.
Plain HTML, CSS and JavaScript — no build step, no dependencies.

## Structure

- `index.html` — home page
- `ecology.html` — ecology page
- `styles.css` — all styles
- `script.js` — mobile menu
- `assets/` — images, videos and icons
- `design/` — design mockups

## Usage

Open `index.html` in a browser. That's it.

To edit, change the files and refresh the browser. To publish, upload the whole folder
(without `design/`) to any static hosting.

## Domain

Hosted on GitHub Pages (branch `main`, root) at `makowskisad.pl`. The `CNAME` file keeps
the domain attached on every deploy; do not delete it. DNS at OVH points only to GitHub
(Framer records removed):

- `@` A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `@` AAAA: `2606:50c0:8000::153` … `2606:50c0:8003::153`
- `www` CNAME: `horizoncrafts.github.io`

Settings → Pages → **Enforce HTTPS** is ticked. Live over HTTPS on both `makowskisad.pl`
and `www` (verified 2026-10-13).

## Contact

- [@piotr](https://github.com/piotr-horizoncrafts)
