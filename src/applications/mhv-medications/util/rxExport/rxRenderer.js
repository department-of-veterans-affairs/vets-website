/**
 * Prescription Renderers - Format-specific output generation
 *
 * Transforms normalized prescription data into PDF and TXT formats.
 * Works with data from rxMapper.js.
 */
import { formatList, FIELD_NOT_AVAILABLE } from './formatters';
import {
  ACTIVE_NON_VA,
  NON_VA_MEDICATION_DESCRIPTION,
  TXT_SEPARATOR,
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_DESCRIPTION,
  ALLERGIES_EMPTY_MESSAGE,
  ALLERGIES_ERROR_MESSAGE,
  getAllergiesCountText,
} from './staticContent';
import { createNoDescriptionText, createVAPharmacyText } from '../helpers';
import {
  mapNonVAPrescription,
  mapVAPrescriptionForList,
  mapVAPrescriptionForDetail,
  mapPrescriptionList,
  mapAllergy,
  mapAllergies,
} from './rxMapper';

// ============================================================================
// TXT Helpers
// ============================================================================

const newLine = (n = 1) => '\n'.repeat(n);

const joinLines = (...lines) => lines.filter(Boolean).join(newLine(2));

const joinBlocks = (...blocks) =>
  blocks
    .filter(Boolean)
    .map(b => b.trimEnd())
    .join(newLine(2)) + newLine();

// ============================================================================
// PDF Field Renderer
// ============================================================================

/**
 * Render a normalized field to PDF format
 * @param {Object} field - Normalized field object
 * @returns {Object|null} PDF field object
 */
const fieldToPdf = (field, options = {}) => {
  if (!field || field.pdfOnly === false) return null;

  const { indent } = options;

  if (field.type === 'rich') {
    return {
      isRich: true,
      value: field.value,
      ...(indent && { indent }),
    };
  }

  if (field.type === 'description') {
    return {
      value: field.value,
      ...(indent && { indent }),
    };
  }

  if (field.type === 'list') {
    return {
      title: field.label,
      value: formatList(field.value, FIELD_NOT_AVAILABLE),
      inline: true,
      ...(indent && { indent }),
    };
  }

  return {
    title: field.label,
    value: field.value,
    inline: true,
    ...(indent && { indent }),
  };
};

/**
 * Render array of fields to PDF format
 * @param {Array} fields - Array of normalized fields
 * @param {Object} options - Rendering options
 * @returns {Array} Array of PDF field objects
 */
export const fieldsToPdf = (fields, options = {}) =>
  fields.map(f => fieldToPdf(f, options)).filter(Boolean);

// ============================================================================
// TXT Field Renderer
// ============================================================================

/**
 * Render a normalized field to TXT format
 * @param {Object} field - Normalized field object
 * @returns {string|null} TXT field line
 */
const fieldToTxt = field => {
  if (!field || field.pdfOnly) return null;

  if (field.type === 'description') {
    return field.value;
  }

  if (field.type === 'list') {
    return `${field.label}: ${formatList(field.value, FIELD_NOT_AVAILABLE)}`;
  }

  // Use txtValue if available (for status fields that differ between formats)
  const value = field.txtValue !== undefined ? field.txtValue : field.value;
  return `${field.label}: ${value}`;
};

/**
 * Render array of fields to TXT format
 * @param {Array} fields - Array of normalized fields
 * @returns {string} TXT content
 */
export const fieldsToTxt = fields =>
  fields
    .map(fieldToTxt)
    .filter(Boolean)
    .join(newLine(2));

// ============================================================================
// Non-VA Prescription Renderers
// ============================================================================

/**
 * Render Non-VA prescription to PDF format
 * @param {Object} data - Normalized Non-VA prescription data
 * @returns {Object} PDF config
 */
export const renderNonVAPrescriptionPdf = data => ({
  header: data.name,
  sections: [
    {
      items: fieldsToPdf(data.fields),
    },
  ],
});

