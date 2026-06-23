# String Lab iPad Install

String Lab is a static offline-first PWA. It has no server dependency after the first successful load.

For the current installable iPad PWA workflow, start with `INSTALL-IPAD.md`. HTTPS hosting is the recommended final install path; localhost is for development testing.

## Quick Chrome Preview

You can open `index.html` directly in Google Chrome for a quick desktop preview. The app includes a classic `app.js` fallback bundle so tabs and controls work from a local file.

For iPad offline installation, still use Safari with HTTPS hosting or iPad-local `localhost` so the service worker can register.

## Serve Locally From A Computer

1. Unzip `string-lab-ipad-app-20260612-090257.zip`.
2. Open a terminal in the unzipped folder.
3. Start a local web server:

```powershell
python -m http.server 8773
```

4. Find the computer IP address on the same Wi-Fi network.
5. On the iPad, open Safari to:

```text
http://YOUR-COMPUTER-IP:8773/install-ipad.html
```

This local-network HTTP method is useful for previewing. For dependable offline installation on iPad, use HTTPS hosting or run the server on the iPad itself with a-Shell at `localhost`.

## Install On iPad From Safari

1. Open `install-ipad.html` in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Name it `String Lab`.
5. Launch it once while still online.
6. Open each tab once: Practice, Progressions, Loop Companion, Guitar CAGED, Cuatro, Aerobics.

## Offline Smoke Test

1. Serve app locally.
2. Open in Safari.
3. Add to Home Screen.
4. Open every main tab once.
5. Turn on Airplane Mode.
6. Force close the app.
7. Relaunch from Home Screen.
8. Confirm all major modules still work.

## Optional a-Shell Method

If you use a-Shell on iPad:

```sh
cd ~/Documents/string-lab-ipad-app-20260612-090257
python -m http.server 8773
```

Then open `http://localhost:8773/install-ipad.html` in Safari.

## HTTPS Hosting Recommendation

For offline PWA behavior, host the folder on HTTPS or serve it from `localhost` on the iPad. Plain `http://` over a local network can preview the app, but Safari will not reliably register the service worker from an insecure origin.

## Troubleshooting Service Worker Updates

- If an old version keeps loading, open Safari Settings, clear website data for the app host, then reload `install-ipad.html`.
- If Home Screen still opens the old app, delete the Home Screen icon and add it again.
- If offline mode fails, open the app while online and visit every tab once before turning on Airplane Mode.
- If audio does not start, tap Play in the metronome after the app is visible. iPadOS requires a user gesture before web audio can play.
