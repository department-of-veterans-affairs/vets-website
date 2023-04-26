/**
 * Test PDF template.
 */
import registerFonts from '../registerFonts';

const PDFDocument = require('pdfkit').default;

const generate = async data => {
  const doc = new PDFDocument({
    pdfVersion: '1.5',
    lang: 'en-US',
    tagged: true,
    displayTitle: true,
    autoFirstPage: false,
    bufferPages: true,
  });

  await registerFonts(doc, ['Bitter-Bold']);

  doc.info.Title = data.title;
  const struct = doc.struct('Document');
  doc.addStructure(struct);

  doc.addPage({
    margin: 50,
  });

  struct.add(
    doc.struct('H1', () => {
      doc
        .font('Bitter-Bold')
        .fontSize(20)
        .text(data.heading, {
          paragraphGap: 10,
        });
    }),
  );

  return doc;
};

export { generate };