/**
 * Render Non-VA prescription to TXT format
 * @param {Object} data - Normalized Non-VA prescription data
 * @param {Object} options - Rendering options
 * @returns {string} TXT content
 */
export const renderNonVAPrescriptionTxt = (data, options = {}) => {
  const { includeSeparators = true } = options;
  const header = includeSeparators
    ? `${newLine()}${TXT_SEPARATOR}${newLine(3)}`
    : '';

  // Special handling for Non-VA TXT format
  const instructionsField = data.fields.find(f => f.label === 'Instructions');
  const reasonField = data.fields.find(f => f.label === 'Reason for use');
  const statusField = data.fields.find(f => f.label === 'Status');
  const startedField = data.fields.find(
    f => f.label === 'When you started taking this medication',
  );
  const documentedByField = data.fields.find(f => f.label === 'Documented by');
  const facilityField = data.fields.find(
    f => f.label === 'Documented at this facility',
  );

  const body = joinBlocks(
    data.name,
    joinLines(
      instructionsField && `Instructions: ${instructionsField.value}`,
      reasonField && `Reason for use: ${reasonField.value}`,
      statusField &&
        `Status: ${ACTIVE_NON_VA}${newLine()}${NON_VA_MEDICATION_DESCRIPTION}`,
    ),
    joinLines(
      startedField &&
        `When you started taking this medication: ${startedField.value}`,
      documentedByField && `Documented by: ${documentedByField.value}`,
      facilityField &&
        `Documented at this facility: ${facilityField.value}`,
    ),
  );

  return `${header}${body}${newLine()}`;
};

// ============================================================================
// VA Prescription List Renderers
// ============================================================================

/**
 * Render VA prescription (list view) to PDF format
 * @param {Object} data - Normalized VA prescription data
 * @returns {Object} PDF config
 */
export const renderVAPrescriptionListPdf = data => ({
  header: data.name,
  sections: [
    {
      items: fieldsToPdf(data.fields),
    },
  ],
});

/**
 * Render VA prescription (list view) to TXT format
 * @param {Object} data - Normalized VA prescription data
 * @returns {string} TXT content
 */
export const renderVAPrescriptionListTxt = data => {
  // Filter out PDF-only fields and format for TXT
  const txtFields = data.fields.filter(f => !f.pdfOnly);
  return joinBlocks(data.name, fieldsToTxt(txtFields)).trimEnd();
};

// ============================================================================
// Prescription List Renderers
// ============================================================================

/**
 * Render prescription list to PDF format
 * @param {Array} prescriptions - Array of normalized prescription data
 * @returns {Array} Array of PDF configs
 */
export const renderPrescriptionListPdf = prescriptions =>
  prescriptions.map(rx => {
    if (rx.type === 'non-va') {
      return renderNonVAPrescriptionPdf(rx);
    }
    return renderVAPrescriptionListPdf(rx);
  });

/**
 * Render prescription list to TXT format
 * @param {Array} prescriptions - Array of normalized prescription data
 * @returns {string} TXT content
 */
export const renderPrescriptionListTxt = prescriptions => {
  const header = `${newLine()}${TXT_SEPARATOR}${newLine(3)}`;

  const body = prescriptions.map(rx => {
    if (rx.type === 'non-va') {
      return renderNonVAPrescriptionTxt(rx, { includeSeparators: false }).trimEnd();
    }
    return renderVAPrescriptionListTxt(rx);
  });

  return `${header}${body.join(newLine(3))}${newLine(2)}`;
};

// ============================================================================
// VA Prescription Detail Renderers
// ============================================================================

/**
 * Render medication description for PDF
 */
