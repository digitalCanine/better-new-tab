# Better New Tab

A terminal-styled new tab page with search, weather, and command system. Perfect for users who want their browser to feel like home.

![Version](https://img.shields.io/badge/version-1.0.1-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🖥️ **Terminal-Inspired Interface** - Scanline effects, monospace fonts, and command-line aesthetics
- ⚡ **Quick Search Commands** - Instantly search Google, YouTube, GitHub, and more with `!` prefixes
- 🎨 **Customizable Color Scheme** - Change all colors to match your terminal setup
- 🌦️ **Live Weather** - Auto-detects your location and displays current conditions
- 📜 **Search History** - Recent searches displayed as quick-access tiles
- 🔧 **Built-in Commands** - `!help`, `!neofetch`, `!config`, and more
- 💾 **Persistent Settings** - Your colors and history sync across browser sessions

## Example

<img width="1913" height="1075" alt="image" src="https://github.com/user-attachments/assets/8bfb40e5-707f-4536-9a33-3556c8cc7157" />

## Installation

### From Mozilla Add-ons

*Extension pending review*

### Manual Installation

1. Download the latest release from [Releases](../../releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon → "Install Add-on From File"
4. Select the downloaded `.xpi` file

Note that this release is my own private version for now

### Development Installation

1. Clone this repository
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" → "Load Temporary Add-on"
4. Select the `manifest.json` file from the cloned directory

### Setting as Homepage

Firefox only allows automatic new tab replacement. If you’d like similar behavior for your homepage, you can manually set it using a bookmark.

## Usage

### Basic Search

Just type anything and press Enter to search on DuckDuckGo (default).

### Search Engine Commands

Prefix your search with these commands:

- `!gl [query]` - Google search
- `!ddg [query]` - DuckDuckGo search
- `!yt [query]` - YouTube search
- `!img [query]` - Google Images search
- `!gh [query]` - GitHub search
- `!az [query]` - Amazon search
- `!wiki [query]` - Wikipedia search
- `!maps [query]` - Google Maps search
- `!reddit [query]` - Reddit search
- `!x [query]` - X (Twitter) search

**Examples:**

```
!yt lofi hip hop
!gh rust projects
!wiki quantum computing
```

### Terminal Commands

These commands display output in the terminal interface:

- `!help` - Show all available commands
- `!config` - Open color configuration panel
- `!neofetch` - Display browser/system information
- `!hist` - View search history

### Customizing Colors

1. Type `!config` in the search bar
2. Enter hex colors for each theme variable:
   - **Background** - Main background color
   - **Foreground** - Text color
   - **Accent** - Prompt and highlights
   - **Green** - Success messages and keys
   - **Orange** - Headers and time
3. Click "Apply" to save changes
4. Click "Reset to Default" to restore original colors

## Default Color Scheme

The extension comes with a warm, terminal-inspired palette:

```
Background:    #141414
Foreground:    #feffd3
Accent:        #c06c43
Green:         #afb979
Orange:        #c2a86c
```

## How It Works

Better New Tab replaces your browser's new tab page with a custom interface featuring:

- **Real-time Clock** - Updates every second in the top-right
- **Weather Widget** - Uses ipapi.co for location and Open Weather Map for weather data
- **Command System** - Parses `!` prefixed commands for shortcuts
- **Search History** - Stores your last 6 searches with favicon icons
- **Color Customization** - CSS variables updated dynamically and saved to Chrome storage

The weather is fetched on page load:

1. Gets your approximate location via IP geolocation
2. Fetches current weather from Open Weather Map (free, no API key needed)
3. Displays: `City / Temperature / Condition`

## Project Structure

```
better-new-tab/
├── manifest.json       # Extension manifest (v3)
├── newtab.html        # Main page structure
├── styles.css         # All styling and theme variables
├── newtab.js          # Logic for search, commands, and weather
├── icon16.png         # Extension icon (16x16)
├── icon48.png         # Extension icon (48x48)
├── icon128.png        # Extension icon (128x128)
└── README.md          # This file
```

## Building

No build process required! This is vanilla JavaScript.

To package for distribution:

```bash
zip -r better-new-tab.zip manifest.json newtab.html newtab.js styles.css icon*.png
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions

- Additional search engine shortcuts
- More terminal commands
- Keyboard shortcuts (Ctrl+K to focus, etc.)
- Preset color themes (Gruvbox, Nord, Dracula)
- Custom background images
- Bookmark quick-access

## Privacy

This extension:

- ✅ Does NOT collect any personal data
- ✅ Does NOT track your browsing
- ✅ Only stores your color preferences and search history locally

**External APIs used:**

- `ipapi.co` - IP geolocation (to determine weather location)
- `api.open-meteo.com` - Weather data (free, no authentication)
- `icons.duckduckgo.com` - Favicon fetching for search history tiles

All settings stay on your device and sync through browser storage and Firefox Sync if enabled.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Inspired by terminal emulators and minimalist new tab extensions
- Weather data provided by [Open Weather Map](https://openweathermap.org/)
- Built for keyboard warriors and terminal enthusiasts
- Thanks to all contributors and users!

## Support

- 🐛 Found a bug? [Open an issue](../../issues)
- 💡 Have a suggestion? [Open an issue](../../issues)
- ⭐ Like this extension? Star this repo!

## Roadmap

- [ ] Import/export color schemes
- [ ] Preset terminal themes (Gruvbox, Nord, Dracula, Catppuccin)
- [ ] Keyboard shortcuts (Ctrl+K, Esc to clear)
- [ ] Bookmarks integration
- [ ] Custom search engine aliases
- [ ] Background image support
- [ ] Local time zones for different cities
- [ ] Sticky notes / todo list command
- [ ] `!calc` command for quick math
- [ ] Browser history search integration

---

**Made with ☕ and 💻 by terminal lovers, for terminal lovers**
