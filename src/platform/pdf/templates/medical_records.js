/**
 * Lab and Test Results PDF template.
 */
import registerFonts from '../registerFonts';

const pdfkit = require('pdfkit');

// Handle both node and browser environments.
const PDFDocument = pdfkit.default ?? pdfkit;

// TODO: add to utils file.
/**
 * @param doc - pdfkit document
 * @param spaceFromEdge - how far the right and left sides should be away from the edge (in px)
 * @param linesAboveAndBelow - how much space should be above and below the HR (in lines)
 */
const addHorizontalRule = (
  doc,
  spaceFromEdge = 0,
  linesAboveAndBelow = 0.5,
) => {
  doc.moveDown(linesAboveAndBelow);

  // TODO add alternative text.
  doc.markContent('Artifact', { type: 'Layout' });
  doc
    .moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesAboveAndBelow);
  return doc;
};

const getTestResultBlockHeight = (doc, item, initialBlock = false) => {
  let height = 0;

  // Account for height of horizontal rule.
  if (!initialBlock) {
    height += 16;
  }

  if (item.header) {
    height += 36;
  }

  item.items.forEach(resultItem => {
    // This is a gross hack that's necessary because the heightOfString doesn't always
    // return the correct height. See e.g. https://github.com/foliojs/pdfkit/issues/1438
    // TODO: account for longer lines.
    height += 24;
    if (resultItem.inline === false) {
      height += 24;
    }
    /**
     * Potential improved solution if issues with heightOfString are fixed:
     * 
    if (resultItem.inline === true) {
      height += doc.heightOfString(`${resultItem.title}: ${resultItem.value}`, 44, 0, {
        // Using regular weight is a bit of a fudge but should be
        // more accurate than using bold for the whole string.
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    } else {
      height += doc.heightOfString(`${resultItem.title}`, 44, 0, {
        font: 'SourceSansPro-Bold',
        fontSize: 16,
        lineGap: 0,
      });
      height += doc.heightOfString(resultItem.value, 44, 0, {
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    }
    */
  });

  return height;
};

const generate = async data => {
  const doc = new PDFDocument({
    pdfVersion: '1.7',
    lang: 'en-US',
    tagged: true,
    displayTitle: true,
    info: {
      Title: data.title,
    },
    autoFirstPage: false,
    bufferPages: true,
  });

  await registerFonts(doc, [
    'Bitter-Bold',
    'Bitter-Regular',
    'SourceSansPro-Bold',
    'SourceSansPro-Regular',
  ]);

  doc.addPage({
    margins: {
      top: 40,
      bottom: 40,
      left: 20,
      right: 20,
    },
  });

  // Introduction section.
  const introductionContent = [
    doc.struct('H1', () => {
      doc
        .font('Bitter-Bold')
        .fontSize(30)
        .text(data.title, { paragraphGap: 16 });
    }),
  ];
  if (data.preface) {
    introductionContent.push(
      doc.struct('P', () => {
        doc
          .font('Bitter-Regular')
          .fontSize(16)
          .text(data.preface, { paragraphGap: 24 });
      }),
    );
  }
  const introduction = doc.struct(
    'Sect',
    {
      title: 'Introduction',
    },
    introductionContent,
  );
  doc.addStructure(introduction);

  // Details section.
  if (data.details) {
    const details = doc.struct('Sect', {
      title: 'Details',
    });
    doc.addStructure(details);
    if (data.details.header) {
      details.add(
        doc.struct('H2', () => {
          doc
            .font('Bitter-Bold')
            .fontSize(24)
            .text(data.details.header, { x: 30, paragraphGap: 16 });
        }),
      );
    }
    const detailsItemsCount = data.details.items.length;
    if (detailsItemsCount > 0) {
      const list = doc.struct('L');
      data.details.items.forEach(item => {
        const listItem = doc.struct('LI');
        const listItemBody = doc.markStructureContent('LBody');
        const paragraphOptions = { lineGap: 0 };
        let titleText = item.title;
        if (item.inline === true) {
          paragraphOptions.continued = true;
          titleText += ': ';
        } else {
          titleText += ' ';
        }
        doc
          .font('SourceSansPro-Bold')
          .fontSize(16)
          .text(titleText, 30, doc.y, paragraphOptions);
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(`${item.value}`);
        doc.endMarkedContent();
        listItem.add(listItemBody);
        list.add(listItem);
      });
      details.add(list);
    }
    details.end();
  }

  // Results section.
  if (data.results) {
    const results = doc.struct('Sect', {
      title: 'Results',
    });
    doc.addStructure(results);
    if (data.results.header) {
      results.add(
        doc.struct('H2', () => {
          doc
            .font('Bitter-Bold')
            .fontSize(24)
            .text(data.results.header, 34, doc.y, { paragraphGap: 20 });
        }),
      );
    }
    let initialBlock = true;
    data.results.items.forEach((item, idx) => {
      // Insert a pagebreak if the next block will not fit on the current page,
      // taking the footer height into account.
      const blockHeight = getTestResultBlockHeight(doc, item, initialBlock);
      if (doc.y + blockHeight > 750) {
        initialBlock = true;
        doc.addPage();
      } else if (idx > 0) {
        initialBlock = false;
        results.add(
          doc.struct('NonStruct', () => {
            addHorizontalRule(doc, 30, 0.5);
          }),
        );
      }

      results.add(
        doc.struct('H3', () => {
          doc
            .font('SourceSansPro-Bold')
            .fontSize(18)
            .text(item.header, 34, doc.y, { paragraphGap: 10 });
        }),
      );

      const list = doc.struct('L');
      item.items.forEach(resultItem => {
        const listItem = doc.struct('LI');
        const listItemBody = doc.markStructureContent('LBody');
        const paragraphOptions = { lineGap: 0 };
        let titleText = resultItem.title;
        if (resultItem.inline === true) {
          paragraphOptions.continued = true;
          titleText += ': ';
        } else {
          titleText += ' ';
        }
        doc
          .font('SourceSansPro-Bold')
          .fontSize(16)
          .text(titleText, 44, doc.y, paragraphOptions);
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(`${resultItem.value}`);
        doc.endMarkedContent();
        listItem.add(listItemBody);
        list.add(listItem);
      });
      results.add(list);
    });
    results.end();
  }

  // Add header & footer.
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins.
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;
    doc.page.margins.right = 16;

    const header = doc.struct('Artifact', {
      type: 'Pagination',
      title: 'Header',
      attached: 'Top',
    });
    header.add(
      doc.struct('Span', () => {
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(data.headerLeft, 16, 12, { continued: true });
      }),
    );
    header.add(
      doc.struct('Span', () => {
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(data.headerRight, { align: 'right' });
      }),
    );
    header.end();
    doc.addStructure(header);

    const footer = doc.struct('Artifact', {
      type: 'Pagination',
      title: 'Footer',
      attached: 'Bottom',
    });
    let footerRightText = data.footerRight.replace('%PAGE_NUMBER%', i + 1);
    footerRightText = footerRightText.replace('%TOTAL_PAGES%', pages.count);
    footer.add(
      doc.struct('Span', () => {
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(data.footerLeft, 16, 766, { continued: true });
      }),
    );
    footer.add(
      doc.struct('Span', () => {
        doc
          .font('SourceSansPro-Regular')
          .fontSize(16)
          .text(footerRightText, { align: 'right' });
      }),
    );
    footer.end();
    doc.addStructure(footer);
  }

  doc.flushPages();
  return doc;
};

export { generate };
