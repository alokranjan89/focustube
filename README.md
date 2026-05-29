# FocusTube

A Chrome extension for blocking distracting YouTube videos when FocusTube is turned on.

---

## Overview

FocusTube is designed to help engineers, students, and knowledge workers stay productive on YouTube by blocking distractions only when the extension is enabled. When FocusTube is off, YouTube remains unchanged.

---

## Features

- **Keyword-based blocking**: Hide videos by keyword, phrase, or regex.
- **Channel blocking**: Prevent entire channels from appearing in recommendations.
- **Focus session card**: Start sessions, track streaks, and monitor daily focus goals.
- **Weekly progress view**: See trends in blocked videos and productivity.
- **Career Mode**: Choose a career track and align filters with your goals.
- **Onboarding guidance**: Clear setup steps for first-time users.
- **Dark theme, premium UI**: polished cards, subtle shadows, responsive grid layout.
- **Chrome storage sync**: State persists across devices using Chrome sync.

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Load into Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

---

## How to Use

### Popup
- Open FocusTube from the toolbar
- See your active focus status and blocked video count
- Open the options dashboard for deeper control

### Options dashboard
- Manage blocked keywords, allowlist terms, and blocked channels
- Track focus streak, productivity, and weekly trends
- Select a career focus and keep your filters aligned
- Enable focus mode and preview analytics

### YouTube behavior
- The content script runs on YouTube pages
- Matching videos are hidden automatically
- Video blocking rules update in real time

---

## Project Structure

```text
public/                  ← Static extension assets and manifest
  ├── manifest.json
  ├── content.css
  └── icons/
src/                     ← Source code
  ├── entrypoints/       ← Chrome/Vite runtime entrypoints
  │   ├── background.ts
  │   ├── content.ts
  │   ├── options.tsx
  │   └── popup.tsx
  ├── components/
  │   ├── dashboard/
  │   ├── Button.tsx
  │   ├── Card.tsx
  │   └── ...
  ├── content/           ← YouTube page scanning and blocking
  ├── hooks/
  ├── popup/
  ├── options/
  ├── services/
  ├── styles/
  └── types/
docs/                    ← Product and verification documentation
  ├── FEATURE_GUIDE.md
  ├── QUICK_START.md
  └── VERIFICATION.md
package.json
README.md
```

---

## Architecture

- **React + TypeScript** for popup and options UI
- **Tailwind CSS** for modern responsive styling
- **Chrome MV3** with background service worker
- **Typed storage** using Zod validation and Chrome storage APIs
- **YouTube content script** optimized for dynamic page updates

---

## Testing

Run unit tests with:

```bash
npm exec vitest run
```

---

## Build Output

The production build generates extension assets in `dist/`. Use that folder when loading the unpacked extension into Chrome.

---

## Publishing Checklist

- Run `npm run build`
- Zip the contents of `dist/`
- Upload to the Chrome Web Store
- Provide extension name, description, screenshots, and privacy policy

---

## Notes

- `manifest.json` targets YouTube with `host_permissions`
- `storage` permission is used for settings persistence
- The extension is intentionally controlled by one master on/off switch

---

## What’s next

Potential improvements:

- richer Pomodoro-style session controls
- deeper focus analytics
- localized UI support
- smarter rule recommendations

---

FocusTube is now a polished browser extension with a premium dashboard, meaningful insights, and better on-device focus control.
