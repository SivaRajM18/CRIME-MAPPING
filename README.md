# CrimeMap Upgrade

This is an enhancement of the existing CrimeMap frontend, preserving its original pages and Case Desk workflows while adding: nearest patrol comparison, a simulated radio-dispatch workflow, demonstration patrol markers, and a toggleable illustrative heatmap with category/date filters.

## Run locally

Open `index.html` in a browser or use VS Code Live Server. Internet access is required for Leaflet, map tiles, fonts, and the Leaflet.heat CDN script. No paid API key is used.

## Important boundaries

- All incidents and patrol coordinates are fictional demonstration data.
- Radio dispatch is simulated; no physical radio is connected.
- Patrol locations are not live GPS.
- Distances are straight-line Haversine distances, not road distances or ETAs.
- Heatmap intensity is based only on the small illustrative incident set and is not an official crime statistic.
- Real deployment requires authorised GPS/radio integration, secure backend services, authentication, access controls, and validated incident data.

## Files

- `index.html` — original website sections plus dispatch workspace and controls.
- `style.css` — existing styles plus responsive styles for new features.
- `script.js` — existing site interactions and Case Desk, with enhanced map, patrol, heatmap, and dispatch behaviour.

## Testing note

The files were checked for JavaScript syntax and basic markup consistency. A full browser-based test against live external map tiles and CDN availability must still be performed locally before deployment.


Map interaction update: incident markers open a styled geospatial popup with ID, category, priority, coordinates, reported date, status and a fictional-data notice. Facility markers do not open incident details. Marker sizes are reduced for a cleaner satellite view. The patrol demonstration now includes 20 fictional units ranked by straight-line distance.
