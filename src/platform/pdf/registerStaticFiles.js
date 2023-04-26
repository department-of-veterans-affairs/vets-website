// the fs here is not node fs but the provided virtual one
import fs from 'fs';

function registerAFMFonts(ctx) {
  ctx.keys().forEach(key => {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      // afm files must be stored on data path
      fs.writeFileSync(`data/${match[0]}`, ctx(key));
    }
  });
}

// register AFM fonts distributed with pdfkit
// is good practice to register only required fonts to avoid the bundle size increase too much
registerAFMFonts(require.context('pdfkit/js/data', false, /Helvetica.*\.afm$/));
