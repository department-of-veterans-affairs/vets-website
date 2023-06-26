// The fs here is not node fs but the provided virtual fs.
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

// Register the required AFM fonts distributed with pdfkit.
// This is skipped during tests because we're not using the virtual fs.
if (process.env.NODE_ENV !== 'test') {
  registerAFMFonts(
    require.context('pdfkit/js/data', false, /Helvetica.*\.afm$/),
  );
}
