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
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFinalHeaderContent,
  generateFooterContent,
  createRichTextDetailItem,
} from './utils';

const defaultConfig = {
  margins: {
    top: 40,
    bottom: 40,
    left: 30,
    right: 30,
  },
  indents: {
    one: 45,
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
  const headOptions = { x: config.margins.left, paragraphGap: 6 };
  const subHeadOptions = { paragraphGap: 6, font: config.text.font };

  const introduction = doc.struct('Sect', {
    title: 'Introduction',
  });
  parent.add(introduction);
  introduction.add(createHeading(doc, 'H1', config, data.title, headOptions));
  doc.moveDown(0.25);

  if (data.subtitles) {
    for (const subtitle of data.subtitles) {
      introduction.add(createSubHeading(doc, config, subtitle, subHeadOptions));
      doc.moveDown(0.75);
    }
  }

  introduction.end();
};

const generateDetailsContent = async (doc, parent, data, config) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);
  if (data.details.header) {
    const headOptions = { x: config.margins.left, paragraphGap: 12 };
    details.add(
      createHeading(doc, 'H2', config, data.details.header, headOptions),
    );
  }
  const itemIndent = data.details.header
    ? config.indents.one
    : config.margins.left;
  for (const item of data.details.items) {
    const structs = await createDetailItem(doc, config, itemIndent, item);
    for (const struct of structs) {
      details.add(struct);
    }
  }
  doc.moveDown();
  details.end();
};

const generateResultItemContent = async (item, doc, results, config) => {
  const headingOptions = { x: config.margins.left, paragraphGap: 10 };
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
    let structs;

    if (resultItem.isRich) {
      structs = await createRichTextDetailItem(
        doc,
        config,
        config.indents.one,
        resultItem,
      );
    } else {
      structs = await createDetailItem(
        doc,
        config,
        config.indents.one,
        resultItem,
      );
    }

    for (const struct of structs) {
      results.add(struct);
    }
  }

  if (doc.y > doc.page.height - doc.page.margins.bottom) {
    await doc.addPage();
  }
  addHorizontalRule(doc, config.margins.left, 1.5, 1.5);
};

const generateResultsContent = async (doc, parent, data, config) => {
  const results = doc.struct('Sect', {
    title: 'Results',
  });
  parent.add(results);
  if (data.results.header) {
    const headingOptions = { x: config.margins.left, paragraphGap: 12 };
    results.add(
      createHeading(doc, 'H2', config, data.results.header, headingOptions),
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
    await generateResultItemContent(
      data.results.items[0],
      doc,
      results,
      config,
    );
  } else {
    for (const item of data.results.items) {
      await generateResultItemContent(item, doc, results, config);
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
