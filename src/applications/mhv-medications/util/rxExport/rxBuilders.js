import {
  formatDate,
  formatProviderName,
  formatList,
  validateField,
  validateFieldWithName,
  DATETIME_FORMATS,
  FIELD_NOT_AVAILABLE,
} from './formatters';
import {
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_DESCRIPTION,
  ALLERGIES_EMPTY_MESSAGE,
  ALLERGIES_ERROR_MESSAGE,
  getAllergiesCountText,
  NON_VA_MEDICATION_DESCRIPTION,
  ACTIVE_NON_VA,
} from './staticContent';

// ============================================================================
// Prescription Field Builders
// ============================================================================

/**
 * Creates a prescription field object for PDF
 * @param {string} title - Field label
 * @param {*} value - Field value
 * @param {Object} options - Additional options
 * @returns {Object}
 */
export const createPdfField = (title, value, options = {}) => ({
  title,
  value,
  inline: options.inline !== false,
  ...options,
});

/**
 * Creates a text line for TXT export
 * @param {string} label - Field label
 * @param {*} value - Field value
 * @returns {string}
 */
export const createTxtField = (label, value) =>
  `${label}: ${validateFieldWithName(label, value)}`;

// ============================================================================
// Common Prescription Fields
// ============================================================================

/**
 * Build instructions field
 * @param {Object} prescription
 * @param {string} format - 'pdf' or 'txt'
 * @returns {Object|string}
 */
export const buildInstructionsField = (prescription, format) => {
  const value = prescription.sig || 'Instructions not available';
  return format === 'pdf'
    ? createPdfField('Instructions', value)
    : createTxtField('Instructions', prescription.sig);
};

/**
 * Build reason for use field
 * @param {Object} prescription
 * @param {string} format - 'pdf' or 'txt'
 * @returns {Object|string|null}
 */
export const buildReasonForUseField = (prescription, format) => {
  const value = prescription.indicationForUse || 'Reason for use not available';
  return format === 'pdf'
    ? createPdfField('Reason for use', value)
    : createTxtField('Reason for use', prescription.indicationForUse);
};

/**
 * Build facility field
 * @param {Object} prescription
 * @param {string} format - 'pdf' or 'txt'
 * @returns {Object|string}
 */
export const buildFacilityField = (prescription, format) => {
  return format === 'pdf'
    ? createPdfField(
        'Facility',
        validateFieldWithName('Facility', prescription.facilityName),
      )
    : createTxtField('Facility', prescription.facilityName);
};

/**
 * Build provider field
 * @param {Object} prescription
 * @param {string} format - 'pdf' or 'txt'
 * @param {string} label - Field label (varies by context)
 * @returns {Object|string}
 */
export const buildProviderField = (
  prescription,
  format,
  label = 'Prescribed by',
) => {
  const value = formatProviderName(
    prescription.providerFirstName,
    prescription.providerLastName,
  );
  return format === 'pdf' ? createPdfField(label, value) : `${label}: ${value}`;
};

/**
 * Build date field
 * @param {Date|string} date
 * @param {string} format - 'pdf' or 'txt'
 * @param {string} label - Field label
 * @param {string} noDateMessage - Message when no date
 * @returns {Object|string}
 */
export const buildDateField = (
  date,
  format,
  label,
  noDateMessage = 'Date not available',
) => {
  const value = formatDate(date, DATETIME_FORMATS.longMonthDate, noDateMessage);
  return format === 'pdf' ? createPdfField(label, value) : `${label}: ${value}`;
};

/**
 * Build pharmacy phone field
 * @param {Object} prescription
 * @param {boolean} isCernerPilot
 * @param {string} format - 'pdf' or 'txt'
 * @returns {Object|string}
 */
export const buildPharmacyPhoneField = (
  prescription,
  isCernerPilot,
  format,
) => {
  if (isCernerPilot) {
    const label = 'Pharmacy contact information';
    const value = 'Check your prescription label or contact your VA facility.';
    return format === 'pdf'
      ? createPdfField(label, value)
      : createTxtField(label, value);
  }
  return format === 'pdf'
    ? createPdfField(
        'Pharmacy phone number',
        validateFieldWithName(
          'Pharmacy phone number',
          prescription.phoneNumber,
        ),
      )
    : createTxtField('Pharmacy phone number', prescription.phoneNumber);
};

