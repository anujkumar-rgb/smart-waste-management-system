# Smart Waste Management System

A municipal multi-role smart waste management platform featuring crowdsourced reporting, Leaflet GPS location picking, source segregation, and biomedical compliance tracking.

## Features

- **Multi-Role Portal**: Dedicated views for Citizens, Waste Collectors / Drivers, and Municipal Administrators.
- **Crowdsourced Incident Reporting**: Geo-tagged complaint and overflow logging with real-time status tracking.
- **Interactive Map**: Built with Leaflet for visualizing collection routes, hot spots, and bin locations.
- **Source Segregation Tracking**: Categorized tracking for Wet, Dry, Hazardous, and Biomedical waste.
- **Light & Dark Theme**: Modern, responsive interface optimized for desktop and mobile displays.

## Getting Started

### Local Setup

To serve locally without external dependencies:

```bash
node serve.js
```

Then visit [http://localhost:8080](http://localhost:8080) in your web browser. Alternatively, open `index.html` directly in any modern browser.

## Tech Stack

- **HTML5 & CSS3**: Vanilla CSS with modern custom properties, flexbox, and grid layouts.
- **JavaScript (ES6+)**: Modular client-side architecture.
- **Leaflet.js**: Lightweight open-source mapping.
- **Node.js**: Built-in HTTP server (`serve.js`).
