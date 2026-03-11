import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as BUCKETS from 'site/constants/buckets';
import fs from 'fs';

export const knownFonts = {
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
  const url = `${bucket}/generated/${knownFonts[font]}`;
  try {
    const request = await fetch(url);
    const binaryFont = await request.arrayBuffer();
    const encodedFont = Buffer.from(binaryFont).toString('base64');
    fs.writeFileSync(knownFonts[font], encodedFont);
    doc.registerFont(font, knownFonts[font]);
  } catch (error) {
    throw new Error(
      `Failed to fetch font ${font} from ${url}: ${error.message}`,
    );
  }
};

export const registerFonts = async function(doc, fonts) {
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
};
