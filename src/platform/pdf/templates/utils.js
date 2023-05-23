/**
 * Template utils.
 */
import { unset } from 'lodash';
import registerFonts from '../registerFonts';

const pdfkit = require('pdfkit');

// Handle both node and browser environments.
const PDFDocument = pdfkit.default ?? pdfkit;

/**
 * Add a structure to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} struct
 * @param {string} font
 * @param {int} fontSize
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createStruct = (doc, struct, font, fontSize, text, options) => {
  const x = options.x ?? doc.x;
  const y = options.y ?? doc.y;
  unset(options.x);
  unset(options.y);
  return doc.struct(struct, () => {
    doc
      .font(font)
      .fontSize(fontSize)
      .text(text, x, y, options);
  });
};

/**
 * Add a horizontal rule to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {int} spaceFromEdge How far the right and left sides should be away from the edge (in px)
 * @param {int} linesAboveAndBelow How much space should be above and below the HR (in lines)
 *
 * @returns {Object}
 */
const addHorizontalRule = (
  doc,
  spaceFromEdge = 0,
  linesAboveAndBelow = 0.5,
) => {
  doc.moveDown(linesAboveAndBelow);

  // TODO add alternative text.
  doc.markContent('Artifact', { type: 'Layout' });
  doc
    .moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesAboveAndBelow);
  return doc;
};

/**
 * Add a details item to the given PDFKit structure element.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {int} Y position
 * @param {Object} item
 *
 * @returns {Object} doc
 */
const createDetailItem = (doc, config, x, y, item) => {
  const paragraphOptions = { lineGap: 0 };
  let titleText = item.title;
  if (item.inline === true) {
    paragraphOptions.continued = true;
    titleText += ': ';
  } else {
    titleText += ' ';
  }
  return doc.struct('P', () => {
    doc
      .font(config.text.boldFont)
      .fontSize(config.text.fontSize)
      .text(titleText, x, y, paragraphOptions);
    doc
      .font(config.text.font)
      .fontSize(config.text.fontSize)
      .text(item.value);
  });
};

/**
 * Add a heading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} headingLevel
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createHeading = (doc, headingLevel, config, text, options) => {
  return createStruct(
    doc,
    headingLevel,
    config.headings[headingLevel].font,
    config.headings[headingLevel].size,
    text,
    options,
  );
};

/**
 * Add a span struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSpan = (doc, config, text, options) => {
  return createStruct(
    doc,
    'Span',
    config.text.font,
    config.text.size,
    text,
    options,
  );
};

/**
 * Add a subHeading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSubHeading = (doc, config, text, options) => {
  return createStruct(
    doc,
    'P',
    config.subHeading.font,
    config.subHeading.size,
    text,
    options,
  );
};

/**
 * Estimate a text block's height.
 *
 * @param {Object} doc
 * @param {Object} item
 * @param {boolean} initialBlock Whether or not this is the first block in the list.
 *
 * @returns {int}
 */
const getTestResultBlockHeight = (doc, item, initialBlock = false) => {
  let height = 0;

  // Account for height of horizontal rule.
  if (!initialBlock) {
    height += 16;
  }

  if (item.header) {
    height += 36;
  }

  item.items.forEach(resultItem => {
    // This is a gross hack that's necessary because the heightOfString doesn't always
    // return the correct height. See e.g. https://github.com/foliojs/pdfkit/issues/1438
    // TODO: account for longer lines.
    height += 24;
    if (resultItem.inline === false) {
      height += 24;
    }
    /**
     * Potential improved solution if issues with heightOfString are fixed:
     * 
    if (resultItem.inline === true) {
      height += doc.heightOfString(`${resultItem.title}: ${resultItem.value}`, 44, 0, {
        // Using regular weight is a bit of a fudge but should be
        // more accurate than using bold for the whole string.
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    } else {
      height += doc.heightOfString(`${resultItem.title}`, 44, 0, {
        font: 'SourceSansPro-Bold',
        fontSize: 16,
        lineGap: 0,
      });
      height += doc.heightOfString(resultItem.value, 44, 0, {
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    }
    */
  });

  return height;
};

/**
 * Create a PDFKit document with the correct parameters set for accessibility.
 *
 * @param {string} title
 *
 * @returns {Object}
 */
const createAccessibleDoc = title => {
  return new PDFDocument({
    pdfVersion: '1.7',
    lang: 'en-US',
    tagged: true,
    displayTitle: true,
    info: {
      Title: title,
    },
    autoFirstPage: false,
    bufferPages: true,
  });
};

/**
 * Register the custom fonts used for VA.gov to the given PDFKit document.
 *
 * @param {Object} doc
 *
 * @returns {void}
 */
const registerVaGovFonts = async doc => {
  await registerFonts(doc, [
    'Bitter-Bold',
    'Bitter-Regular',
    'SourceSansPro-Bold',
    'SourceSansPro-Regular',
  ]);
};

export {
  addHorizontalRule,
  createAccessibleDoc,
  createDetailItem,
  createHeading,
  createSpan,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
};
