/**
 * Blue Button PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import { MissingFieldsException } from '../utils/exceptions/MissingFieldsException';
import {
  createAccessibleDoc,
  addHorizontalRule,
  createDetailItem,
  createHeading,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
  generateFinalHeaderContent,
  generateFooterContent,
  generateInitialHeaderContent,
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
      size: 16,
    },
    H4: {
      font: 'Bitter-Bold',
      size: 14,
    },
    H5: {
      font: 'Bitter-Bold',
      size: 12,
    },
  },
  subHeading: {
    font: 'Bitter-Regular',
    size: 12,
  },
  tocHeading: {
    font: 'Bitter-Bold',
    size: 14,
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateTitleSection = (doc, parent, data) => {
  const titleSection = doc.struct('Sect', {
    title: 'Introduction',
  });
  parent.add(titleSection);
  titleSection.add(
    createHeading(doc, 'H1', config, 'Blue Button report', {
      x: 20,
      paragraphGap: 5,
    }),
  );
  const subTitleOptions = { lineGap: 6 };

  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          'This report includes key information from your VA medical records.',
          20,
          doc.y,
          subTitleOptions,
        );
    }),
  );
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(data.name, 20, doc.y, subTitleOptions);
    }),
  );
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(`Date of birth: ${data.dob}`, 20, doc.y, { lineGap: 20 });
    }),
  );

  doc.moveDown();
  titleSection.end();
};

const generateInfoSection = (doc, parent) => {
  const infoSection = doc.struct('Sect', {
    title: 'Information',
  });
  infoSection.add(
    createHeading(
      doc,
      'H2',
      config,
      'What to know about your Blue Button report',
      { x: 20, paragraphGap: 12 },
    ),
  );
  parent.add(infoSection);
  infoSection.add(
    doc.struct('List', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .list(
          [
            "If you print or download your Blue Button report, you'll need to take responsibility for protecting the information in the report.",
            'Some records in this report are available 36 hours after providers enter them. This includes care summaries and notes, health condition records, and most lab and test results.',
            "This report doesn't include information you entered yourself. To find information you entered yourself, go back to the previous version of Blue Button on the My HealtheVet website.",
          ],
          {
            lineGap: 2,
            paragraphGap: 10,
            listType: 'bullet',
            bulletRadius: 2,
            bulletIndent: 20,
            x: 6,
          },
        );
    }),
  );

  doc.moveDown();
  infoSection.end();
};

const generateHelpSection = (doc, parent) => {
  const infoSection = doc.struct('Sect', {
    title: 'Information',
  });
  infoSection.add(
    createHeading(doc, 'H2', config, 'Need help?', { x: 20, paragraphGap: 12 }),
  );
  parent.add(infoSection);
  infoSection.add(
    doc.struct('List', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .list(
          [
            'If you have questions about this report or you need to add information to your records, send a secure message to your care team.',
            "If you're ever in crisis and need to talk with someone right away, call the Veterans Crisis line at 988. Then select 1.",
          ],
          {
            lineGap: 2,
            paragraphGap: 10,
            listType: 'bullet',
            bulletRadius: 2,
            bulletIndent: 20,
            x: 6,
          },
        );
    }),
  );

  doc.moveDown();
  infoSection.end();
};

const generateCoverPage = async (doc, parent, data) => {
  await generateTitleSection(doc, parent, data);
  await generateInfoSection(doc, parent);
  await generateHelpSection(doc, parent);
};

const validate = data => {
  const requiredFields = [];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length) {
    throw new MissingFieldsException(missingFields);
  }
};

const generateTocItem = (doc, parent, data, pageData) => {
  const leftMargin = 100;
  const pages =
    pageData.startPage === pageData.endPage
      ? `page ${pageData.startPage}`
      : `pages ${pageData.startPage} - ${pageData.endPage}`;
  const tocItemTitle =
    pages.length > 13 ? data.title.slice(0, 13 - pages.length) : data.title;

  parent.add(
    doc.struct('P', () => {
      doc
        .font(config.tocHeading.font)
        .fontSize(config.tocHeading.size)
        .text(`${tocItemTitle} ${pages}`, leftMargin, doc.y, {
          lineGap: 6,
        });
    }),
  );
  parent.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(data.subtitle, leftMargin, doc.y, {
          lineGap: 6,
          width: 410,
        });
    }),
  );
  doc.moveDown();
};

const generateTableOfContents = (doc, parent, data, tocPageData) => {
  doc.switchToPage(1);
  const tableOfContents = doc.struct('Sect', {
    title: 'Table of contents',
  });
  tableOfContents.add(
    createHeading(doc, 'H2', config, 'Table of contents', {
      paragraphGap: 30,
      align: 'center',
      y: 100,
    }),
  );
  parent.add(tableOfContents);
  for (const recordSet of data.recordSets) {
    // TODO: Enable ToC to span multiple pages, possibly by generating
    // separate PDFs and then combining them since the ToC is generated
    // within the doc after the rest of the doc is generated
    generateTocItem(
      doc,
      tableOfContents,
      recordSet.toc,
      tocPageData[recordSet.type],
    );
  }

  doc.moveDown();
  tableOfContents.end();
};

const generateRecordSetIntroduction = async (doc, parent, recordSet) => {
  const headOptions = { x: 20, paragraphGap: 10 };
  const subHeadOptions = { paragraphGap: 0 };
  const introduction = doc.struct('Sect', {
    title: `${recordSet.title} Introduction`,
  });
  parent.add(introduction);
  introduction.add(
    createHeading(doc, 'H2', config, recordSet.title, headOptions),
  );

  for (const subtitle of recordSet.subtitles) {
    introduction.add(createSubHeading(doc, config, subtitle, subHeadOptions));
    doc.moveDown();
  }

  doc.moveDown();
  introduction.end();
};

const generateRecordTitle = (doc, parent, record) => {
  const title = doc.struct('Sect', {
    title: `Header`,
  });
  parent.add(title);

  const headOptions = { x: 20, paragraphGap: 0 };
  title.add(createHeading(doc, 'H3', config, record.title, headOptions));

  doc.moveDown();
  title.end();
};

const generateDetailsContent = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);
  if (data.details.header) {
    const headOptions = { x: 30, paragraphGap: 12 };
    details.add(
      createHeading(doc, 'H4', config, data.details.header, headOptions),
    );
  }
  const itemIndent = data.details.header ? 40 : 30;
  for (const item of data.details.items) {
    const structs = await createDetailItem(doc, config, itemIndent, item);
    for (const struct of structs) {
      details.add(struct);
    }
  }
  doc.moveDown();
  details.end();
};

const generateResultItemContent = async (
  item,
  doc,
  results,
  hasHorizontalRule,
  hasH2,
) => {
  const headingOptions = { paragraphGap: 10, x: hasH2 ? 40 : 20 };
  if (item.header) {
    results.add(
      await createHeading(
        doc,
        hasH2 ? 'H5' : 'H3',
        config,
        item.header,
        headingOptions,
      ),
    );
  }

  for (const resultItem of item.items) {
    let indent = item.header ? 50 : 40;
    if (!hasH2) indent = 30;
    const structs = await createDetailItem(doc, config, indent, resultItem);
    for (const struct of structs) {
      results.add(struct);
    }
  }

  if (hasHorizontalRule) {
    addHorizontalRule(doc, 30, 1.5, 1.5);
  }
};

export const generateResultsContent = async (doc, parent, data) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = { paragraphGap: 12, x: 30 };
    results.add(
      createHeading(doc, 'H4', config, data.results.header, headingOptions),
    );
  }

  if (data.results.preface) {
    const prefaceOptions = {
      paragraphGap: 12,
      x: 30,
    };
    results.add(
      createSubHeading(doc, config, data.results.preface, prefaceOptions),
    );
  }

  const hasHorizontalRule = data.results.sectionSeparators !== false;
  const hasH2 = !!data.results.header;
  if (data.results.items.length === 1) {
    await generateResultItemContent(
      data.results.items[0],
      doc,
      results,
      hasHorizontalRule,
      hasH2,
    );
  } else {
    for (const item of data.results.items) {
      // Insert a pagebreak if the next block will not fit on the current page,
      // taking the footer height into account.
      const blockHeight = getTestResultBlockHeight(
        doc,
        item,
        hasHorizontalRule,
      );
      if (doc.y + blockHeight > 740) await doc.addPage();

      await generateResultItemContent(
        item,
        doc,
        results,
        hasHorizontalRule,
        hasH2,
      );
    }
  }
  doc.moveDown();
  results.end();
};

const generate = async data => {
  validate(data);
  const tocPageData = {};
  const doc = createAccessibleDoc(data, config);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateCoverPage(doc, wrapper, data);
  doc.addPage({ margins: config.margins });
  generateInitialHeaderContent(doc, wrapper, data, config, {
    nameDobOnly: true,
  });

  for (const recordSet of data.recordSets) {
    doc.addPage({ margins: config.margins });
    const startPage = doc.bufferedPageRange().count;
    tocPageData[recordSet.type] = { startPage };
    generateInitialHeaderContent(doc, wrapper, data, config, {
      headerBannerOnly: true,
    });
    generateRecordSetIntroduction(doc, wrapper, recordSet);
    if (Array.isArray(recordSet.records)) {
      for (const record of recordSet.records) {
        generateRecordTitle(doc, wrapper, record);

        if (record.details) {
          await generateDetailsContent(doc, wrapper, record);
        }
        if (record.results) {
          await generateResultsContent(doc, wrapper, record);
        }
      }
    } else {
      const record = recordSet.records;
      if (record.details) {
        await generateDetailsContent(doc, wrapper, record);
      }
      if (record.results) {
        await generateResultsContent(doc, wrapper, record);
      }
    }
    const endPage = doc.bufferedPageRange().count;
    tocPageData[recordSet.type].endPage = endPage;
  }

  await generateTableOfContents(doc, wrapper, data, tocPageData);

  doc.font(config.text.font).fontSize(config.text.size);
  await generateFinalHeaderContent(doc, data, config, 2);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
