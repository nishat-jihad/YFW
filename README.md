# Your Future

Study planner (home, daily tracker, timer, weekly routine, statistics, exams, settings).
Plain HTML/CSS/JS, no build step, no database. Data lives in the browser (IndexedDB).

## Run
Open `index.html`, or serve the folder: `python3 -m http.server`.

## Deploy on GitHub Pages
1. Create a repo and upload everything in this folder (index.html at the repo root).
2. Settings > Pages > Deploy from a branch > `main` / root > Save.
3. Open `https://<user>.github.io/<repo>/`.

## Structure
- `src/css/styles.css` styles
- `src/css/icons.css` navigation icons
- `src/js/state.js` helpers and data model, `storage.js` IndexedDB
- `components.js` modal, form, card, chart, `stats.js` calculations
- `timer.js` timestamp timer and Pomodoro, `pip.js` floating timer
- `actions.js` button handlers and JSON backup/import
- `nav.js` navigation, `views.js` pages, `app.js` startup

## Notes
- Backup: Settings > Export all data. Restore: Settings > Import data from JSON file.
- Floating timer uses the browser's Picture-in-Picture; not available on every phone browser.
- Offline install (PWA/service worker) is not included.

## Offline and old backups
- `sw.js` (project root) caches the app so it opens without internet or after a power cut. After uploading a new version, change `CACHE` in `sw.js`.
- Settings > Import data from JSON file also accepts backups from the old version (`app: yourfuture`); sessions, tasks, targets, locked days and exams are converted.
