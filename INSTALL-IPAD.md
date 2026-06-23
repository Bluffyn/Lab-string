# Install String Lab On iPad

String Lab is an offline-capable Progressive Web App. For full offline Home Screen behavior on iPad, deploy this folder to an HTTPS static host first.

## Install From HTTPS

1. Deploy the full `string-lab-ipad-app-20260612-090257` folder as static files.
2. Open the HTTPS URL in Safari on the iPad.
3. Tap the Share button.
4. Tap `Add to Home Screen`.
5. Name it `String Lab`.
6. Open String Lab from the Home Screen while online.
7. Visit every tab once: Practice, Progressions, Loop Companion, Guitar CAGED, Cuatro, Aerobics.
8. Turn on Airplane Mode.
9. Force close String Lab and reopen it from the Home Screen.
10. Confirm the app loads and saved practice plans remain available.

## GitHub Pages

1. Create a GitHub repository.
2. Copy all files from this folder into the repository root, including `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, and the icon files.
3. Commit and push.
4. In GitHub, open `Settings > Pages`.
5. Set the source to the main branch root.
6. Wait for the Pages URL to publish.
7. Open the Pages HTTPS URL on iPad Safari and add it to the Home Screen.

## Cloudflare Pages

1. Create a new Cloudflare Pages project.
2. Connect a Git repository that contains this folder's static files.
3. Leave the build command empty.
4. Set the output directory to `/` if the files are at the repository root.
5. Deploy.
6. Open the Cloudflare Pages HTTPS URL on iPad Safari and add it to the Home Screen.

## Netlify

1. Drag the app folder into Netlify's manual deploy area, or connect a Git repository.
2. Leave build settings empty for a static deploy.
3. Publish the site.
4. Open the Netlify HTTPS URL on iPad Safari and add it to the Home Screen.

## Development Only

Opening `index.html` directly from Files or serving the app from plain `http://` is not enough for reliable offline PWA installation on iPad. Localhost is useful for testing:

```sh
python3 -m http.server 8773
```

Then open:

```text
http://localhost:8773/install-ipad.html
```

Use HTTPS hosting for the final install.

## Troubleshooting

- If an old version appears, delete the Home Screen icon, clear Safari website data for the app host, reload the HTTPS page, and add it again.
- If offline launch fails, open the app online and visit each tab once before testing Airplane Mode.
- If the metronome is silent, tap Start after the app is visible. iPadOS requires a user gesture before Web Audio can play.
- If saved plans disappear after clearing Safari data, restore them from the String Lab JSON backup.
