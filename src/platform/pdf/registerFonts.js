import fs from 'fs';

const knownFonts = {
  'Bitter-Bold': 'bitter-bold.ttf',
  'Bitter-Regular': 'bitter-regular.ttf',
  'SourceSansPro-Bold': 'sourcesanspro-bold-webfont.ttf',
  'SourceSansPro-Italic': 'sourcesanspro-italic-webfont.ttf',
  'SourceSansPro-Light': 'sourcesanspro-light-webfont.ttf',
  'SourceSansPro-Regular': 'sourcesanspro-regular-webfont.ttf',
};

export default async function registerFonts(doc, fonts) {
  const fontPromises = fonts.map(async font => {
    if (!knownFonts[font]) return;

    /**
     * Load custom fonts from the local filesystem if available,
     * otherwise pull them via http.
     */
    try {
      if (fs.existsSync(`src/site/assets/fonts/${knownFonts[font]}`)) {
        doc.registerFont(font, `src/site/assets/fonts/${knownFonts[font]}`);
      }
    } catch (e) {
      const request = await fetch(`/generated/${knownFonts[font]}`);
      const binaryFont = await request.arrayBuffer();
      const encodedFont = Buffer.from(binaryFont).toString('base64');
      fs.writeFileSync(knownFonts[font], encodedFont);

      doc.registerFont(font, knownFonts[font]);
    }
  });

  await Promise.all(fontPromises);
}
