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
  addHorizontalRule,
  createDetailItem,
  createRichTextDetailItem,
  createHeading,
  createSubHeading,
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFinalHeaderContent,
  generateFooterContent,
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
    boldFont: 'SourceSansPro-Bold',
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
    data.preface.forEach(element => {
      introduction.add(
        createSubHeading(doc, config, element.value, {
          x: 16,
          paragraphGap: 6,
          ...(element.weight === 'bold' && {
            font: config.subHeading.boldFont,
          }),
          ...(element.continued && { continued: true }),
        }),
      );
    });
  }

  doc.moveDown(0.5);
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
    if (section.header) {
      results.add(
        await createHeading(doc, 'H4', config, section.header, {
          paragraphGap: 10,
          x: 16,
        }),
      );
    }

    // medication section items
    for (const resultItem of section.items) {
      let structs;
      // rich text item
      if (resultItem.isRich) {
        structs = await createRichTextDetailItem(doc, config, 32, resultItem);
        // regular item
      } else {
        structs = await createDetailItem(doc, config, 32, resultItem);
      }

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
    // if horizontal line won't fit - move to the next page
    if (doc.y > doc.page.height - doc.page.margins.bottom) await doc.addPage();
    addHorizontalRule(doc, 16, 0, 1);
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
    for (const listItem of resultItem.list) {
      const hasHorizontalRule = listItem.sectionSeparators !== false;
      await generateResultsMedicationListContent(
        listItem,
        doc,
        results,
        hasHorizontalRule,
      );
    }

    results.end();
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

  await generateInitialHeaderContent(doc, wrapper, data, config);

  await generateIntroductionContent(doc, wrapper, data);

  if (data.results && data.results.length) {
    await generateResultsContent(doc, wrapper, data);
  }

  await generateFinalHeaderContent(doc, wrapper, data, config);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
