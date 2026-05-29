# Project Structure

FocusTube is organized around Chrome extension runtime boundaries and shared application code.

```text
.
├── docs/                  Product, setup, and verification notes
├── public/                Static extension assets copied into dist
│   ├── manifest.json      Chrome MV3 manifest
│   ├── content.css        Styles injected into YouTube pages
│   └── icons/             Extension icons
├── src/
│   ├── entrypoints/       Files used directly by Vite/Chrome
│   ├── content/           YouTube DOM scanning, observers, filters, actions
│   ├── popup/             Popup React app
│   ├── options/           Options React app
│   ├── components/        Shared UI components
│   ├── hooks/             React hooks
│   ├── services/          Storage, messaging, analytics, filtering services
│   ├── styles/            Global Tailwind stylesheet
│   ├── types/             Shared TypeScript types
│   └── __tests__/         Unit tests
├── popup.html             Vite HTML input for the extension popup
├── options.html           Vite HTML input for the options page
└── vite.config.ts         Extension build configuration
```

## Runtime Entrypoints

- `src/entrypoints/background.ts`: Chrome service worker.
- `src/entrypoints/content.ts`: YouTube content script bootstrap.
- `src/entrypoints/popup.tsx`: React popup mount.
- `src/entrypoints/options.tsx`: React options page mount.

The production extension is generated in `dist/` with `npm run build`. Load `dist/` as the unpacked Chrome extension.
