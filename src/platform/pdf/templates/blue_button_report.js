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
    left: 16,
    right: 16,
  },
  indents: {
    one: 45,
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
  text: {
    boldFont: 'SourceSansPro-Bold',
    monospaceFont: 'RobotoMono-Regular',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateTitleSection = (doc, parent, data) => {
  const subTitleOptions = { lineGap: 3 };

  const titleSection = doc.struct('Sect', {
    title: 'Title',
  });
  titleSection.add(
    createHeading(doc, 'H1', config, 'VA medical records', {
      x: config.margins.left,
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
          config.margins.left,
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
        .text('Note: ', config.margins.left, doc.y, {
          continued: true,
        });
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          "This report doesn't include information you entered yourself. To find information you entered yourself, download a self-entered health information report.",
          config.margins.left,
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
        .text(
          `Name: ${data.name}`,
          config.margins.left,
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
        .text(
          `Date of birth: ${data.dob}`,
          config.margins.left,
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
        .text(data.lastUpdated, config.margins.left, doc.y, { lineGap: 20 });
    }),
  );

  doc.moveDown(0.75);
  titleSection.end();
};

const generateDateRangeParagraph = (section, doc, data) => {
  section.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Date range: ', config.margins.left, doc.y, {
          continued: true,
        });
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          `${data.fromDate} to ${data.toDate}`,
          config.margins.left,
          doc.y,
          {
            paragraphOptions: { lineGap: 20 },
            continued: false,
          },
        );
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
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  generateDateRangeParagraph(infoSection, doc, data);

  const listOptions = {
    lineGap: -2,
    paragraphGap: 6,
    listType: 'bullet',
    bulletRadius: 2,
    bulletIndent: config.margins.left,
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
      x: config.margins.left,
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
          config.margins.left,
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
    bulletIndent: config.margins.left,
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
          config.margins.left,
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
  addHorizontalRule(doc, config.margins.left, 1.5, 1.5);

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
    x: config.margins.left,
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
  } else doc.moveDown(0.75);
  introduction.end();
};

const generateRecordTitle = (doc, parent, record) => {
  const title = doc.struct('Sect', {
    title: `Header`,
  });
  parent.add(title);

  const headOptions = { x: config.margins.left, paragraphGap: 0 };
  title.add(createHeading(doc, 'H3', config, record.title, headOptions));

  if (record.titleMoveDownAmount) doc.moveDown(record.titleMoveDownAmount);
  else doc.moveDown(0.75);
  title.end();
};

const generateDetailsContentSets = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);

  for (const detail of data.details) {
    if (detail.header) {
      const headOptions = { x: config.indents.one, paragraphGap: 12 };
      details.add(createHeading(doc, 'H4', config, detail.header, headOptions));
    }
    const itemIndent = config.indents.one;
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
    const headOptions = { x: config.indents.one, paragraphGap: 12 };
    details.add(
      createHeading(doc, 'H4', config, data.details.header, headOptions),
    );
  }
  const itemIndent = config.indents.one;
  for (const item of data.details.items) {
    const structs = await createDetailItem(
      doc,
      config,
      item.indent ?? itemIndent,
      item,
    );
    for (const struct of structs) {
      details.add(struct);
    }
  }
  doc.moveDown();
  details.end();
};

const generateResultItemContent = async (item, doc, results) => {
  const headingOptions = {
    paragraphGap: item.headerGap ?? 10,
    x: item.headerIndent || config.indents.one,
  };
  if (item.header) {
    results.add(
      await createHeading(
        doc,
        item.headerType || 'H3',
        config,
        item.header,
        headingOptions,
      ),
    );
  }

  for (const resultItem of item.items) {
    let indent = config.indents.one;
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

  doc.moveDown(1);
};

export const generateResultsContent = async (doc, parent, data) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = {
      paragraphGap: 12,
      x: data.results.headerIndent || config.indents.one,
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
      x: data.results.prefaceIndent || config.indents.one,
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

  if (data.results.items.length === 1) {
    await generateResultItemContent(data.results.items[0], doc, results);
  } else {
    for (const item of data.results.items) {
      await generateResultItemContent(item, doc, results);
    }
  }
  doc.moveDown();
  results.end();
};

const generate = async data => {
  validate(data);
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

    if (doc.y > doc.page.height - doc.page.margins.bottom) {
      await doc.addPage();
    }
    addHorizontalRule(doc, config.margins.left, 1.5, 1.5);
  }

  doc.font(config.text.font).fontSize(config.text.size);
  await generateFinalHeaderContent(doc, data, config);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