const renderMedDescriptionPdf = (desc, isCernerPilot) => {
  if (isCernerPilot) return [];

  if (desc.noDescription) {
    return [
      {
        title: 'Medication description',
        inline: false,
        indent: 32,
      },
      {
        value: createNoDescriptionText(desc.phone),
        indent: 32,
      },
    ];
  }

  return [
    {
      title: 'Medication description',
      inline: false,
      indent: 32,
    },
    {
      title: 'Note',
      value: `If the medication you're taking doesn't match this description, \
call ${createVAPharmacyText(desc.phone)}.`,
      inline: true,
      indent: 32,
    },
    {
      value: `* Shape: ${desc.shape}
* Color: ${desc.color}
* Front marking: ${desc.frontImprint}
${desc.backImprint ? `* Back marking: ${desc.backImprint}` : ''}`,
      indent: 32,
    },
  ];
};

/**
 * Render refill history item for PDF
 */
const renderRefillHistoryItemPdf = item => ({
  header: `${item.label}: ${item.date}`,
  indent: 32,
  headerSize: 'H5',
  items: [
    ...(item.isPartialFill
      ? [
          {
            value: 'This fill has a smaller quantity on purpose.',
            indent: 32,
          },
          {
            title: 'Quantity',
            inline: true,
            value: item.quantity,
            indent: 32,
          },
        ]
      : []),
    ...(item.shippedOn
      ? [
          {
            title: 'Shipped on',
            value: item.shippedOn,
            inline: true,
            indent: 32,
          },
        ]
      : []),
    ...(item.description ? renderMedDescriptionPdf(item.description, false) : []),
  ],
});

/**
 * Render VA prescription detail to PDF format
 * @param {Object} data - Normalized VA prescription detail data
 * @returns {Array} Array of PDF section configs
 */
export const renderVAPrescriptionDetailPdf = data => {
  const sections = [];

  // Main prescription section
  sections.push({
    header: data.sections.main.header,
    sections: [
      {
        items: fieldsToPdf(data.sections.main.fields),
      },
    ],
  });

  // Refill history section
  if (data.sections.refillHistory) {
    const { count, items } = data.sections.refillHistory;
    sections.push({
      header: 'Refill history',
      indent: 32,
      headerSize: 'H4',
      sections: [
        {
          items: [
            {
              value: `Showing ${count} fill${
                count > 1 ? 's, from newest to oldest' : ''
              }`,
              indent: 32,
            },
          ],
        },
        ...items.map(renderRefillHistoryItemPdf).flat(),
      ],
    });
  }

  // Previous prescriptions section
  if (data.sections.previousPrescriptions) {
    const { count, items } = data.sections.previousPrescriptions;
    sections.push({
      header: 'Previous prescriptions',
      headerSize: 'H3',
      sections: [
        {
          items: [
            {
              value: `Showing ${count} prescription${
                count > 1 ? 's, from newest to oldest' : ''
              }`,
              indent: 32,
            },
          ],
        },
        ...items.map(prevRx => ({
          header: `Prescription number: ${prevRx.prescriptionNumber}`,
          indent: 32,
          items: [
            {
              title: 'Last filled',
              value: prevRx.lastFilled,
              inline: true,
              indent: 32,
            },
            {
              title: 'Quantity',
              value: prevRx.quantity,
              inline: true,
              indent: 32,
            },
            {
              title: 'Prescribed on',
              value: prevRx.prescribedOn,
              inline: true,
              indent: 32,
            },
            {
              title: 'Prescribed by',
              value: prevRx.prescribedBy,
              inline: true,
              indent: 32,
            },
          ],
        })),
      ],
    });
  }

  return sections;
};

/**
 * Render medication description for TXT
 */
const renderMedDescriptionTxt = desc => {
  if (desc.noDescription) {
    return createNoDescriptionText(desc.phone);
  }

  return `${newLine()}Note: If the medication you're taking doesn't match \
this description, call ${createVAPharmacyText(desc.phone)}
* Shape: ${desc.shape}
* Color: ${desc.color}
* Front marking: ${desc.frontImprint}
${desc.backImprint ? `* Back marking: ${desc.backImprint}` : ''}${newLine()}`;
};

