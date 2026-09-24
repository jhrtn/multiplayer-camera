# Multiplayer Camera

The camera grid, multiplayer. The room shows one camera per person, with their name. It's all cut into the camera project's tiles, and every cursor in the room pushes the same grid. Clicks drop wave sources that everyone sees.

```sh
npm install
npm run dev          # http://localhost:8082
```

Open it in two tabs (or two browsers) to see yourself twice. `?fake=3` repeats your feed as three extra people. `?test` sends a generated feed instead of the camera. `?room=name` picks a separate room.

- **Move:** push tiles. **Click:** drop a wave source; click it again to remove it.
- **M:** room → weave (everyone full frame, each tile from someone at random) → patch. **R:** reshuffle the weave.
- **I:** invite: a QR code and the link. On the published page, the link carries the password.
- **P:** preset (default, drift, whirl). **[ ]:** tile size. **G:** gap. **C:** clear sources. **S:** save PNG.

Mode, preset, tile size and sources are shared. Whoever changes one last wins, and newcomers get the current state. Cursors travel as (whose cell, where in it), so they land on the same face even when screens differ in shape. Physics runs on each screen from the same inputs. The pictures look alike, but they are not identical frame by frame.

## How it connects

There's no server of our own. [Trystero](https://github.com/dmotz/trystero) finds peers through public Nostr relays. Video, cursors and state then go peer to peer over WebRTC, encrypted by WebRTC itself. Every peer sends its feed to every other peer at 640 × 480. That works well for about six people.

Some networks, like strict corporate Wi‑Fi or some mobile carriers, block direct connections. Those peers need a TURN relay (`turnConfig` in `joinRoom`, e.g. Cloudflare's).

Camera access needs HTTPS or localhost. A laptop on the LAN won't work for other people over plain `http://192.168…`. Use GitHub Pages, or a tunnel such as `cloudflared tunnel --url http://localhost:8082`.

## Publishing, password protected

```sh
PAGE_PASSWORD=… npm run build     # dist/index.html, encrypted with PageCrypt
npm run preview                   # http://localhost:8083/#<password>
```

The room is derived from the password, so only people who can open the page find each other. The source has no secret in it, so the repo can be public. Press **I** (or "invite" on the join screen) for a QR code of `https://<page>/#<password>`. Scanning it opens the page already unlocked.

GitHub Pages: add a repository secret `PAGE_PASSWORD`, set Pages → Source to "GitHub Actions", and push to `main`. `.github/workflows/pages.yml` builds and deploys.
