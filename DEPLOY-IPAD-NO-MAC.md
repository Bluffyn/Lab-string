# Deploy String Lab To iPad Without A Mac

String Lab is a static, offline-first Progressive Web App. You do not need a Mac, Xcode, TestFlight, or a native iOS build. Deploy this folder to an HTTPS static host, open the HTTPS URL in Safari on the iPad, then add it to the Home Screen.

OneDrive is useful for storing or moving this folder or ZIP file, but it is not a reliable PWA host. OneDrive sharing links usually open a file-preview page, not a stable static web origin with the correct service-worker scope, MIME types, and browser cache behavior.

## Before You Deploy From Windows

Deploy the contents of the app folder, with `index.html` at the hosted root of the site or at the root of the GitHub Pages project path.

Required files should stay together:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- `service-worker.js`
- `install-ipad.html`
- `icon.svg`
- `icon-180.png`
- `icon-192.png`
- `icon-512.png`
- `icon-maskable-512.png`
- `src/`

The app uses relative paths, so the same files work from these deployment shapes:

- `https://example.pages.dev/`
- `https://username.github.io/string-lab/`
- `https://example.netlify.app/`
- Azure Static Web Apps generated URLs

Do not change paths to root-relative URLs like `/app.js` or `/manifest.webmanifest`; those break project-subfolder hosting such as GitHub Pages at `/string-lab/`.

## Cloudflare Pages Direct Upload

1. On Windows, open the folder that contains `index.html`.
2. Go to the Cloudflare dashboard.
3. Open `Workers & Pages`.
4. Choose `Create application`.
5. Choose `Pages`.
6. Choose `Upload assets` or `Direct Upload`.
7. Upload the app folder, or upload a ZIP whose top level contains `index.html`.
8. Deploy the site.
9. Open the generated `https://...pages.dev/` URL in a desktop browser once to confirm it loads.
10. Open the same URL in Safari on the iPad.

Cloudflare Pages gives the HTTPS origin needed for service-worker caching and Home Screen installation.

## Netlify Manual Deploy

1. On Windows, open the folder that contains `index.html`.
2. Go to `https://app.netlify.com/`.
3. Choose `Add new site`.
4. Choose `Deploy manually`.
5. Drag the app folder into the deploy area, or drag a ZIP whose top level contains `index.html`.
6. Wait for Netlify to finish the deploy.
7. Open the generated `https://...netlify.app/` URL in a desktop browser once to confirm it loads.
8. Open the same URL in Safari on the iPad.

If Netlify shows a directory listing or a missing page, the uploaded ZIP probably contains an extra parent folder. Re-upload so `index.html` is at the deploy root.

## GitHub Pages

GitHub Pages is a good option when you want a stable URL like:

`https://username.github.io/string-lab/`

Recommended project Pages setup:

1. Create a GitHub repository, for example `string-lab`.
2. Copy the app files into the repository root. `index.html` should be beside `app.js`, `styles.css`, `manifest.webmanifest`, and `service-worker.js`.
3. Commit and push to the `main` branch.
4. In GitHub, open the repository.
5. Go to `Settings`.
6. Go to `Pages`.
7. Under `Build and deployment`, choose `Deploy from a branch`.
8. Select branch `main`.
9. Select folder `/root`.
10. Save.
11. Wait for GitHub Pages to publish the HTTPS URL.
12. Open `https://username.github.io/string-lab/` in Safari on the iPad.

Alternative `/docs` setup:

1. Put all app files inside a `docs/` folder.
2. In GitHub Pages settings, choose branch `main` and folder `/docs`.
3. Keep app paths relative. Do not change them to `/docs/app.js`.

GitHub Pages project sites use a subpath. This app is configured for that: the manifest uses `./index.html`, the service worker registers from `./service-worker.js`, and app assets are loaded with `./` paths.

## Azure Static Web Apps Notes

Azure Static Web Apps also works because String Lab is plain static HTML, CSS, and JavaScript.

Useful settings:

- App location: the folder containing `index.html`.
- Build command: none.
- Output location: blank, or the same folder if Azure asks for one.
- API location: blank.

After deployment, open the generated HTTPS URL, usually similar to:

`https://<generated-name>.<region>.azurestaticapps.net/`

Azure Static Web Apps is a normal HTTPS static host, so the service worker can cache the app after the first successful online load.

## Install On iPad From Safari

1. On the iPad, open Safari.
2. Visit the deployed HTTPS URL. Use Safari, not Chrome, Files, or a OneDrive preview page.
3. Wait for String Lab to load.
4. Tap the Share button.
5. Tap `Add to Home Screen`.
6. Keep the name `String Lab`, or rename it if you prefer.
7. Tap `Add`.
8. Open String Lab from the new Home Screen icon while still online.
9. Open each main tab once: `Practice`, `Progressions`, `Loop Companion`, `Guitar CAGED`, `Cuatro`, and `Aerobics`.
10. If you plan to use audio, tap the metronome or `Play MIDI` once while online so iPad Safari can grant the required user-gesture audio permission.

Opening the app from the Home Screen is the real installed PWA experience.

## Offline Test

Use this checklist after the first online load:

1. Open String Lab from the iPad Home Screen while online.
2. Visit every main tab once.
3. In `Loop Companion`, generate a plan.
4. Save a plan if you want to test local data persistence.
5. Wait about 10 seconds so the service worker can finish caching.
6. Turn on Airplane Mode.
7. Force close String Lab.
8. Reopen String Lab from the Home Screen.
9. Confirm the app opens without the network.
10. Confirm the tabs still work.
11. Confirm generated or saved practice data is still available.
12. Tap the metronome or `Play MIDI` to confirm audio starts after user interaction.

If offline launch fails:

1. Turn Airplane Mode off.
2. Delete the Home Screen icon.
3. In iPad Settings, clear Safari website data for the deployed host if needed.
4. Reopen the HTTPS URL in Safari.
5. Wait for the app to load.
6. Add it to the Home Screen again.
7. Repeat the offline test.

## Verification Targets

This app is intended to keep these PWA path rules:

- `index.html` loads the manifest from `./manifest.webmanifest`.
- JavaScript registers the service worker from `./service-worker.js`.
- `manifest.webmanifest` uses `"start_url": "./index.html"`.
- `manifest.webmanifest` uses `"scope": "./"`.
- Asset paths are relative so subpath hosting works.
- After the first online load, the service worker can reload the app shell offline.

