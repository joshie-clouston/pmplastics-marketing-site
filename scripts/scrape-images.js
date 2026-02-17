#!/usr/bin/env node

/**
 * Scrapes images from the live P&M Plastics CDN.
 *
 * Usage:
 *   node scripts/scrape-images.js
 *
 * Downloads ~130 images to src/assets/images/ for Astro optimisation.
 * Skips files that already exist. Safe to re-run.
 */

import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

const CDN = 'https://assets.cdn.thewebconsole.com/S3WEB1737';
const OUT = 'src/assets/images';

/** @type {Record<string, Array<{path: string, slug: string}>>} */
const manifest = {
  // ── Gallery: Tanks (17) ──
  'gallery/tanks': [
    { path: 'gallery_images/52032da6a0163.JPG', slug: 'custom-plastic-tank-01' },
    { path: 'gallery_images/52798bc07e29a.jpg', slug: 'custom-plastic-tank-02' },
    { path: 'gallery_images/527965cd163b9.jpg', slug: 'custom-plastic-tank-03' },
    { path: 'gallery_images/52796407d1167.jpg', slug: 'custom-plastic-tank-04' },
    { path: 'gallery_images/524a670d7ef2e.jpg', slug: 'custom-plastic-tank-05' },
    { path: 'gallery_images/524a66b309edd.jpg', slug: 'custom-plastic-tank-06' },
    { path: 'gallery_images/524a6643a2d2d.jpg', slug: 'custom-plastic-tank-07' },
    { path: 'gallery_images/524a65e01cca1.jpg', slug: 'custom-plastic-tank-08' },
    { path: 'gallery_images/52032ebd4dfc8.JPG', slug: 'custom-plastic-tank-09' },
    { path: 'gallery_images/51d539158c635.jpg', slug: 'custom-plastic-tank-10' },
    { path: 'gallery_images/52032beca67d8.JPG', slug: 'custom-plastic-tank-11' },
    { path: 'gallery_images/52032e571a436.JPG', slug: 'custom-plastic-tank-12' },
    { path: 'gallery_images/520325b5ea774.jpg', slug: 'custom-plastic-tank-13' },
    { path: 'gallery_images/52032630b4db2.jpg', slug: 'custom-plastic-tank-14' },
    { path: 'gallery_images/51d539ad033d3.jpg', slug: 'custom-plastic-tank-15' },
    { path: 'gallery_images/51d5398a94849.jpg', slug: 'custom-plastic-tank-16' },
    { path: 'gallery_images/51d5396407fc8.jpg', slug: 'custom-plastic-tank-17' },
  ],

  // ── Gallery: Display Products (22) ──
  'gallery/display-products': [
    { path: 'gallery_images/5279727695da9.JPG', slug: 'display-product-01' },
    { path: 'gallery_images/52797881003b1.JPG', slug: 'display-product-02' },
    { path: 'gallery_images/5279786d4752f.JPG', slug: 'display-product-03' },
    { path: 'gallery_images/52797620f01d9.JPG', slug: 'display-product-04' },
    { path: 'gallery_images/5279760b45f90.JPG', slug: 'display-product-05' },
    { path: 'gallery_images/527975f6c3be8.JPG', slug: 'display-product-06' },
    { path: 'gallery_images/527975d98239e.JPG', slug: 'display-product-07' },
    { path: 'gallery_images/527975723b311.JPG', slug: 'display-product-08' },
    { path: 'gallery_images/527975591a3d1.JPG', slug: 'display-product-09' },
    { path: 'gallery_images/527972aa9e995.JPG', slug: 'display-product-10' },
    { path: 'gallery_images/5279728a462f4.jpg', slug: 'display-product-11' },
    { path: 'gallery_images/5279698c17dbb.jpg', slug: 'competition-box' },
    { path: 'gallery_images/527972127a15c.JPG', slug: 'display-product-12' },
    { path: 'gallery_images/527971edbfb1e.JPG', slug: 'display-product-13' },
    { path: 'gallery_images/527971d58df32.JPG', slug: 'display-product-14' },
    { path: 'gallery_images/527971bc08f45.jpg', slug: 'display-product-15' },
    { path: 'gallery_images/527971a4ef7a4.JPG', slug: 'display-product-16' },
    { path: 'gallery_images/5279718f1d755.jpg', slug: 'display-product-17' },
    { path: 'gallery_images/52797174bdd9d.JPG', slug: 'display-product-18' },
    { path: 'gallery_images/5279715c4a1e4.JPG', slug: 'display-product-19' },
    { path: 'gallery_images/52796ad28f15f.jpg', slug: 'acrylic-display-box' },
    { path: 'gallery_images/527969e5f30bb.jpg', slug: 'display-product-20' },
  ],

  // ── Gallery: Plastic Fabrication (22) ──
  'gallery/plastic-fabrication': [
    { path: 'gallery_images/5f47471462dd1.JPG', slug: 'plastic-fabrication-01' },
    { path: 'gallery_images/5f474713c8e4d.JPG', slug: 'plastic-fabrication-02' },
    { path: 'gallery_images/5f474712f2134.JPG', slug: 'plastic-fabrication-03' },
    { path: 'gallery_images/5f4747126b924.JPG', slug: 'plastic-fabrication-04' },
    { path: 'gallery_images/5f4747117597c.JPG', slug: 'plastic-fabrication-05' },
    { path: 'gallery_images/5f474711002b5.JPG', slug: 'plastic-fabrication-06' },
    { path: 'gallery_images/5f474714cd033.JPG', slug: 'plastic-fabrication-07' },
    { path: 'gallery_images/5f474791a1fe1.JPG', slug: 'plastic-fabrication-08' },
    { path: 'gallery_images/5f4747922e69c.JPG', slug: 'plastic-fabrication-09' },
    { path: 'gallery_images/5f474792d03c4.JPG', slug: 'plastic-fabrication-10' },
    { path: 'gallery_images/5f4747937f35c.JPG', slug: 'plastic-fabrication-11' },
    { path: 'gallery_images/5f474793e5d32.JPG', slug: 'plastic-fabrication-12' },
    { path: 'gallery_images/5f4747948ae11.JPG', slug: 'plastic-fabrication-13' },
    { path: 'gallery_images/5f47479083854.JPG', slug: 'plastic-fabrication-14' },
    { path: 'gallery_images/5f47475ee8b7e.jpg', slug: 'plastic-fabrication-15' },
    { path: 'gallery_images/5f47475faa342.JPG', slug: 'plastic-fabrication-16' },
    { path: 'gallery_images/5f4747603a9e4.jpg', slug: 'plastic-fabrication-17' },
    { path: 'gallery_images/5f474760bcc7c.JPG', slug: 'plastic-fabrication-18' },
    { path: 'gallery_images/5f4747615aaf4.JPG', slug: 'plastic-fabrication-19' },
    { path: 'gallery_images/5f474761df761.JPG', slug: 'plastic-fabrication-20' },
    { path: 'gallery_images/5f474762edd95.JPG', slug: 'plastic-fabrication-21' },
    { path: 'gallery_images/5f47475e4ad81.JPG', slug: 'plastic-fabrication-22' },
  ],

  // ── Gallery: Vacuum Forming (15) ──
  'gallery/vacuum-forming': [
    { path: 'gallery_images/52797974022c9.JPG', slug: 'vacuum-formed-head' },
    { path: 'gallery_images/527979bfa3964.JPG', slug: 'vacuum-formed-tv-mount-01' },
    { path: 'gallery_images/527979d7c2952.JPG', slug: 'vacuum-formed-tv-mount-02' },
    { path: 'gallery_images/52797a01303e5.JPG', slug: 'vacuum-formed-ambulance-parts' },
    { path: 'gallery_images/52797a36daa43.JPG', slug: 'vacuum-formed-bus-dash' },
    { path: 'gallery_images/52797a5764757.jpg', slug: 'vacuum-formed-bus-cabinet' },
    { path: 'gallery_images/52797a82aef08.JPG', slug: 'vacuum-formed-domino-sign' },
    { path: 'gallery_images/52797aa9c86ef.JPG', slug: 'vacuum-formed-golf-buggy-roof' },
    { path: 'gallery_images/52797b21bb608.JPG', slug: 'vacuum-formed-optus-sign' },
    { path: 'gallery_images/52797b7a6f6cc.JPG', slug: 'vacuum-formed-gaming-train' },
    { path: 'gallery_images/52797bee966f1.JPG', slug: 'vacuum-formed-roulette-wheel' },
    { path: 'gallery_images/52797c5fc3954.JPG', slug: 'vacuum-formed-dash' },
    { path: 'gallery_images/52797d9a35f1d.JPG', slug: 'vacuum-formed-console' },
    { path: 'gallery_images/527980cfe7976.JPG', slug: 'vacuum-formed-trays' },
    { path: 'gallery_images/5279833cf18a1.JPG', slug: 'vacuum-formed-glove-box' },
  ],

  // ── Gallery: Decorative Panels (9) ──
  'gallery/decorative-panels': [
    { path: 'gallery_images/5f4719e0b19e0.JPG', slug: 'decorative-acrylic-panel-01' },
    { path: 'gallery_images/5f471a833e999.JPG', slug: 'decorative-acrylic-panel-02' },
    { path: 'gallery_images/5f471b3a2d48d.JPG', slug: 'decorative-acrylic-panel-03' },
    { path: 'gallery_images/5f471a8397a87.JPG', slug: 'decorative-acrylic-panel-04' },
    { path: 'gallery_images/5f471a8408800.JPG', slug: 'decorative-acrylic-panel-05' },
    { path: 'gallery_images/5f471a8484925.JPG', slug: 'decorative-acrylic-panel-06' },
    { path: 'gallery_images/5f471a84dffe2.JPG', slug: 'decorative-acrylic-panel-07' },
    { path: 'gallery_images/5f471a8597345.JPG', slug: 'decorative-acrylic-panel-08' },
    { path: 'gallery_images/5f471a863b123.JPG', slug: 'decorative-acrylic-panel-09' },
  ],

  // ── Gallery: Perspex (9) ──
  'gallery/perspex': [
    { path: 'gallery_images/51c3d8ef173c0.jpg', slug: 'perspex-fabrication-01' },
    { path: 'gallery_images/51c3d926aeb22.jpg', slug: 'perspex-fabrication-02' },
    { path: 'gallery_images/51c3d957c5017.jpg', slug: 'perspex-fabrication-03' },
    { path: 'gallery_images/51c3d977334a5.jpg', slug: 'perspex-fabrication-04' },
    { path: 'gallery_images/51c3d9c27c4e4.jpg', slug: 'perspex-fabrication-05' },
    { path: 'gallery_images/51c3da0d6ab61.jpg', slug: 'perspex-fabrication-06' },
    { path: 'gallery_images/51c3da3108588.jpg', slug: 'perspex-fabrication-07' },
    { path: 'gallery_images/51c3da557a0d9.jpg', slug: 'perspex-fabrication-08' },
    { path: 'gallery_images/51c3daaaea491.jpg', slug: 'perspex-fabrication-09' },
  ],

  // ── Gallery: Miscellaneous (8) ──
  'gallery/miscellaneous': [
    { path: 'gallery_images/4d54008f71bf7.jpg', slug: 'miscellaneous-01' },
    { path: 'gallery_images/4d5400abea4d4.jpg', slug: 'miscellaneous-02' },
    { path: 'gallery_images/4d5400c7d24e9.jpg', slug: 'miscellaneous-03' },
    { path: 'gallery_images/4d5400eb94c7a.jpg', slug: 'miscellaneous-04' },
    { path: 'gallery_images/4d5401087ed80.jpg', slug: 'miscellaneous-05' },
    { path: 'gallery_images/4d540124dfda3.jpg', slug: 'miscellaneous-06' },
    { path: 'gallery_images/4d540149aabc8.jpg', slug: 'miscellaneous-07' },
    { path: 'gallery_images/4d540168641bf.jpg', slug: 'miscellaneous-08' },
  ],

  // ── Gallery: Sneeze Guards (8) ──
  'gallery/sneeze-guards': [
    { path: 'gallery_images/5ee16f191d874.png', slug: 'sneeze-guard-01' },
    { path: 'gallery_images/5ee16f17831a4.jpg', slug: 'sneeze-guard-02' },
    { path: 'gallery_images/5ee16f19984a8.png', slug: 'sneeze-guard-03' },
    { path: 'gallery_images/5ee16f1a3b534.jpg', slug: 'sneeze-guard-04' },
    { path: 'gallery_images/5ee16f1ab06c1.jpg', slug: 'sneeze-guard-05' },
    { path: 'gallery_images/5ee16f1b48902.jpeg', slug: 'sneeze-guard-06' },
    { path: 'gallery_images/5ee16f18a8ca8.jpg', slug: 'sneeze-guard-07' },
    { path: 'gallery_images/5ee16f182ebe7.png', slug: 'sneeze-guard-08' },
  ],

  // ── Gallery: Material Properties (9) ──
  'gallery/material-properties': [
    { path: 'gallery_images/4e1b937c2c0e4.jpg', slug: 'material-properties-01' },
    { path: 'gallery_images/4e1b92d9260d9.jpg', slug: 'material-properties-02' },
    { path: 'gallery_images/4e1b92e78438c.jpg', slug: 'material-properties-03' },
    { path: 'gallery_images/4e1b92f983581.jpg', slug: 'material-properties-04' },
    { path: 'gallery_images/4e1b930dc03f6.jpg', slug: 'material-properties-05' },
    { path: 'gallery_images/4e1b931d8b431.jpg', slug: 'material-properties-06' },
    { path: 'gallery_images/4e1b9330062b3.jpg', slug: 'material-properties-07' },
    { path: 'gallery_images/4e1b93447495f.jpg', slug: 'material-properties-08' },
    { path: 'gallery_images/4e1b9f0585c18.jpg', slug: 'material-properties-09' },
  ],

  // ── Service images ──
  'services': [
    { path: 'images/inner-banner31.jpg', slug: 'service-banner' },
    { path: 'images/cnc-routing.jpeg', slug: 'cnc-routing' },
    { path: 'images/router-cutting-gold-coast.jpeg', slug: 'router-cutting-gold-coast' },
    { path: 'images/router-cutting-service-gold-coast.jpeg', slug: 'router-cutting-service' },
    { path: 'images/vacpic3.gif', slug: 'vacuum-forming-process-01' },
    { path: 'images/vacuum-formed-lion-face.jpg', slug: 'vacuum-formed-lion-face' },
    { path: 'images/vacpic2.gif', slug: 'vacuum-forming-process-02' },
    { path: 'images/cnc-laser-cutting.jpeg', slug: 'cnc-laser-cutting' },
    { path: 'images/gold-coast-laser-cutting.jpeg', slug: 'gold-coast-laser-cutting' },
    { path: 'images/thermo1.gif', slug: 'thermoforming-letters' },
    { path: 'images/Thermo-Acrylic-Polycabonate-boat-screens.jpg', slug: 'thermoformed-boat-screens' },
    { path: 'images/thermo2.gif', slug: 'thermoforming-process' },
    { path: 'images/2d-laser-engraving-business-card.jpg', slug: '2d-laser-engraving-business-card' },
    { path: 'images/Corporate-laser-engraving-gold-coast.jpg', slug: 'corporate-laser-engraving' },
    { path: 'images/3d-laser-pro-pamtreeinn-2019-1-23-2-33-00.jpg', slug: '3d-laser-engraving-palmtree' },
    { path: 'images/3d-laser-pro-fishng-2019-1-23-2-32-53.jpg', slug: '3d-laser-engraving-fishing' },
    { path: 'images/3d-laser-pro-cart-2019-1-23-2-33-02.jpg', slug: '3d-laser-engraving-cart' },
    { path: 'images/Inner-banner-plastic-fabrication.jpg', slug: 'plastic-fabrication-banner' },
    { path: 'images/plastic-fabrication-gold-coast.jpeg', slug: 'plastic-fabrication-gold-coast' },
  ],
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buffer);
  return buffer.length;
}

async function main() {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytes = 0;

  for (const [dir, items] of Object.entries(manifest)) {
    console.log(`\n📁 ${dir} (${items.length} images)`);

    for (const { path, slug } of items) {
      const ext = extname(path).toLowerCase();
      const dest = join(OUT, dir, `${slug}${ext}`);

      if (await fileExists(dest)) {
        skipped++;
        continue;
      }

      const url = `${CDN}/${path}`;
      try {
        const bytes = await download(url, dest);
        totalBytes += bytes;
        downloaded++;
        console.log(`  ✓ ${slug}${ext} (${(bytes / 1024).toFixed(0)} KB)`);
      } catch (err) {
        failed++;
        console.error(`  ✗ ${slug}${ext} — ${err.message}`);
      }
    }
  }

  console.log('\n─────────────────────────────');
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped:    ${skipped}`);
  console.log(`Failed:     ${failed}`);
  console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(console.error);
