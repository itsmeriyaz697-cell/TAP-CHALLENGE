# Tap Challenge

A complete static, no-database viral tapping game.

## Features
- Player name stored in browser localStorage
- Score and best score stored locally
- Funny milestone levels
- Downloadable SVG badges
- Peer-to-peer challenge links using URL parameters
- Native mobile share when available
- Responsive design
- SEO meta tags
- Open Graph/Twitter metadata
- JSON-LD structured data
- robots.txt
- sitemap.xml
- PWA manifest
- Founder attribution: Riyaz Chalise

## Deploy
Upload all files to any static host.

Before publishing, replace `https://YOUR-DOMAIN.example/` in:
- index.html
- robots.txt
- sitemap.xml

with your real domain.

## Google indexing
1. Deploy the site on your real domain.
2. Verify the domain in Google Search Console.
3. Submit `/sitemap.xml`.
4. Use URL Inspection to request indexing of the homepage.

Note: Google decides whether and when to index/rank a site. No static file can guarantee indexing.

## No database
Names and scores are local to each browser. Challenge links carry the challenger name and score. This means there is no server-side global leaderboard.
