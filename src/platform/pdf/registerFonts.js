import fs from 'fs';

const knownFonts = {
  'Bitter-Bold': 'bitter-bold.ttf',
  'Bitter-Regular': 'bitter-regular.ttf',
};

export default async function registerFonts(doc, fonts) {
  for (const font of fonts) {
    if (!knownFonts[font]) return;

    // Fixme await in loop.
    const request = await fetch(`/generated/${knownFonts[font]}`);
    const binaryFont = await request.arrayBuffer();
    const encodedFont = Buffer.from(binaryFont).toString('base64');
    fs.writeFileSync(knownFonts[font], encodedFont);

    doc.registerFont(font, knownFonts[font]);
  }
}
