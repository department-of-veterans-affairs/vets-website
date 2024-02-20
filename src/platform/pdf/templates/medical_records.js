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
  addHorizontalRule,
  createDetailItem,
  createHeading,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFinalHeaderContent,
  generateFooterContent,
} from './utils';

const defaultConfig = {
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
    monospaceFont: 'RobotoMono-Regular',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

const generateIntroductionContent = async (doc, parent, data, config) => {
  const headOptions = { x: 20, paragraphGap: 5 };
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

const generateDetailsContent = async (doc, parent, data, config) => {
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

const generateResultItemContent = async (
  item,
  doc,
  results,
  hasHorizontalRule,
  config,
) => {
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

  if (hasHorizontalRule) {
    addHorizontalRule(doc, 30, 1.5, 1.5);
  }
};

const generateResultsContent = async (doc, parent, data, config) => {
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

  const hasHorizontalRule = data.results.sectionSeparators !== false;
  if (data.results.items.length === 1) {
    await generateResultItemContent(
      data.results.items[0],
      doc,
      results,
      hasHorizontalRule,
      config,
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
        config,
      );
    }
  }
  results.end();
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

const generate = async (data, config = defaultConfig) => {
  validate(data);

  const doc = createAccessibleDoc(data, config);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  await generateInitialHeaderContent(doc, wrapper, data, config);

  await generateIntroductionContent(doc, wrapper, data, config);

  if (data.details) {
    await generateDetailsContent(doc, wrapper, data, config);
  }

  if (data.results) {
    await generateResultsContent(doc, wrapper, data, config);
  }

  await generateFinalHeaderContent(doc, data, config);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
