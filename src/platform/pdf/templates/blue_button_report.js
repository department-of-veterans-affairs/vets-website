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
  createRichTextDetailItem,
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
    monospaceFont: 'RobotoMono-Regular',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateTitleSection = (doc, parent, data) => {
  const subTitleOptions = { lineGap: 6 };

  const titleSection = doc.struct('Sect', {
    title: 'Title',
  });
  titleSection.add(
    createHeading(doc, 'H1', config, 'VA medical records', {
      x: 20,
      paragraphGap: 12,
    }),
  );
  parent.add(titleSection);
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          'This report contains information from your VA medical records.',
          20,
          doc.y,
        );
    }),
  );

  doc.moveDown();

  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Note: ', 20, doc.y, {
          continued: true,
        });
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          "This report doesn't include information you entered yourself. To find information you entered yourself, download a self-entered health information report.",
          20,
          doc.y,
          {
            paragraphOptions: { lineGap: 20 },
            continued: false,
          },
        );
    }),
  );

  doc.moveDown();

  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(`Name: ${data.name}`, 20, doc.y, subTitleOptions);
    }),
  );
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(`Date of birth: ${data.dob}`, 20, doc.y, subTitleOptions);
    }),
  );
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        // TODO: pass last updated date in and use.
        .text(`Last updated at ????`, 20, doc.y, { lineGap: 20 });
    }),
  );

  doc.moveDown();
  titleSection.end();
};

const generateDateRangeParagraph = (section, doc, data) => {
  section.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Date range: ', 20, doc.y, {
          continued: true,
        });
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(`${data.fromDate} to ${data.toDate}`, 20, doc.y, {
          paragraphOptions: { lineGap: 20 },
          continued: false,
        });
    }),
  );
  doc.moveDown();
};

const getAvailableRecordSets = recordSets => {
  return recordSets.filter(recordSet => {
    if (!recordSet.selected) return false;
    if (Array.isArray(recordSet.records)) {
      return recordSet.records.length;
    }
    return (
      recordSet.records.results?.length ||
      recordSet.records.results?.items?.length
    );
  });
};

const getUnavailableRecordSets = recordSets => {
  return recordSets.filter(recordSet => {
    if (!recordSet.selected) return false;
    if (Array.isArray(recordSet.records)) {
      return recordSet.records.length === 0;
    }
    return (
      recordSet.records.results?.length === 0 &&
      recordSet.records.results?.items?.length === 0
    );
  });
};

const generateInfoForAvailableRecords = (infoSection, doc, data) => {
  infoSection.add(
    createHeading(doc, 'H2', config, 'Records in this report', {
      x: 20,
      paragraphGap: 12,
    }),
  );

  generateDateRangeParagraph(infoSection, doc, data);

  infoSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          'This report contains information from your VA medical records.',
          20,
          doc.y,
        );
    }),
  );

  doc.moveDown();

  const listOptions = {
    lineGap: -2,
    paragraphGap: 6,
    listType: 'bullet',
    bulletRadius: 2,
    bulletIndent: 20,
    x: 6,
  };
  infoSection.add(
    doc.struct('List', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .list(
          getAvailableRecordSets(data.recordSets).map(
            recordSet => recordSet.title,
          ),
          listOptions,
        );
    }),
  );
};

const generateInfoForUnavailableRecords = (infoSection, doc, data) => {
  doc.moveDown();

  infoSection.add(
    createHeading(doc, 'H2', config, 'Records not in this report', {
      x: 20,
      paragraphGap: 12,
    }),
  );

  infoSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          "You don't have any VA medical records in these categories you selected for this report:",
          20,
          doc.y,
        );
    }),
  );

  doc.moveDown();

  const listOptions = {
    lineGap: -2,
    paragraphGap: 6,
    listType: 'bullet',
    bulletRadius: 2,
    bulletIndent: 20,
    x: 6,
  };
  infoSection.add(
    doc.struct('List', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .list(
          getUnavailableRecordSets(data.recordSets).map(
            recordSet => recordSet.title,
          ),
          listOptions,
        );
    }),
  );

  doc.moveDown();

  infoSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          'If you think you should have records in these categories, contact your VA health facility.',
          20,
          doc.y,
        );
    }),
  );
};

const generateInfoSection = (doc, parent, data) => {
  const infoSection = doc.struct('Sect', {
    title: 'Information',
  });
  parent.add(infoSection);

  generateInfoForAvailableRecords(infoSection, doc, data);

  if (getUnavailableRecordSets(data.recordSets).length) {
    generateInfoForUnavailableRecords(infoSection, doc, data);
  }

  // Add horizontal rule
  addHorizontalRule(doc, 30, 1.5, 1.5);

  infoSection.end();
};

const generateCoverPage = async (doc, parent, data) => {
  await generateTitleSection(doc, parent, data);
  await generateInfoSection(doc, parent, data);
};

const validate = data => {
  const requiredFields = [];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length) {
    throw new MissingFieldsException(missingFields);
  }
};

