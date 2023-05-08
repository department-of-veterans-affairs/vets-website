/**
 * Lab and Test Results PDF template.
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

  await registerFonts(doc, [
    'Bitter-Bold',
    'Bitter-Regular',
    'SourceSansPro-Bold',
    'SourceSansPro-Regular',
  ]);

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
        .fontSize(30)
        .text(data.title, {
          paragraphGap: 10,
        });
    }),
  );

  struct.add(
    doc.struct('P', () => {
      doc
        .font('Bitter-Regular')
        .fontSize(16)
        .text(data.preface, {
          paragraphGap: 10,
        });
    }),
  );

  return doc;
};

export { generate };
