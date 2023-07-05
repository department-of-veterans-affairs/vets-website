/**
 * Lab and Test Results PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import { MissingFieldsException } from '../utils/exceptions/MissingFieldsException';

import {
  createAccessibleDoc,
  createArtifactText,
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
      size: 24,
    },
    H2: {
      font: 'Bitter-Bold',
      size: 18,
    },
    H3: {
      font: 'Bitter-Bold',
      size: 16,
    },
  },
  subHeading: {
    font: 'Bitter-Regular',
    size: 12,
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateIntroductionContent = async (doc, parent, data) => {
  // The y position must be specified to prevent defaulting to the current document position
  // which doesn't respect the configured top margin of the page.
  const headOptions = { x: 20, y: config.margins.top, paragraphGap: 5 };
  const subHeadOptions = { paragraphGap: 0 };
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
  doc.moveDown();
  introduction.end();
};

const generateDetailsContent = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);
  if (data.details.header) {
    const headOptions = { x: 20, paragraphGap: 12 };
    details.add(
      createHeading(doc, 'H2', config, data.details.header, headOptions),
    );
  }
  const itemIndent = data.details.header ? 30 : 20;
  for (const item of data.details.items) {
    const structs = await createDetailItem(doc, config, itemIndent, item);
    for (const struct of structs) {
      details.add(struct);
    }
  }
  doc.moveDown();
  details.end();
};

const generateResultsContent = async (doc, parent, data) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = { paragraphGap: 12, x: 20 };
    results.add(
      createHeading(doc, 'H2', config, data.results.header, headingOptions),
    );
  }
  if (data.results.preface) {
    const prefaceOptions = { paragraphGap: 12, x: 20 };
    results.add(
      createSubHeading(doc, config, data.results.preface, prefaceOptions),
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
      if (data.results.sectionSeparators !== false) {
        results.add(
          doc.struct('Artifact', () => {
            addHorizontalRule(doc, 30, 1.5);
          }),
        );
      }
    }

    const headingOptions = { paragraphGap: 10, x: 30 };
    if (item.header) {
      results.add(
        await createHeading(doc, 'H3', config, item.header, headingOptions),
      );
    }

    for (const resultItem of item.items) {
      const structs = await createDetailItem(doc, config, 40, resultItem);
      for (const struct of structs) {
        results.add(struct);
      }
    }
  }
  results.end();
};

const generateHeaderBanner = async (doc, header, data) => {
  doc.moveDown(1);
  const currentHeight = doc.y;

  // Calculate text width
  let width = 0;
  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font =
      element.weight === 'bold' ? config.text.boldFont : config.text.font;

    doc.font(font);
    doc.fontSize(config.text.size);
    width += doc.widthOfString(element.text);
  }

  // This math is based on US Letter page size and will have to be adjusted
  // if we ever offer document size as a parameter.
  const leftMargin = (612 - 32 - width) / 2 + 20;

  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font =
      element.weight === 'bold' ? config.text.boldFont : config.text.font;
    const paragraphOptions = {};
    if (i < data.headerBanner.length) {
      paragraphOptions.continued = true;
    }

    header.add(
      doc.struct('Span', () => {
        doc
          .font(font)
          .fontSize(config.text.size)
          .text(element.text, leftMargin, doc.y, paragraphOptions);
      }),
    );
  }

  const height = doc.y - currentHeight + 25;

  doc.rect(20, currentHeight - 4, 580, height).stroke();

  doc.moveDown(3);

  // This is an ugly hack that resets the document X position
  // so that the document header is shown correctly.
  header.add(
    doc.struct('Artifact', () => {
      doc.text('', 20, doc.y);
    }),
  );
};

const generateInitialHeaderContent = async (doc, parent, data) => {
  // Adjust page margins so that we can write in the header/footer area.
  // eslint-disable-next-line no-param-reassign
  doc.page.margins = {
    top: 0,
    bottom: 0,
    left: 20,
    right: 16,
  };

  const header = doc.struct('Sect', {
    type: 'Pagination',
    title: 'Header',
    attached: 'Top',
  });
  parent.add(header);
  const leftOptions = { continued: true, x: 20, y: 12 };
  header.add(createSpan(doc, config, data.headerLeft, leftOptions));
  const rightOptions = { align: 'right' };
  header.add(createSpan(doc, config, data.headerRight, rightOptions));

  if (data.headerBanner) {
    generateHeaderBanner(doc, header, data);
  }

  header.end();

  // eslint-disable-next-line no-param-reassign
  doc.page.margins = config.margins;
};

const generateFinalHeaderContent = async (doc, parent, data) => {
  const pages = doc.bufferedPageRange();
  for (let i = 1; i < pages.count; i += 1) {
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
    header.add(createArtifactText(doc, config, data.headerLeft, leftOptions));
    const rightOptions = { align: 'right' };
    header.add(createArtifactText(doc, config, data.headerRight, rightOptions));
    header.end();
  }
};

const generateFooterContent = async (doc, parent, data) => {
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

    const groupingStruct = i === pages.count - 1 ? 'Struct' : 'Artifact';
    const footer = doc.struct(groupingStruct, {
      type: 'Pagination',
      title: 'Footer',
      attached: 'Bottom',
    });
    parent.add(footer);

    let footerRightText = data.footerRight.replace('%PAGE_NUMBER%', i + 1);
    footerRightText = footerRightText.replace('%TOTAL_PAGES%', pages.count);
    const footerLeftOptions = { continued: true, x: 20, y: 766 };
    const footerRightOptions = { align: 'right' };

    // Only allow the last footer element to be read by screen readers.
    if (i === pages.count - 1) {
      footer.add(createSpan(doc, config, data.footerLeft, footerLeftOptions));
      footer.add(createSpan(doc, config, footerRightText, footerRightOptions));
    } else {
      footer.add(
        createArtifactText(doc, config, data.footerLeft, footerLeftOptions),
      );
      footer.add(
        createArtifactText(doc, config, footerRightText, footerRightOptions),
      );
    }
    footer.end();
  }
};

const validate = data => {
  const requiredFields = [
    'title',
    'headerLeft',
    'headerRight',
    'footerLeft',
    'footerRight',
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length) {
    throw new MissingFieldsException(missingFields);
  }
};

const generate = async data => {
  validate(data);

  const doc = createAccessibleDoc(data);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateInitialHeaderContent(doc, wrapper, data);

  await generateIntroductionContent(doc, wrapper, data);

  if (data.details) {
    await generateDetailsContent(doc, wrapper, data);
  }

  if (data.results) {
    await generateResultsContent(doc, wrapper, data);
  }

  await generateFinalHeaderContent(doc, wrapper, data);
  await generateFooterContent(doc, wrapper, data);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
