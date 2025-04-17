/**
 * Blue Button PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import { capitalize } from 'lodash';
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
    left: 30,
    right: 30,
  },
  indents: {
    one: 45,
    two: 60,
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
  headerGap: 2.5,
};

const selfEnteredTypes = {
  ACTIVITY_JOURNAL: 'activity journal',
  ALLERGIES: 'allergies',
  DEMOGRAPHICS: 'demographics',
  FAMILY_HISTORY: 'family health history',
  FOOD_JOURNAL: 'food journal',
  // GOALS: 'goals', // dont have this
  HEALTH_PROVIDERS: 'healthcare providers',
  HEALTH_INSURANCE: 'health insurance',
  TEST_ENTRIES: 'lab and test results',
  MEDICAL_EVENTS: 'medical events',
  MEDICATIONS: 'medications and supplements',
  MILITARY_HISTORY: 'military health history',
  TREATMENT_FACILITIES: 'treatment facilities',
  VACCINES: 'vaccines',
  VITALS: 'vitals and readings',
};

const generateTitleSection = (doc, parent, data) => {
  const titleSection = doc.struct('Sect', {
    title: 'Introduction',
  });
  parent.add(titleSection);
  titleSection.add(
    createHeading(doc, 'H1', config, 'Self-entered health information report', {
      x: config.margins.left,
      paragraphGap: 16,
    }),
  );
  const subTitleOptions = { lineGap: 3 };

  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          "This report includes health information you entered yourself in My HealtheVet. Your VA health care team can't access this self-entered information. To share this information with your care team, print this report and bring it to your next appointment.",
          config.margins.left,
          doc.y,
          { ...subTitleOptions, paragraphGap: 12 },
        );
    }),
  );
  titleSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          'If you want to add or edit self-entered health information, go to www.myhealth.va.gov',
          config.margins.left,
          doc.y,
          { ...subTitleOptions, paragraphGap: 12 },
        );
    }),
  );
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
        .text(
          `Last updated: ${data.lastUpdated}`,
          config.margins.left,
          doc.y,
          subTitleOptions,
        );
    }),
  );

  doc.moveDown(0.75);
  titleSection.end();
};

const generateContentsSection = (doc, parent, data) => {
  const infoSection = doc.struct('Sect', {
    title: 'Information',
  });
  const missingRecordSets = Object.values(selfEnteredTypes).filter(
    type => !data.recordSets.find(set => set.type === type),
  );
  const listOptions = {
    lineGap: -2,
    paragraphGap: 6,
    listType: 'bullet',
    bulletRadius: 2,
    bulletIndent: config.margins.left,
    x: 6,
  };

  if (data.recordSets.length === 0) {
    infoSection.add(
      createHeading(
        doc,
        'H2',
        config,
        "You don't have any self-entered health information",
        { x: config.margins.left, paragraphGap: 12 },
      ),
    );
    parent.add(infoSection);
    infoSection.add(
      doc.struct('P', () => {
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .text(
            'If you want to add or edit self-entered health information, go to www.myhealth.va.gov',
            config.margins.left,
            doc.y,
            { paragraphGap: 10 },
          );
      }),
    );
  } else {
    infoSection.add(
      createHeading(
        doc,
        'H2',
        config,
        'Types of self-entered information in this report',
        { x: config.margins.left, paragraphGap: 12 },
      ),
    );
    parent.add(infoSection);
    infoSection.add(
      doc.struct('List', () => {
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .list(
            data.recordSets.map(item => capitalize(item.type)),
            listOptions,
          );
      }),
    );
    doc.moveDown(0.75);

    if (missingRecordSets.length) {
      infoSection.add(
        createHeading(
          doc,
          'H2',
          config,
          "Types of information you haven't entered yet",
          { x: config.margins.left, paragraphGap: 12 },
        ),
      );
      infoSection.add(
        doc.struct('List', () => {
          doc
            .font(config.text.font)
            .fontSize(config.text.size)
            .list(
              missingRecordSets.map(type => capitalize(type)),
              listOptions,
            );
        }),
      );
      doc.moveDown(0.75);
    }
  }

  infoSection.end();
};

const generateCoverPage = async (doc, parent, data) => {
  await generateTitleSection(doc, parent, data);
  await generateContentsSection(doc, parent, data);
  addHorizontalRule(doc, config.margins.left, 0.5, 0);
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
  } else doc.moveDown(0.5);
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
  else doc.moveDown(0.5);
  title.end();
};

const generateDetailsContentSets = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);

  for (const detail of data.details) {
    if (detail.header) {
      const headOptions = { x: config.indents.one, paragraphGap: 6 };
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
    doc.moveDown(data.moveDown ?? 0.5);
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
  const itemIndent = data.details.header
    ? config.indents.two
    : config.indents.one;
  for (const item of data.details.items) {
    const structs = await createDetailItem(doc, config, itemIndent, item);
    for (const struct of structs) {
      details.add(struct);
    }
  }
  doc.moveDown(0.5);
  details.end();
};

const generateResultItemContent = async (item, doc, results, hasH2) => {
  const headingOptions = {
    paragraphGap: item.headerGap ?? 10,
    x: item.headerIndent ?? config.margins.one,
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
    let indent = config.indents.one;
    if (!hasH2) indent = config.margins.left;
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
      x: data.results.headerIndent || config.margins.left,
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
      x: data.results.prefaceIndent || config.margins.left,
    };
    results.add(
      createSubHeading(doc, config, data.results.preface, prefaceOptions),
    );
  }

  const hasH2 = !!data.results.header;
  if (data.results.items.length === 1) {
    await generateResultItemContent(data.results.items[0], doc, results, hasH2);
  } else {
    for (const item of data.results.items) {
      await generateResultItemContent(item, doc, results, hasH2);
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
  generateInitialHeaderContent(doc, wrapper, data, config);
  await generateCoverPage(doc, wrapper, data);

  for (const recordSet of data.recordSets) {
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