/**
 * Render VA prescription detail to TXT format
 * @param {Object} data - Normalized VA prescription detail data
 * @returns {string} TXT content
 */
export const renderVAPrescriptionDetailTxt = data => {
  const header = `${newLine()}${TXT_SEPARATOR}${newLine(3)}`;

  // Main section
  const mainFields = data.sections.main.fields.filter(f => !f.pdfOnly);
  const mostRecentSection = joinLines(
    `${data.name}${newLine()}`,
    `${data.sections.main.header}${newLine()}`,
    fieldsToTxt(mainFields),
  ).trimEnd();

  // Refill history section
  let refillHistorySection = '';
  if (data.sections.refillHistory) {
    const { count, items } = data.sections.refillHistory;
    const refillHeader = joinLines(
      'Refill history',
      `Showing ${count} fill${count > 1 ? 's, from newest to oldest' : ''}`,
    ).trimEnd();

    const refillRecords = items
      .map(item => {
        return joinBlocks(
          `${item.label}: ${item.date}`,
          item.isPartialFill
            ? joinLines(
                'This fill has a smaller quantity on purpose.',
                `Quantity: ${item.quantity}`,
              )
            : '',
          item.shippedOn ? `Shipped on: ${item.shippedOn}` : '',
          item.description
            ? `Medication description: ${renderMedDescriptionTxt(item.description)}`
            : '',
        );
      })
      .join(newLine(2));

    refillHistorySection = `${refillHeader}${newLine(3)}${refillRecords}`;
  }

  // Previous prescriptions section
  let previousRxSection = '';
  if (data.sections.previousPrescriptions) {
    const { count, items } = data.sections.previousPrescriptions;
    const previousHeader = joinBlocks(
      newLine(),
      'Previous prescriptions',
      `Showing ${count} prescription${count > 1 ? 's, from newest to oldest' : ''}`,
    ).trimEnd();

    const previousRxs = items
      .map(prevRx =>
        joinBlocks(
          `Prescription number: ${prevRx.prescriptionNumber}`,
          `Last filled: ${prevRx.lastFilled}`,
          `Quantity: ${prevRx.quantity}`,
          `Prescribed on: ${prevRx.prescribedOn}`,
          `Prescribed by: ${prevRx.prescribedBy}`,
        ).trimEnd(),
      )
      .join(newLine(3));

    previousRxSection = joinBlocks(previousHeader, previousRxs);
  }

  return `${header}${mostRecentSection}${newLine(3)}${refillHistorySection}${previousRxSection}${newLine()}`;
};

// ============================================================================
// Allergy Renderers
// ============================================================================

/**
 * Render allergy to PDF format
 * @param {Object} data - Normalized allergy data
 * @returns {Object} PDF config
 */
export const renderAllergyPdf = data => ({
  header: data.name,
  sections: [
    {
      items: fieldsToPdf(data.fields),
    },
  ],
});

/**
 * Render allergies list to PDF section
 * @param {Object} allergiesData - Normalized allergies data
 * @returns {Object} PDF section config
 */
export const renderAllergiesPdfSection = allergiesData => {
  const section = {
    header: ALLERGIES_SECTION_HEADER,
    list: [],
    preface: null,
  };

  if (allergiesData.state === 'error') {
    section.preface = [{ value: ALLERGIES_ERROR_MESSAGE }];
  } else if (allergiesData.state === 'empty') {
    section.preface = ALLERGIES_EMPTY_MESSAGE;
  } else {
    section.preface = [
      { value: ALLERGIES_DESCRIPTION },
      { value: getAllergiesCountText(allergiesData.count) },
    ];
    section.list = allergiesData.items.map(renderAllergyPdf);
  }

  return section;
};

/**
 * Render allergy to TXT format
 * @param {Object} data - Normalized allergy data
 * @returns {string} TXT content
 */
