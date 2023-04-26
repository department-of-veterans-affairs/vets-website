/**
 * Test PDF template.
 */

const PDFDocument = require('pdfkit').default;

function generate(data) {
  const doc = new PDFDocument({
    pdfVersion: '1.5',
    lang: 'en-US',
    tagged: true,
    displayTitle: true,
    autoFirstPage: false,
    bufferPages: true,
  });

  doc.info.Title = data.title;
  const struct = doc.struct('Document');
  doc.addStructure(struct);

  doc.addPage({
    margin: 50,
  });

  struct.add(
    doc.struct('H1', () => {
      doc.fontSize(20).text(data.heading, {
        paragraphGap: 10,
      });
    }),
  );

  return doc;
}

module.exports = { generate };
