import { formatList, FIELD_NOT_AVAILABLE } from './formatters';
import {
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_DESCRIPTION,
  ALLERGIES_EMPTY_MESSAGE,
  ALLERGIES_ERROR_MESSAGE,
  getAllergiesCountText,
  TXT_SEPARATOR,
} from './staticContent';

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
        {
          title: 'Signs and symptoms',
          value: formatList(allergy.reaction, FIELD_NOT_AVAILABLE),
          inline: true,
        },
        {
          title: 'Type of allergy',
          value: allergy.type,
          inline: true,
        },
        {
          title: 'Observed or historical',
          value: allergy.observedOrReported,
          inline: true,
        },
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
  if (!allergies) {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_ERROR_MESSAGE}\n`;
  }

  if (allergies.length === 0) {
    return `\n\n${ALLERGIES_SECTION_HEADER}\n\n${ALLERGIES_EMPTY_MESSAGE}\n`;
  }

  const header = `\n${TXT_SEPARATOR}\n\n\n`;
  const body = [
    ALLERGIES_SECTION_HEADER,
    ALLERGIES_DESCRIPTION,
    getAllergiesCountText(allergies.length),
  ].join('\n\n');

  const items = allergies.map(buildAllergyTxtItem).join('\n');
  const footer = `\n\n${TXT_SEPARATOR}\n`;

  return `${header}${body}\n${items}\n${footer}`;
};