export const renderAllergyTxt = data => {
  const lines = [
    '',
    data.name,
    ...data.fields.map(f => {
      if (f.type === 'list') {
        return `${f.label}: ${formatList(f.value, FIELD_NOT_AVAILABLE)}`;
      }
      return `${f.label}: ${f.value}`;
    }),
  ];
  return lines.join('\n');
};

/**
 * Render allergies list to TXT section
 * @param {Object} allergiesData - Normalized allergies data
 * @returns {string} TXT content
 */
export const renderAllergiesTxtSection = allergiesData => {
  if (allergiesData.state === 'error') {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_ERROR_MESSAGE}\n`;
  }

  if (allergiesData.state === 'empty') {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_EMPTY_MESSAGE}\n`;
  }

  const header = `\n${TXT_SEPARATOR}\n\n\n`;
  const body = [
    ALLERGIES_SECTION_HEADER,
    ALLERGIES_DESCRIPTION,
    getAllergiesCountText(allergiesData.count),
  ].join('\n\n');

  const items = allergiesData.items.map(renderAllergyTxt).join('\n');
  const footer = `\n\n${TXT_SEPARATOR}\n`;

  return `${header}${body}\n${items}\n${footer}`;
};

// ============================================================================
// Medication Information Renderer (for drug monograph PDFs)
// ============================================================================

/**
 * Build medication information PDF from parsed HTML content
 * @param {Array} list - List of medication information items with type and text
 * @returns {Object} PDF config with sections
 */
export const buildMedicationInformationPDF = list => {
  const listOfHeaders = ['h2', 'h3'];
  const sections = [
    ...list
      .filter(listItem => listOfHeaders.includes(listItem.type))
      .map(listItem => {
        const object = { header: '', headerSize: 'H2', items: [] };
        object.header = listItem.text;
        const index = list.indexOf(listItem);
        const nextHeader = list
          .slice(index + 1)
          .find(i => listOfHeaders.includes(i.type));
        const nextIndex = nextHeader ? list.indexOf(nextHeader) : list.length;
        const subList = list.slice(index + 1, nextIndex);
        const isEndOfList = i => subList[i + 1]?.type !== 'li';
        let liArray = [];
        object.items = subList.flatMap((subItem, i) => {
          if (subItem.type === 'li') {
            liArray.push(subItem.text);
            if (isEndOfList(i)) {
              return {
                value: [
                  {
                    value: liArray,
                  },
                ],
                isRich: true,
                disablePageSplit: true,
              };
            }
            return [];
          }
          liArray = [];
          return [
            {
              value: subItem.text,
              disablePageSplit: true,
            },
          ];
        });
        return object;
      }),
  ];
  return {
    sections,
  };
};

// ============================================================================
// Backward-Compatible Wrappers
// ============================================================================
// These functions maintain the same API signatures as the old prescriptionBuilders
// but use the new mapper/renderer architecture internally.

/**
 * Build Non-VA prescription PDF list (backward-compatible wrapper)
 * @param {Object} prescription - Non-VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @returns {Array} PDF config items
 */
export const buildNonVAPrescriptionPDFList = (
  prescription,
  isCernerPilot = false,
) => {
  const data = mapNonVAPrescription(prescription, { isCernerPilot });
  return [renderNonVAPrescriptionPdf(data)];
};

/**
 * Build prescriptions PDF list (backward-compatible wrapper)
 * @param {Array} prescriptions - Array of prescriptions
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Array} PDF config items
 */
export const buildPrescriptionsPDFList = (
  prescriptions,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const mappedList = mapPrescriptionList(prescriptions, {
    isCernerPilot,
    isV2StatusMapping,
  });
  return renderPrescriptionListPdf(mappedList);
};

/**
 * Build VA prescription PDF list (backward-compatible wrapper)
 * @param {Object} prescription - VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {Array} PDF config items (detail view)
 */
