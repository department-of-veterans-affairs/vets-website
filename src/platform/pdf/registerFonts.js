import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as BUCKETS from 'site/constants/buckets';
import fs from 'fs';

const knownFonts = {
  'Bitter-Bold': 'bitter-bold.ttf',
  'Bitter-Regular': 'bitter-regular.ttf',
  'SourceSansPro-Bold': 'sourcesanspro-bold-webfont.ttf',
  'SourceSansPro-Italic': 'sourcesanspro-italic-webfont.ttf',
  'SourceSansPro-Light': 'sourcesanspro-light-webfont.ttf',
  'SourceSansPro-Regular': 'sourcesanspro-regular-webfont.ttf',
  'RobotoMono-Regular': 'robotomono-regular.ttf',
};

const registerLocalFont = (doc, font) => {
  try {
    if (fs.existsSync(`src/site/assets/fonts/${knownFonts[font]}`)) {
      doc.registerFont(font, `src/site/assets/fonts/${knownFonts[font]}`);
    }
    return true;
  } catch {
    return false;
  }
};

const downloadAndRegisterFont = async (doc, font) => {
  const bucket = environment.isLocalhost()
    ? ''
    : BUCKETS[environment.BUILDTYPE];
  const request = await fetch(`${bucket}/generated/${knownFonts[font]}`);
  const binaryFont = await request.arrayBuffer();
  const encodedFont = Buffer.from(binaryFont).toString('base64');
  fs.writeFileSync(knownFonts[font], encodedFont);

  doc.registerFont(font, knownFonts[font]);
};

export default async function registerFonts(doc, fonts) {
  const fontPromises = fonts.map(async font => {
    if (!knownFonts[font]) return;

    /**
     * Load custom fonts from the local filesystem if available,
     * otherwise pull them via http.
     */
    const success = registerLocalFont(doc, font);

    if (!success) {
      await downloadAndRegisterFont(doc, font);
    }
  });

  await Promise.all(fontPromises);
}
