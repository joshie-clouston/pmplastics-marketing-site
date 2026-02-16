# P&M Plastics Marketing Site

## Business
- **Name:** P&M Plastics (always "P&M" not "PM" in copy)
- **What:** Custom plastic fabrication & manufacturing — Gold Coast, 30 years
- **Address:** 9 Leda Drive, Burleigh Heads QLD 4220
- **Phone:** 07 5535 7544
- **Hours:** Mon–Fri 7:30am–4:00pm
- **Online store:** perspexonline.com.au (Perspex Online brand)
- **Social:** Facebook, Instagram (@pmplasticsgoldcoast)

## Brand
- Primary red: `#DA0D19`
- Dark/text: `#231F20`
- Accent gold: `#FDB813`
- Font: Inter (Variable) everywhere
- Logo: Two variants in `src/assets/images/logos/`
- Tone: Professional but approachable. Industrial, not corporate. Australian English.
- Always capitalise service names: "CNC Water Jet Cutting" not "cnc water jet cutting"

## Tech Stack
- Astro 5.x (server mode, prerender static pages)
- Tailwind CSS 4.x (CSS-based @theme config)
- Cloudflare Workers + D1 + Resend
- anime.js for scroll animations

## Conventions
- Australian English (colour, optimise, specialise)
- `export const prerender = true` on all static pages
- Forms: client validation → API route → D1 + Resend (non-blocking email)
- UTM params on every form submission
- Images in `src/assets/images/` (Astro-optimised)
- Sections as standalone components in `src/components/sections/`

## Services (preserve these exactly)
1. CNC Water Jet Cutting
2. CNC Vacuum Forming
3. CNC Router Cutting
4. CNC Laser Cutting
5. Plastic Thermo Forming
6. 2D & 3D Laser Engraving & Etching

## Materials Stocked
Perspex, Lexan Polycarbonate, Euro-Mir Acrylic Mirrors, Acrylic (tubes, rods, sheets), PVC, HDPE, PTFE, Nylon, Polypropylene, UHMWPE, Corflute, Plaspanel, ABS, HIPS, PETG, Engineering Products

## Key Selling Points
- "Concept to creation" (full-service)
- 30 years on the Gold Coast
- Innovative reverse engineering
- Massive material range
- Fast turnaround
- Multi-brand: P&M Plastics, Perspex Online, Plastic Online, Holland Plastics
