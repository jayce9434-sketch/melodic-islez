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

### Coin Rush balance
- Easy — Coinflower Cay: 20 rounds, 1.8s → 0.8s reaction windows, roughly 3.4K–6K coins; a tested perfect run paid 6,467 coins.
- Medium — Frostcoin Fjord: 24 rounds, 1.45s → 0.65s, much stronger payouts.
- Hard — Jackpot Circuit: 28 rounds, 1.1s → 0.5s, high-risk/high-reward.
- Extreme — Starlight Panic: 32 rounds, 0.85s → 0.35s, the biggest jackpot tier.
- Wrong taps immediately end that round, so button-spamming cannot cheese the target.
- The 5-run limit is a rolling real-world hour and uses saved absolute timestamps.
- One of the 15 four-hour quests is now **Rush Runner**, rewarding a Coin Rush run during that rotation.


## Resource Arcade update
- New **Resource Arcade** tab with four additional minigames plus the original Coin Rush.
- **Coin Garden** — easy Coin farming; 20 rounds, 4.5-second windows, wrong taps are forgiving, and strong runs can earn roughly 3K–9K Coins.
- **Gem Mine** — memory game that can award up to 12 Gems per run.
- **Starfall Observatory** — constellation-memory game that can award up to 5 Stars per run and is available from Verdant Groove.
- **Note Jam** — relaxed timing game that can award roughly 100–420 Music Notes per run.
- Each Resource Arcade game has its own rolling limit of **5 plays per real-world hour** using saved timestamps. Refreshing, closing, or reopening the page does not refill plays early.
- Resource payouts write directly into the existing save, and older Encore saves migrate automatically.
- Tapping a currency at the top now opens the Resource Arcade and highlights the matching farming game.


## Quick Breeding balance patch
- Breeding timers are capped at 10 minutes.
- Finish Now costs 1 Gem under 5:00 remaining, 2 Gems from 5:00–7:59, and 3 Gems from 8:00–10:00.
- Existing in-progress breeding jobs longer than 10 minutes are clamped to 10 minutes when the updated save loads.