export const buildVAPrescriptionPDFList = (
  prescription,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const data = mapVAPrescriptionForDetail(prescription, {
    isCernerPilot,
    isV2StatusMapping,
  });
  return renderVAPrescriptionDetailPdf(data);
};

/**
 * Build allergies PDF list (backward-compatible wrapper)
 * @param {Array} allergies - Array of allergies
 * @returns {Array} PDF config items
 */
export const buildAllergiesPDFList = allergies => {
  return (allergies || []).map(allergy => {
    const data = mapAllergy(allergy);
    return renderAllergyPdf(data);
  });
};

/**
 * Build Non-VA prescription TXT (backward-compatible wrapper)
 * @param {Object} prescription - Non-VA prescription object
 * @param {Object} options - Options (unused, for backward compatibility)
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @returns {string} TXT content
 */
export const buildNonVAPrescriptionTXT = (
  prescription,
  options = {},
  isCernerPilot = false,
) => {
  const data = mapNonVAPrescription(prescription, { isCernerPilot });
  return renderNonVAPrescriptionTxt(data, { includeSeparators: true });
};

/**
 * Build prescriptions TXT (backward-compatible wrapper)
 * @param {Array} prescriptions - Array of prescriptions
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {string} TXT content
 */
export const buildPrescriptionsTXT = (
  prescriptions,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const mappedList = mapPrescriptionList(prescriptions, {
    isCernerPilot,
    isV2StatusMapping,
  });
  return renderPrescriptionListTxt(mappedList);
};

/**
 * Build VA prescription TXT (backward-compatible wrapper)
 * @param {Object} prescription - VA prescription object
 * @param {boolean} isCernerPilot - Whether Cerner pilot mode is enabled
 * @param {boolean} isV2StatusMapping - Whether V2 status mapping is enabled
 * @returns {string} TXT content
 */
export const buildVAPrescriptionTXT = (
  prescription,
  isCernerPilot = false,
  isV2StatusMapping = false,
) => {
  const data = mapVAPrescriptionForDetail(prescription, {
    isCernerPilot,
    isV2StatusMapping,
  });
  return renderVAPrescriptionDetailTxt(data);
};

/**
 * Build allergies TXT (backward-compatible wrapper)
 * @param {Array|null} allergies - Array of allergies or null if error
 * @returns {string} TXT content
 */
export const buildAllergiesTXT = allergies => {
  const data = mapAllergies(allergies);
  return renderAllergiesTxtSection(data);
};

/**
 * Build allergy PDF item (backward-compatible wrapper)
 * @param {Object} allergy - Allergy object
 * @returns {Object} PDF config item
 */
export const buildAllergyPdfItem = allergy => {
  const data = mapAllergy(allergy);
  return renderAllergyPdf(data);
};

/**
 * Build allergy TXT item (backward-compatible wrapper)
 * @param {Object} allergy - Allergy object
 * @returns {string} TXT content
 */
export const buildAllergyTxtItem = allergy => {
  const data = mapAllergy(allergy);
  return renderAllergyTxt(data);
};

/**
 * Build allergies PDF list (backward-compatible wrapper)
 * @param {Array} allergies - Array of allergies
 * @returns {Array} PDF config items
 */
export const buildAllergiesPdfList = allergies => {
  if (!allergies) return [];
  return allergies.map(buildAllergyPdfItem);
};

/**
 * Build allergies PDF section (backward-compatible wrapper)
 * @param {Array|null} allergies - Allergies array or null if error
 * @returns {Object} PDF section config
 */
export const buildAllergiesPdfSection = allergies => {
  const data = mapAllergies(allergies);
  return renderAllergiesPdfSection(data);
};

/**
 * Build allergies TXT section (backward-compatible wrapper)
 * @param {Array|null} allergies - Allergies array or null if error
 * @returns {string} TXT content
 */
export const buildAllergiesTxtSection = allergies => {
  const data = mapAllergies(allergies);
  return renderAllergiesTxtSection(data);
};
