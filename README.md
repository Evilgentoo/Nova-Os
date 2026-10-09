# NOVA OS

NOVA OS is a lightweight, self-hostable browser desktop built with plain HTML, CSS, and JavaScript. No build tools or server-side runtime are required.

## Run locally

1. Extract `nova-os.zip`.
2. Open `index.html` in a modern browser.

For a local HTTP server (recommended if your browser restricts local file behavior):

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Included

- Animated boot screen (can be toggled in Settings)
- Desktop shortcuts, Start menu, search, taskbar, draggable app windows, minimize/maximize/close
- Wallpaper choices and accent colors
- User profile customization
- Notes saved in browser local storage
- Calculator
- Playable Snake with keyboard and on-screen controls, score and local best score
- Game Center, NOVA Store, File Explorer, demo music player, About panel
- Responsive layout for desktop and smaller screens

## Self-hosting

Upload the extracted files to any static web host (GitHub Pages, Netlify, Cloudflare Pages, or a basic web server). `index.html` should be at the published root.

## Notes

- Preferences and notes are stored locally in the current browser using `localStorage`; they do not sync between devices.
- Wallpaper photography is loaded from Unsplash and the font from Google Fonts. For fully offline hosting, download and bundle your preferred images and fonts, then update `style.css`.
- The music player is a visual demo and does not stream audio.
- This is a browser desktop simulation, not a real operating system and does not access your computer's actual files.
