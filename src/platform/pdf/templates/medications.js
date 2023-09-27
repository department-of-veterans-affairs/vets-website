/**
 * Medications PDF template.
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
  registerVaGovFonts,
  createImageDetailItem,
} from './utils';

const config = {
  margins: {
    top: 40,
    bottom: 32,
    left: 16,
    right: 32,
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
    H4: {
      font: 'Bitter-Bold',
      size: 14,
    },
  },
  subHeading: {
    font: 'SourceSansPro-Regular',
    size: 12,
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateIntroductionContent = async (doc, parent, data) => {
  const introduction = doc.struct('Sect', {
    title: 'Introduction',
  });
  parent.add(introduction);

  // title
  introduction.add(
    createHeading(doc, 'H1', config, data.title, { x: 16, paragraphGap: 10 }),
  );

  // preface
  if (data.preface) {
    introduction.add(createSubHeading(doc, config, data.preface, { x: 16 }));
  }

  doc.moveDown();
  introduction.end();
};

const generateResultsMedicationListContent = async (
  medication,
  doc,
  results,
  hasHorizontalRule,
) => {
  // medication header
  if (medication.header) {
    results.add(
      await createHeading(doc, 'H3', config, medication.header, {
        paragraphGap: 10,
        x: 16,
      }),
    );
  }

  // medication section header
  for (const section of medication.sections) {
    results.add(
      await createHeading(doc, 'H4', config, section.header, {
        paragraphGap: 10,
        x: 16,
      }),
    );

    // medication section items
    for (const resultItem of section.items) {
      let structs;
      // image item
      // TODO: check integration when CORS issue is resolved
      if (resultItem.value && typeof resultItem.value === 'object') {
        structs = await createImageDetailItem(doc, config, 32, resultItem);
        // regular item
      } else {
        structs = await createDetailItem(doc, config, 32, resultItem);
      }

      // TODO: refactor to make it work with images when available
      // If the next item does not fit - move to the next page
      let height = doc.heightOfString(
        `${resultItem.title}: ${resultItem.value}`,
        {
          font: config.text.font,
          size: config.text.size,
        },
      );
      height = resultItem.inline ? height : height + 24;
      if (doc.y + height > doc.page.height - doc.page.margins.bottom)
        await doc.addPage();

      for (const struct of structs) {
        results.add(struct);
      }
    }

    doc.moveDown(0.5);
  }

  // horizontal line
  if (hasHorizontalRule) {
    results.add(
      doc.struct('Artifact', () => {
        addHorizontalRule(doc, 16, 0, 1);
      }),
    );
  }
};

const generateResultsContent = async (doc, parent, data) => {
  for (const resultItem of data.results) {
    const results = doc.struct('Sect', {
      title: resultItem.header || 'Results',
    });
    parent.add(results);

    // results --> header
    if (resultItem.header) {
      results.add(
        createHeading(doc, 'H2', config, resultItem.header, {
          paragraphGap: 12,
          x: 16,
        }),
      );
    }

    // results --> preface
    if (resultItem.preface) {
      results.add(
        createSubHeading(doc, config, resultItem.preface, {
          paragraphGap: 12,
          x: 16,
        }),
      );
    }

    // results --> items
    const hasHorizontalRule = resultItem.sectionSeparators !== false;
    for (const medication of resultItem.medicationsList) {
      await generateResultsMedicationListContent(
        medication,
        doc,
        results,
        hasHorizontalRule,
      );
    }

    results.end();
  }
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
  const leftMargin = (612 - 32 - width) / 2 + 16;

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

  doc.rect(16, currentHeight - 4, 580, height).stroke();

  doc.moveDown(3);

  // This is an ugly hack that resets the document X position
  // so that the document header is shown correctly.
  header.add(
    doc.struct('Artifact', () => {
      doc.text('', 16, doc.y);
    }),
  );
};

const generateInitialHeaderContent = async (doc, parent, data) => {
  // Adjust page margins so that we can write in the header/footer area.
  // eslint-disable-next-line no-param-reassign
  doc.page.margins = {
    top: 0,
    bottom: 0,
    left: 16,
    right: 16,
  };

  const header = doc.struct('Sect', {
    type: 'Pagination',
    title: 'Header',
    attached: 'Top',
  });
  parent.add(header);
  const leftOptions = { continued: true, x: 16, y: 12 };
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
      left: 16,
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
      left: 16,
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
    const footerLeftOptions = { continued: true, x: 16, y: 766 };
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

  const doc = createAccessibleDoc(data, config);

  await registerVaGovFonts(doc);
  doc.addPage();

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateInitialHeaderContent(doc, wrapper, data);

  await generateIntroductionContent(doc, wrapper, data);

  if (data.results && data.results.length) {
    await generateResultsContent(doc, wrapper, data);
  }

  await generateFinalHeaderContent(doc, wrapper, data);
  await generateFooterContent(doc, wrapper, data);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
