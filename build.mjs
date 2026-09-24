// Encrypts index.html with PageCrypt into dist/index.html.
// The room is derived from the password, so only people who can open the page
// can find each other, and the public source holds no secret. The password is
// also put inside the encrypted page, so it can make invite links, along with
// any TURN credentials.
//   PAGE_PASSWORD=… npm run build
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { encryptHTML } from 'pagecrypt';

const password = process.env.PAGE_PASSWORD;
if (!password) {
  console.error('Set PAGE_PASSWORD, e.g. PAGE_PASSWORD=hunter2 npm run build');
  process.exit(1);
}

let html = await readFile('index.html', 'utf8');
const secret = createHash('sha256').update(`multiplayer-camera:${password}`).digest('hex').slice(0, 32);
// TURN relays, optional: TURN_URLS (comma separated), TURN_USERNAME, TURN_CREDENTIAL
const turn = process.env.TURN_URLS
  ? [{ urls: process.env.TURN_URLS.split(',').map(u => u.trim()), username: process.env.TURN_USERNAME, credential: process.env.TURN_CREDENTIAL }]
  : [];
for (const [placeholder, value] of [["'__ROOM_SECRET__'", secret], ["'__INVITE__'", password], ["'__TURN__'", turn]]) {
  if (!html.includes(placeholder)) throw new Error(`index.html has no ${placeholder} to replace`);
  html = html.replace(placeholder, JSON.stringify(value));
}

await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', await encryptHTML(html, password));
console.log('dist/index.html encrypted');
