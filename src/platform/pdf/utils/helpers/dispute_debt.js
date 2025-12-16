import { createHeading } from '../../templates/utils';

/** Creates a labeled field with gray label and black value * */
export const createLabeledField = (doc, config, label, value, options = {}) => {
  const { lineGapLabel = 5, lineGapValue = 10 } = options;

  return doc.struct('P', () => {
    doc
      .font(config.text.font)
      .fontSize(config.text.size)
      .fillColor(config.text.labelColor)
      .text(label, { lineGap: lineGapLabel });
    doc
      .font(config.text.font)
      .fillColor(config.text.valueColor)
      .text(value || '', { lineGap: lineGapValue });
  });
};

/** Adds a labeled field to a section * */
export const addLabeledField = (
  section,
  doc,
  config,
  label,
  value,
  options = {},
) => {
  section.add(createLabeledField(doc, config, label, value, options));
};

/** Creates a section with heading and labeled fields * */
export const createFieldSection = (doc, wrapper, config, title, fields) => {
  const section = doc.struct('Sect', { title });

  section.add(
    createHeading(doc, 'H3', config, title, {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  fields.forEach(({ label, value, options = {} }) => {
    // Skip labels with empty values like suffix which is often
    if (!value || (typeof value === 'string' && !value.trim())) return;
    addLabeledField(section, doc, config, label, value, options);
    if (options.moveDown !== false) doc.moveDown();
  });

  section.end();
  wrapper.add(section);
  doc.moveDown();
};

/** Adds a clickable phone number */
export const addPhone = (doc, phone) => {
  doc
    .fillColor('#0071BC')
    .text(phone.number, {
      link: `tel:${phone.tel}`,
      underline: true,
      continued: true,
    })
    .fillColor('#000000');
};

/** Adds a clickable TTY number */
export const addTTY = (doc, tty) => {
  doc
    .text(' (', { underline: false, continued: true })
    .fillColor('#0071BC')
    .text(`TTY: ${tty.number}`, {
      link: `tel:${tty.tel}`,
      underline: true,
      continued: true,
    })
    .fillColor('#000000')
    .text(')', { link: null, underline: false, continued: true });
};

/** Adds a web link */
export const addWebLink = (doc, text, url) => {
  doc
    .fillColor('#0071BC')
    .text(text, { link: url, underline: true })
    .fillColor('#000000')
    .text('', { link: null });
};

/** Draws a horizontal line */
export const drawHorizontalLine = (
  doc,
  config,
  color = '#005EA2',
  width = 2,
) => {
  doc
    .moveTo(config.margins.left, doc.y)
    .lineTo(doc.page.width - config.margins.right, doc.y)
    .lineWidth(width)
    .strokeColor(color)
    .stroke();
};

/** Draws a numbered circle */
export const drawNumberedCircle = (doc, config, number, y) => {
  const circleRadius = 10;
  const circleIndent = 15;
  const circleX = config.margins.left + circleRadius + circleIndent;
  const circleCenterY = y + circleRadius;
  doc
    .circle(circleX, circleCenterY, circleRadius)
    .lineWidth(2)
    .strokeColor('#000000')
    .stroke();
  doc
    .font(config.text.boldFont)
    .fontSize(config.text.size)
    .fillColor('#000000')
    .text(number, circleX - 3, circleCenterY - 8);
  return { circleX, circleCenterY, circleRadius };
};

/** Draws a vertical connecting line between steps */
export const drawVerticalLine = (doc, circleX, startY, endY) => {
  doc
    .moveTo(circleX, startY)
    .lineTo(circleX, endY + 15)
    .lineWidth(4)
    .strokeColor('#D9E8F6')
    .stroke();
};
