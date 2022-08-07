# Voracious

Voracious is a video player app for Mac/Windows/Linux with special features for studying foreign languages (esp. Japanese).

![screenshot](docs/demo_screenshot.jpg "Screenshot")

Voracious lets you:
- **Scan and browse** your media collection ala Kodi or Plex
- Simultaneously display **multiple subtitle languages/tracks** (all common formats supported)
- Quickly **replay** the current subtitle and navigate forward and back *by subtitle* using the keyboard
- Train your listen/reading/comprehension with **special viewing modes** that automatically pause and hide/reveal subtitles
- Automatically generate **furigana** annotations _(Japanese only)_
- Hover over words to see **dictionary definitions** _(Japanese only)_
- Import and use **EPWING** dictionaries _(limited to certain popular Japanese EPWINGs)_
- **Export subtitles as sentence cards** to Anki (with audio and/or image, ala [subs2srs](http://subs2srs.sourceforge.net/)), instantly via [AnkiConnect](https://ankiweb.net/shared/info/2055492159)
- _(coming soon)_ **Search for words/phrases** over your entire library of subtitles

# Using Voracious (Quick Start)

Before using Voracious, you need to have a media collection that's organized and named the same way you would for Kodi or Plex _(each show/movie in its own directory, subtitle filename matching video filenames, etc.)_. Note that Voracious cannot currently play some popular video/audio codecs, including H.265 and AC3. Also, keep in mind that Voracious won't be useful unless you have subtitles in the language you're trying to learn.

If your media collection is ready to go, open Voracious and hit the *Add Collection* link. Select the folder where your collection lives, and give it name, and add it. On the Library page, you can browse your collection and play videos (videos without any available subtitles will appear grey). In the player, check the help overlay for keyboard controls, and try different subtitle modes.


# Development

## Overview and repo structure

Voracious is mostly built as a single-page web app with React (using `create-react-app`), and then packaged as a cross-platform desktop app using Electron. As with a normal electron app, the bulk of the code is in `src/` with some static resources in `resources/`. The output of webpack (after `npm run pachage`) will go into `release/build/`.

The application divided between `/src/main` and `/src/renderer`, according Electron application structure. `/src/main/` dir contains all staff for nodejs and OS. 

Most third-party dependencies are pure JS (`react`, `immutable`, etc.) and are declared in the root `package.json`.

Dependencies that use native code (e.g. `sqlite`) need to be compiled against the Electron V8 runtime, and are declared in `/release/app/package.json`. The corresponding `/release/app/node_modules/` _is_ packaged into the final distributed Electron app.


## Installing for development

To install for development you'll first need NodeJS (12v or higher), npm, and some extra build tools for node-gyp ([see here](https://github.com/nodejs/node-gyp)). Then:

```
$ npm install # install pure-JS and development dependencies
```

## Running in development mode

Start the app with:
```
$ npm start
```

## Building for release
For current platform
```
$ npm run package
```

For mac
```
$ npm run package-mac
```

For windows
```
$ npm run package-win
```

For linux
```
$ npm run package-linux
```

The output archive/executable can then be found in the `/release/app/build` dir.