const generateRecordSetIntroduction = async (doc, parent, recordSet) => {
  const headOptions = {
    x: 20,
    paragraphGap: recordSet.titleParagraphGap ?? 10,
  };
  const subHeadOptions = { paragraphGap: 0 };
  const introduction = doc.struct('Sect', {
    title: `${recordSet.title} Introduction`,
  });
  parent.add(introduction);
  introduction.add(
    createHeading(doc, 'H2', config, recordSet.title, headOptions),
  );

  if (recordSet.subtitles) {
    for (const subtitle of recordSet.subtitles) {
      introduction.add(createSubHeading(doc, config, subtitle, subHeadOptions));
      doc.moveDown();
    }
  }

  if (recordSet.titleMoveDownAmount) {
    doc.moveDown(recordSet.titleMoveDownAmount);
  } else doc.moveDown();
  introduction.end();
};

const generateRecordTitle = (doc, parent, record) => {
  const title = doc.struct('Sect', {
    title: `Header`,
  });
  parent.add(title);

  const headOptions = { x: 20, paragraphGap: 0 };
  title.add(createHeading(doc, 'H3', config, record.title, headOptions));

  if (record.titleMoveDownAmount) doc.moveDown(record.titleMoveDownAmount);
  else doc.moveDown();
  title.end();
};

const generateDetailsContentSets = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);

  for (const detail of data.details) {
    if (detail.header) {
      const headOptions = { x: 30, paragraphGap: 12 };
      details.add(createHeading(doc, 'H4', config, detail.header, headOptions));
    }
    const itemIndent = 30;
    for (const item of detail.items) {
      let structs;

      if (item.isRich) {
        structs = await createRichTextDetailItem(doc, config, itemIndent, item);
      } else {
        structs = await createDetailItem(doc, config, itemIndent, item);
      }

      for (const struct of structs) {
        details.add(struct);
      }
    }
    doc.moveDown();
  }

  doc.moveDown();
  details.end();
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
  const headingOptions = {
    paragraphGap: item.headerGap ?? 10,
    x: item.headerIndent || (hasH2 ? 40 : 20),
  };
  if (item.header) {
    results.add(
      await createHeading(
        doc,
        item.headerType || (hasH2 ? 'H5' : 'H3'),
        config,
        item.header,
        headingOptions,
      ),
    );
  }

  for (const resultItem of item.items) {
    let indent = item.header ? 50 : 40;
    if (!hasH2) indent = 30;
    if (item.itemsIndent) indent = item.itemsIndent;

    let structs;
    if (resultItem.isRich) {
      structs = await createRichTextDetailItem(doc, config, indent, resultItem);
    } else {
      structs = await createDetailItem(doc, config, indent, resultItem);
    }

    for (const struct of structs) {
      results.add(struct);
    }
  }

  if (hasHorizontalRule) {
    addHorizontalRule(doc, 30, 1.5, 1.5);
  }
  if (item.spaceResults) doc.moveDown(item.spaceResults);
};

export const generateResultsContent = async (doc, parent, data) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = {
      paragraphGap: 12,
      x: data.results.headerIndent || 30,
    };
    results.add(
      createHeading(
        doc,
        data.results.headerType || 'H4',
        config,
        data.results.header,
        headingOptions,
      ),
    );
  }

  if (data.results.preface) {
    const prefaceOptions = {
      paragraphGap: 12,
      x: data.results.prefaceIndent || 30,
    };
    if (Array.isArray(data.results.preface)) {
      data.results.preface.forEach(item => {
        results.add(
          createSubHeading(doc, config, item.value, {
            ...prefaceOptions,
            ...item.prefaceOptions,
          }),
        );
      });
    } else if (typeof data.results.preface === 'object') {
      results.add(
        createSubHeading(doc, config, data.results.preface.value, {
          ...prefaceOptions,
          ...data.results.preface.prefaceOptions,
        }),
      );
    } else {
      results.add(
        createSubHeading(doc, config, data.results.preface, prefaceOptions),
      );
    }
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

  generateInitialHeaderContent(doc, wrapper, data, config, {
    nameDobOnly: false,
  });

  await generateCoverPage(doc, wrapper, data);

  for (const recordSet of getAvailableRecordSets(data.recordSets)) {
    doc.addPage({ margins: config.margins });
    const startPage = doc.bufferedPageRange().count;
    tocPageData[recordSet.type] = { startPage };
    generateInitialHeaderContent(doc, wrapper, data, config, {
      headerBannerOnly: true,
    });
    generateRecordSetIntroduction(doc, wrapper, recordSet);
    if (Array.isArray(recordSet.records)) {
      for (const record of recordSet.records) {
        if (record.title) generateRecordTitle(doc, wrapper, record);

        if (Array.isArray(record.details)) {
          await generateDetailsContentSets(doc, wrapper, record);
        } else if (record.details) {
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

  // await generateTableOfContents(doc, wrapper, data, tocPageData);

  doc.font(config.text.font).fontSize(config.text.size);
  await generateFinalHeaderContent(doc, data, config);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
