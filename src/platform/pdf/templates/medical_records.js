/**
 * Lab and Test Results PDF template.
 */
import {
  createAccessibleDoc,
  addHorizontalRule,
  createHeading,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
} from './utils';

const config = {
  margins: {
    top: 40,
    bottom: 40,
    left: 20,
    right: 20,
  },
  headings: {
    H1: {
      font: 'Bitter-Bold',
      size: 30,
    },
    H2: {
      font: 'Bitter-Bold',
      size: 24,
    },
    H3: {
      font: 'Bitter-Bold',
      size: 18,
    },
  },
  subHeading: {
    font: 'Bitter-Regular',
    size: 16,
  },
  text: {
    font: 'SourceSansPro-Regular',
    size: 16,
  },
};

const generateIntroductionContent = async (doc, data) => {
  const headOptions = { paragraphGap: 16 };
  const subHeadOptions = { paragraphGap: 24 };
  const introductionContent = [
    createHeading(doc, 'H1', config, data.title, headOptions),
  ];
  if (data.preface) {
    introductionContent.push(
      createSubHeading(doc, config, data.preface, subHeadOptions),
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
};

const generateDetailsContent = async (doc, data) => {
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
    data.details.items.forEach(item => {
      const paragraphOptions = { lineGap: 0 };
      let titleText = item.title;
      if (item.inline === true) {
        paragraphOptions.continued = true;
        titleText += ': ';
      } else {
        titleText += ' ';
      }
      details.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Bold')
            .fontSize(16)
            .text(titleText, 30, doc.y, paragraphOptions);
          doc
            .font('SourceSansPro-Regular')
            .fontSize(16)
            .text(`${item.value}`);
        }),
      );
    });
  }
  details.end();
};

const generateResultsContent = async (doc, data) => {
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

    item.items.forEach(resultItem => {
      const paragraphOptions = { lineGap: 0 };
      let titleText = resultItem.title;
      if (resultItem.inline === true) {
        paragraphOptions.continued = true;
        titleText += ': ';
      } else {
        titleText += ' ';
      }
      results.add(
        doc.struct('P', () => {
          doc
            .font('SourceSansPro-Bold')
            .fontSize(16)
            .text(titleText, 44, doc.y, paragraphOptions);
          doc
            .font('SourceSansPro-Regular')
            .fontSize(16)
            .text(`${resultItem.value}`);
        }),
      );
    });
  });
  results.end();
};

const generateHeaderAndFooterContent = async (doc, data) => {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins so that we can write in the header/footer area.
    // eslint-disable-next-line no-param-reassign
    doc.page.margins = {
      top: 0,
      bottom: 0,
      left: 20,
      right: 16,
    };

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
};

const generate = async data => {
  const doc = createAccessibleDoc(data.title);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateIntroductionContent(doc, data);

  if (data.details) {
    await generateDetailsContent(doc, data);
  }

  if (data.results) {
    await generateResultsContent(doc, data);
  }

  await generateHeaderAndFooterContent(doc, data);

  doc.flushPages();
  return doc;
};

export { generate };
