/**
 * Lab and Test Results PDF template.
 */
import registerFonts from '../registerFonts';

const PDFDocument = require('pdfkit').default;

// TODO: add to utils file.
/**
 * @param doc - pdfkit document
 * @param spaceFromEdge - how far the right and left sides should be away from the edge (in px)
 * @param linesAboveAndBelow - how much space should be above and below the HR (in lines)
 */
const addHorizontalRule = (doc, spaceFromEdge = 0, linesAboveAndBelow = 0.5) => {
  doc.moveDown(linesAboveAndBelow);

  doc.moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesAboveAndBelow);
  
  return doc;
};

const getTestResultBlockHeight = (doc, item) => {
  // Account for height of horizontal rule.
  let height = 16;

  height += doc.heightOfString(item.header, { font: 'SourceSansPro-Bold', fontSize: 18 });
  item.items.forEach(resultItem => {
    height += doc.heightOfString(`${resultItem.title}: `, { font: 'SourceSansPro-Bold', fontSize: 16, continued: true });
    height += doc.heightOfString(resultItem.value, { font: 'SourceSansPro-Regular', fontSize: 16 });
  });

  return height;
};

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

  doc.addPage({
    margins: {
      top: 54,
      bottom: 54,
      left: 16,
      right: 16,
    },
  });

  // Introduction section.
  const introduction = doc.struct(
    'Sect',
    {
      title: 'Introduction',
    },
    [
      doc.struct('H1', () => {
        doc
          .font('Bitter-Bold')
          .fontSize(30)
          .text(data.title);
      }),
      doc.struct('P', () => {
        doc
          .font('Bitter-Regular')
          .fontSize(16)
          .text(data.preface);
      }),
    ],
  );
  doc.addStructure(introduction);

  // Details section.
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  details.add(
    doc.struct('H2', () => {
      doc
        .font('Bitter-Bold')
        .fontSize(24)
        .text(data.details.header, 30);
    }),
  );
  if (data.details.items.length > 0) {
    data.details.items.forEach(item => {
      details.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Bold')
            .fontSize(16)
            .text(`${item.title}: `, {
              continued: true,
            });
        }),
      );
      details.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Regular')
            .fontSize(16)
            .text(`${item.value}\n`);
        }),
      );
    });
  }
  details.end();
  doc.addStructure(details);

  // Results section.
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  doc.addStructure(results);
  results.add(
    doc.struct('H2', () => {
      doc
        .font('Bitter-Bold')
        .fontSize(24)
        .text(data.results.header, 34);
    }),
  );
  const resultItemCount = data.results.items.length;
  data.results.items.forEach((item, idx) => {
    // Insert a pagebreak if the next block will not fit on the current page,
    // taking the footer height into account.
    const blockHeight = getTestResultBlockHeight(doc, item);
    if (doc.y + blockHeight > 750) {
      doc.addPage();
    } else if (idx > 0) {
      results.add(
        doc.struct('P', () => {
          addHorizontalRule(doc, 30, 0.5);
        }),
      );
    }

    results.add(
      doc.struct('H3', () => {
        doc
          .font('SourceSansPro-Bold')
          .fontSize(18)
          .text(item.header, 34);
      }),
    );
    
    item.items.forEach(resultItem => {
      results.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Bold')
            .fontSize(16)
            .text(`${resultItem.title}: `, {
              continued: true,
              x: 44,
            });
        }),
      );
      results.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Regular')
            .fontSize(16)
            .text(`${resultItem.value}\n`);
        }),
      );
    });
  });
  results.end();

  doc.flushPages();
  return doc;
};

export { generate };
