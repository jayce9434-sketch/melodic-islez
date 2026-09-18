# Melodic Isles: Encore

A free-to-play musical monster collection game for desktop and mobile browsers.

## GitHub setup
Upload these files directly to the root of a GitHub repository. There are no required folders:

- `index.html`
- `style.css`
- `game.js`
- `app-icon.png`
- `manifest.webmanifest`
- `README.md`

Then enable GitHub Pages from the repository's main branch/root.

## Encore update
- 4 islands: Verdant Groove, Frostbell Atoll, Ember Circuit, Moonlit Reverie
- 44 monster species total (11 per island)
- 4 forms for every species: Common, Rare, Epic, Legendary
- 176 total rarity collection slots
- Island Titan on every island, with all four rarities
- Maximum breeding wait remains 90 minutes
- Offline breeding timers use absolute timestamps
- Offline monster coin production continues for up to 12 hours
- 20 permanent quests
- 15 rotating quests that all refresh every 4 hours; the refresh timer continues while offline
- Active-play quest ladder from 15 minutes through 2 hours; background/offline time does not count as play time
- 1-hour quest rewards 25 Gems + 5 Stars; 2-hour quest rewards 100 Gems + 12 Stars
- Daily rewards
- Coins, Gems, Music Notes and Stars all have gameplay uses
- Gems: instant-finish breeding and reroll egg rarity
- Music Notes: 20-minute Harmony Boosts and Titan awakening
- Stars: permanent Island Mastery upgrades and Titan awakening
- Collection milestones award Stars
- Permanent island mastery: Amplifier, Lucky Nest, Grand Stage
- Better Web Audio song engine with island-specific instruments
- Rare, Epic and Legendary monsters add extra audio layers; Legendary adds sparkle chimes
- Moonlit Reverie focuses on harp, celesta, glass, choir and the Astral Organon titan
- Responsive desktop/mobile UI
- Generated 512x512 app icon and web app manifest

## Save compatibility
Encore uses `melodicIslesSave_v2`, but automatically checks for the original `melodicIslesSave_v1` save on the same site and upgrades it. The Import Save box also accepts exported v1 save codes.

Keep a copy of your save code before replacing an older build, just in case.

## Testing
The included screenshot bundle was rendered from the actual game code. JavaScript syntax checking and browser rendering tests were run with no page errors in the tested screens.

## Quest Board update
This build expands the four-hour quest board from 3 to 15 simultaneous quests. Save migration is automatic and existing Encore save codes remain accepted.


## Coin Rush update
- New Coin Rush mode with 4 dedicated difficulty islands: Coinflower Cay, Frostcoin Fjord, Jackpot Circuit, and Starlight Panic.
- Find and tap the called monster before the timer expires; reaction windows shrink every round.
- Easy / Medium / Hard / Extreme payouts scale sharply and can fund expensive island unlocks much faster.
- Global rolling limit of 5 Coin Rush runs per real-world hour. Refreshing or closing the page does not reset the limit.
- Coin Rush progress and payouts are included in normal saves and exported save codes.