// ============================================================================
// Non-VA Rx Builders
// ============================================================================

/**
 * Build Non-VA Rx fields
 * @param {Object} rx - Prescription object
 * @param {Object} options
 * @param {string} format - 'pdf' or 'txt'
 * @returns {Array}
 */
export const buildNonVARxFields = (rx, options, format) => {
  const { isCernerPilot = false } = options;

  return [
    buildInstructionsField(rx, format),
    !isCernerPilot && buildReasonForUseField(rx, format),
    format === 'pdf'
      ? createPdfField('Status', ACTIVE_NON_VA)
      : `Status: ${validateField(
          rx.dispStatus?.toString(),
        )}\n${NON_VA_MEDICATION_DESCRIPTION}`,
    format === 'pdf' && { value: NON_VA_MEDICATION_DESCRIPTION },
    buildDateField(
      rx.dispensedDate,
      format,
      'When you started taking this medication',
    ),
    buildProviderField(rx, format, 'Documented by'),
    format === 'pdf'
      ? createPdfField(
          'Documented at this facility',
          rx.facilityName || 'VA facility name not available',
        )
      : createTxtField('Documented at this facility', rx.facilityName),
  ].filter(Boolean);
};

// ============================================================================
// Allergies Builders
// ============================================================================

/**
 * Build a single allergy item for PDF
 * @param {Object} allergy
 * @returns {Object}
 */
export const buildAllergyPdfItem = allergy => ({
  header: allergy.name,
  sections: [
    {
      items: [
        createPdfField(
          'Signs and symptoms',
          formatList(allergy.reaction, FIELD_NOT_AVAILABLE),
        ),
        createPdfField('Type of allergy', allergy.type),
        createPdfField('Observed or historical', allergy.observedOrReported),
      ],
    },
  ],
});

/**
 * Build a single allergy item for TXT
 * @param {Object} allergy
 * @returns {string}
 */
export const buildAllergyTxtItem = allergy => {
  const lines = [
    '',
    allergy.name,
    `Signs and symptoms: ${formatList(allergy.reaction, FIELD_NOT_AVAILABLE)}`,
    `Type of allergy: ${allergy.type}`,
    `Observed or historical: ${allergy.observedOrReported}`,
  ];
  return lines.join('\n');
};

/**
 * Build allergies list for PDF
 * @param {Array} allergies
 * @returns {Array}
 */
export const buildAllergiesPdfList = allergies => {
  if (!allergies) return [];
  return allergies.map(buildAllergyPdfItem);
};

/**
 * Build allergies section for PDF document
 * @param {Array|null} allergies - Allergies array or null if error
 * @returns {Object}
 */
export const buildAllergiesPdfSection = allergies => {
  const section = {
    header: ALLERGIES_SECTION_HEADER,
    list: allergies ? buildAllergiesPdfList(allergies) : [],
  };

  if (!allergies) {
    // Error state - couldn't fetch allergies
    section.preface = [{ value: ALLERGIES_ERROR_MESSAGE }];
  } else if (allergies.length === 0) {
    // Empty state - no allergies
    section.preface = ALLERGIES_EMPTY_MESSAGE;
  } else {
    // Has allergies
    section.preface = [
      { value: ALLERGIES_DESCRIPTION },
      { value: getAllergiesCountText(allergies.length) },
    ];
  }

  return section;
};

/**
 * Build allergies section for TXT document
 * @param {Array|null} allergies - Allergies array or null if error
 * @returns {string}
 */
export const buildAllergiesTxtSection = allergies => {
  const SEPARATOR =
    '---------------------------------------------------------------------------------';

  if (!allergies) {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_ERROR_MESSAGE}\n`;
  }

  if (allergies.length === 0) {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_EMPTY_MESSAGE}\n`;
  }

  const header = `\n${SEPARATOR}\n\n\n`;
  const body = [
    ALLERGIES_SECTION_HEADER,
    ALLERGIES_DESCRIPTION,
    getAllergiesCountText(allergies.length),
  ].join('\n\n');

  const items = allergies.map(buildAllergyTxtItem).join('\n');
  const footer = `\n\n${SEPARATOR}\n`;

  return `${header}${body}\n${items}\n${footer}`;
};
