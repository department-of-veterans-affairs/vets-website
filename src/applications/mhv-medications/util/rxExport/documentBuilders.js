import {
  formatUserFullName,
  formatDob,
  formatDate,
  DATETIME_FORMATS,
} from './formatters';
import {
  CRISIS_LINE_PDF,
  CRISIS_LINE_TXT,
  reportGeneratedBy,
  getReportGeneratedText,
  SINGLE_MEDICATION_PREFACE,
  PDF_FOOTER_RIGHT,
} from './staticContent';
import {
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from './rxRenderer';
import { generatePdf, generateTxt, generateExportFilename } from './generators';

// ============================================================================
// PDF Document Builder
// ============================================================================

/**
 * Create a PDF document builder with shared configuration
 * @param {Object} options
 * @param {Object} options.userName - User name object
 * @param {string|Date} options.dob - Date of birth
 * @returns {Object} Builder object with methods to create PDF documents
 */
export const createPdfDocumentBuilder = ({ userName, dob }) => {
  const headerLeft = formatUserFullName(userName);
  const headerRight = formatDob(dob);

  return {
    /**
     * Build base PDF document structure
     * @param {Object} config
     * @param {string} config.subject - Document subject
     * @param {string} config.title - Document title
     * @param {Array|string} config.preface - Document preface
     * @param {Array} config.results - Content sections
     * @returns {Object} PDF document data
     */
    buildDocument({ subject, title, preface, results }) {
      return {
        subject,
        headerBanner: CRISIS_LINE_PDF,
        headerLeft,
        headerRight,
        footerLeft: reportGeneratedBy,
        footerRight: PDF_FOOTER_RIGHT,
        title,
        preface,
        results,
      };
    },

    /**
     * Build single Rx details PDF
     * @param {Object} config
     * @param {string} config.rxName - Rx name
     * @param {Array} config.rxList - Rx PDF list items
     * @param {Array|null} config.allergies - Allergies data
     * @returns {Object} PDF document data
     */
    buildRxDetailsPdf({ rxName, rxList, allergies }) {
      return this.buildDocument({
        subject: `Single Medication Record - ${rxName}`,
        title: 'Medication details',
        preface: [{ value: SINGLE_MEDICATION_PREFACE }],
        results: [
          {
            header: rxName,
            list: rxList,
          },
          buildAllergiesPdfSection(allergies),
        ],
      });
    },

    /**
     * Build medications list PDF
     * @param {Object} config
     * @param {Array} config.rxList - List of Rx items
     * @param {Array|null} config.allergies - Allergies data
     * @param {Array|string} config.preface - Preface text
     * @param {string} config.listHeader - Header for medications list section
     * @returns {Object} PDF document data
     */
    buildRxListPdf({ rxList, allergies, preface, listHeader }) {
      return this.buildDocument({
        subject: 'Full Medications List',
        title: 'Medications',
        preface,
        results: [
          {
            header: listHeader,
            list: rxList,
          },
          buildAllergiesPdfSection(allergies),
        ],
      });
    },
  };
};

// ============================================================================
// TXT Document Builder
// ============================================================================

/**
 * Create a TXT document builder with shared configuration
 * @param {Object} options
 * @param {Object} options.userName - User name object
 * @param {string|Date} options.dob - Date of birth
 * @returns {Object} Builder object with methods to create TXT documents
 */
export const createTxtDocumentBuilder = ({ userName, dob }) => {
  const userLine = formatUserFullName(userName);
  const dobLine = `Date of birth: ${formatDate(
    dob,
    DATETIME_FORMATS.longMonthDate,
  )}`;

  return {
    /**
     * Build base TXT document structure
     * @param {Object} config
     * @param {string} config.title - Document title
     * @param {string} config.preface - Document preface
     * @param {string} config.body - Main document content
     * @param {string} config.allergiesSection - Allergies section content
     * @returns {string} TXT document content
     */
    buildDocument({ title, preface, body, allergiesSection }) {
      const parts = [
        CRISIS_LINE_TXT,
        `${title}\n\n`,
        preface ? `${preface}\n\n` : '',
        `${userLine}\n\n`,
        `${dobLine}\n\n`,
        `${getReportGeneratedText()}\n\n`,
        body,
        allergiesSection ?? '',
      ];
      return parts.join('');
    },

    /**
     * Build single Rx details TXT
     * @param {Object} config
     * @param {string} config.rxContent - Formatted Rx content
     * @param {Array|null} config.allergies - Allergies data
     * @returns {string} TXT document content
     */
    buildRxDetailsTxt({ rxContent, allergies }) {
      return this.buildDocument({
        title: 'Medication details',
        preface: SINGLE_MEDICATION_PREFACE,
        body: rxContent,
        allergiesSection: buildAllergiesTxtSection(allergies),
      });
    },

    /**
     * Build medications list TXT
     * @param {Object} config
     * @param {string} config.preface - Preface text
     * @param {string} config.listHeader - Header for medications list
     * @param {string} config.rxContent - Formatted Rx list content
     * @param {Array|null} config.allergies - Allergies data
     * @returns {string} TXT document content
     */
    buildRxListTxt({ preface, listHeader, rxContent, allergies }) {
      const body = `${listHeader}\n\n${rxContent}`;
      return this.buildDocument({
        title: 'Medications',
        preface,
        body,
        allergiesSection: buildAllergiesTxtSection(allergies),
      });
    },
  };
};

// ============================================================================
// Export Service
// ============================================================================

/**
 * Create a medications export service
 * @param {Object} config
 * @param {Object} config.userName - User name object
 * @param {string|Date} config.dob - Date of birth
 * @param {Object} config.options - Export options (isCernerPilot, isV2StatusMapping)
 * @returns {Object} Export service with methods to export documents
 */
export const createExportService = ({ userName, dob, options = {} }) => {
  const pdfBuilder = createPdfDocumentBuilder({ userName, dob });
  const txtBuilder = createTxtDocumentBuilder({ userName, dob });

  return {
    pdfBuilder,
    txtBuilder,
    options,

    /**
     * Export Rx details as PDF
     * @param {Object} config
     * @param {string} config.rxName
     * @param {Array} config.rxPdfList
     * @param {Array|null} config.allergies
     * @param {boolean} config.isNonVA
     */
    async exportRxDetailsPdf({ rxName, rxPdfList, allergies, isNonVA }) {
      const pdfData = pdfBuilder.buildRxDetailsPdf({
        rxName,
        rxList: rxPdfList,
        allergies,
      });
      const filename = generateExportFilename({
        userName,
        isNonVA,
        isDetails: true,
      });
      await generatePdf('medications', filename, pdfData);
    },

    /**
     * Export Rx details as TXT
     * @param {Object} config
     * @param {string} config.rxContent
     * @param {Array|null} config.allergies
     * @param {boolean} config.isNonVA
     */
    exportRxDetailsTxt({ rxContent, allergies, isNonVA }) {
      const txtContent = txtBuilder.buildRxDetailsTxt({
        rxContent,
        allergies,
      });
      const filename = generateExportFilename({
        userName,
        isNonVA,
        isDetails: true,
      });
      generateTxt(txtContent, filename);
    },

    /**
     * Export Rx list as PDF
     * @param {Object} config
     * @param {Array} config.rxPdfList
     * @param {Array|null} config.allergies
     * @param {Array|string} config.preface
     * @param {string} config.listHeader
     */
    async exportRxListPdf({ rxPdfList, allergies, preface, listHeader }) {
      const pdfData = pdfBuilder.buildRxListPdf({
        rxList: rxPdfList,
        allergies,
        preface,
        listHeader,
      });
      const filename = generateExportFilename({ userName, isDetails: false });
      await generatePdf('medications', filename, pdfData);
    },

    /**
     * Export Rx list as TXT
     * @param {Object} config
     * @param {string} config.rxContent
     * @param {Array|null} config.allergies
     * @param {string} config.preface
     * @param {string} config.listHeader
     */
    exportRxListTxt({ rxContent, allergies, preface, listHeader }) {
      const txtContent = txtBuilder.buildRxListTxt({
        preface,
        listHeader,
        rxContent,
        allergies,
      });
      const filename = generateExportFilename({ userName, isDetails: false });
      generateTxt(txtContent, filename);
    },
  };
};
