/**
 * DOD military service information PDF template.
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
  registerVaGovFonts,
  generateFinalHeaderContent,
  generateFooterContent,
  generateInitialHeaderContent,
} from './utils';

const config = {
  margins: {
    top: 40,
    bottom: 40,
    left: 16,
    right: 16,
  },
  headings: {
    H1: {
      font: 'Bitter-Bold',
      size: 30,
    },
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    monospaceFont: 'RobotoMono-Regular',
    font: 'SourceSansPro-Regular',
    size: 12,
  },
  headerGap: 2.25,
};

const generateTitleSection = (doc, parent) => {
  const titleSection = doc.struct('Sect', {
    title: 'Title',
  });
  titleSection.add(
    createHeading(doc, 'H1', config, 'DOD military service information', {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );
  parent.add(titleSection);

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

  titleSection.end();
};

const validate = data => {
  const requiredFields = ['details'];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length) {
    throw new MissingFieldsException(missingFields);
  }
};

const generateDetailsContent = async (doc, parent, data) => {
  const details = doc.struct('Sect', {
    title: 'Details',
  });
  parent.add(details);

  const structs = await createDetailItem(doc, config, data.indent, data);
  for (const struct of structs) {
    details.add(struct);
  }

  doc.moveDown();
  details.end();
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

  await generateTitleSection(doc, wrapper);

  await generateDetailsContent(doc, wrapper, data.details);

  if (doc.y > doc.page.height - doc.page.margins.bottom) {
    await doc.addPage();
  }
  addHorizontalRule(doc, config.margins.left, 1.5, 1.5);

  doc.font(config.text.font).fontSize(config.text.size);
  await generateFinalHeaderContent(doc, data, config);
  await generateFooterContent(doc, wrapper, data, config);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
