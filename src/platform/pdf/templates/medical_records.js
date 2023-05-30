/**
 * Lab and Test Results PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import {
  createAccessibleDoc,
  addHorizontalRule,
  createDetailItem,
  createHeading,
  createSpan,
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
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 16,
  },
};

const generateIntroductionContent = async (doc, parent, data) => {
  const headOptions = { paragraphGap: 16 };
  const subHeadOptions = { paragraphGap: 24 };
  const introduction = doc.struct('Sect', {
    title: 'Introduction',
  });
  parent.add(introduction);
  introduction.add(createHeading(doc, 'H1', config, data.title, headOptions));
  if (data.preface) {
    introduction.add(
      createSubHeading(doc, config, data.preface, subHeadOptions),
    );
  }
  introduction.end();
};

const generateDetailsContent = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);
  if (data.details.header) {
    const headOptions = { x: 30, paragraphGap: 16 };
    details.add(
      createHeading(doc, 'H2', config, data.details.header, headOptions),
    );
  }
  for (const item of data.details.items) {
    const structs = await createDetailItem(doc, config, 30, item);
    for (const struct of structs) {
      details.add(struct);
    }
  }
  details.end();
};

const generateResultsContent = async (doc, parent, data) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = { paragraphGap: 20, x: 34 };
    results.add(
      createHeading(doc, 'H2', config, data.results.header, headingOptions),
    );
  }
  let initialBlock = true;
  for (const [idx, item] of data.results.items.entries()) {
    // Insert a pagebreak if the next block will not fit on the current page,
    // taking the footer height into account.
    const blockHeight = getTestResultBlockHeight(doc, item, initialBlock);
    if (doc.y + blockHeight > 750) {
      initialBlock = true;
      await doc.addPage();
    } else if (idx > 0) {
      initialBlock = false;
      results.add(
        doc.struct('Artifact', () => {
          addHorizontalRule(doc, 30, 0.5);
        }),
      );
    }

    const headingOptions = { paragraphGap: 10, x: 34 };
    if (item.header) {
      results.add(
        await createHeading(doc, 'H3', config, item.header, headingOptions),
      );
    }

    for (const resultItem of item.items) {
      const structs = await createDetailItem(doc, config, 44, resultItem);
      for (const struct of structs) {
        results.add(struct);
      }
    }
  }
  results.end();
};

const generateHeaderAndFooterContent = async (doc, parent, data) => {
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
    parent.add(header);
    const leftOptions = { continued: true, x: 16, y: 12 };
    header.add(createSpan(doc, config, data.headerLeft, leftOptions));
    const rightOptions = { align: 'right' };
    header.add(createSpan(doc, config, data.headerRight, rightOptions));
    header.end();

    const footer = doc.struct('Artifact', {
      type: 'Pagination',
      title: 'Footer',
      attached: 'Bottom',
    });
    parent.add(footer);
    let footerRightText = data.footerRight.replace('%PAGE_NUMBER%', i + 1);
    footerRightText = footerRightText.replace('%TOTAL_PAGES%', pages.count);
    const footerLeftOptions = { continued: true, x: 16, y: 766 };
    footer.add(createSpan(doc, config, data.footerLeft, footerLeftOptions));
    const footerRightOptions = { align: 'right' };
    footer.add(createSpan(doc, config, footerRightText, footerRightOptions));
    footer.end();
  }
};

const generate = async data => {
  const doc = createAccessibleDoc(data);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateIntroductionContent(doc, wrapper, data);

  if (data.details) {
    await generateDetailsContent(doc, wrapper, data);
  }

  if (data.results) {
    await generateResultsContent(doc, wrapper, data);
  }

  await generateHeaderAndFooterContent(doc, wrapper, data);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
