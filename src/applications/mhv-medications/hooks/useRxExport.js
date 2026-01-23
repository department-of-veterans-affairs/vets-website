import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../util/constants';
import { createExportService } from '../util/rxExport';
import {
  generatePdf,
  generateTxt,
  generateExportFilename,
} from '../util/rxExport/generators';

/**
 * Export status constants for external use
 */
export const EXPORT_STATUS = PDF_TXT_GENERATE_STATUS;
export const EXPORT_FORMAT = {
  ...DOWNLOAD_FORMAT,
  ...PRINT_FORMAT,
};

/**
 * Custom hook to manage prescription export lifecycle
 *
 * Handles:
 * - Export lifecycle state (not started, in progress, success)
 * - Async orchestration (waiting for allergies data)
 * - PDF/TXT generation logic
 * - Print mode handling
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.userName - User name object { first, last }
 * @param {string|Date} config.dob - Date of birth
 * @param {Array|null} config.allergies - Allergies data from API
 * @param {Object|null} config.allergiesError - Allergies API error
 * @param {Object} config.options - Additional options
 * @param {boolean} config.options.isCernerPilot - Cerner pilot flag
 * @param {boolean} config.options.isV2StatusMapping - V2 status mapping flag
 * @returns {Object} Export hook return value
 */
export const useRxExport = ({
  userName,
  dob,
  allergies,
  allergiesError,
  options = {},
}) => {
  // Export lifecycle state
  const [exportStatus, setExportStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });

  // Print state
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Error state for export list download
  const [hasExportError, setHasExportError] = useState(false);

  // Memoized export service
  const exportService = useMemo(
    () =>
      createExportService({
        userName,
        dob,
        options,
      }),
    [userName, dob, options],
  );

  // Derived state
  const isExportInProgress =
    exportStatus.status === PDF_TXT_GENERATE_STATUS.InProgress;
  const isExportSuccess =
    exportStatus.status === PDF_TXT_GENERATE_STATUS.Success;
  const isShowingError = Boolean(
    (isExportInProgress && allergiesError) || hasExportError,
  );

  /**
   * Reset export status to not started
   */
  const resetExportStatus = useCallback(() => {
    setExportStatus({
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
      format: undefined,
    });
  }, []);

  /**
   * Set export status to success
   */
  const setExportSuccess = useCallback(() => {
    setExportStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
  }, []);

  /**
   * Start an export operation
   * @param {string} format - DOWNLOAD_FORMAT.PDF, DOWNLOAD_FORMAT.TXT, or PRINT_FORMAT.PRINT
   */
  const startExport = useCallback(format => {
    setHasExportError(false);
    setExportStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
    });
  }, []);

  /**
   * Set export error state
   * @param {boolean} hasError - Whether there is an export error
   */
  const setExportError = useCallback(hasError => {
    setHasExportError(hasError);
  }, []);

  // Handle print trigger
  useEffect(
    () => {
      if (shouldPrint) {
        window.print();
        setShouldPrint(false);
      }
    },
    [shouldPrint],
  );

  /**
   * Trigger print mode
   * @param {any} data - Data to be printed (stored for print-only component)
   */
  const triggerPrint = useCallback(data => {
    setPrintData(data);
    setExportStatus({
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
      format: 'print',
    });
    setShouldPrint(true);
  }, []);

  // Handle print when status changes to NotStarted with print format
  useEffect(
    () => {
      if (
        allergies &&
        exportStatus.status === PDF_TXT_GENERATE_STATUS.NotStarted &&
        exportStatus.format === 'print'
      ) {
        window.print();
      }
    },
    [allergies, exportStatus],
  );

  /**
   * Export prescription details (single prescription)
   */
  const exportRxDetails = useMemo(
    () => ({
      /**
       * Export as PDF
       * @param {Object} config
       * @param {string} config.rxName - Prescription name
       * @param {Array} config.rxPdfList - PDF field list
       * @param {boolean} config.isNonVA - Whether it's a non-VA prescription
       */
      async pdf({ rxName, rxPdfList, isNonVA }) {
        try {
          await exportService.exportRxDetailsPdf({
            rxName,
            rxPdfList,
            allergies,
            isNonVA,
          });
          setExportSuccess();
        } catch (error) {
          setHasExportError(true);
        }
      },

      /**
       * Export as TXT
       * @param {Object} config
       * @param {string} config.rxContent - TXT content
       * @param {boolean} config.isNonVA - Whether it's a non-VA prescription
       */
      txt({ rxContent, isNonVA }) {
        try {
          exportService.exportRxDetailsTxt({
            rxContent,
            allergies,
            isNonVA,
          });
          setExportSuccess();
        } catch (error) {
          setHasExportError(true);
        }
      },
    }),
    [exportService, allergies, setExportSuccess],
  );

  /**
   * Export prescriptions list
   */
  const exportRxList = useMemo(
    () => ({
      /**
       * Export as PDF
       * @param {Object} config
       * @param {Array} config.rxPdfList - PDF field list
       * @param {Array|string} config.preface - Preface text
       * @param {string} config.listHeader - List header
       */
      async pdf({ rxPdfList, preface, listHeader }) {
        try {
          await exportService.exportRxListPdf({
            rxPdfList,
            allergies,
            preface,
            listHeader,
          });
          setExportSuccess();
        } catch (error) {
          setHasExportError(true);
        }
      },

      /**
       * Export as TXT
       * @param {Object} config
       * @param {string} config.rxContent - TXT content
       * @param {string} config.preface - Preface text
       * @param {string} config.listHeader - List header
       */
      txt({ rxContent, preface, listHeader }) {
        try {
          exportService.exportRxListTxt({
            rxContent,
            allergies,
            preface,
            listHeader,
          });
          setExportSuccess();
        } catch (error) {
          setHasExportError(true);
        }
      },
    }),
    [exportService, allergies, setExportSuccess],
  );

  return {
    // State
    exportStatus,
    isExportInProgress,
    isExportSuccess,
    isShowingError,
    hasExportError,
    printData,

    // Actions
    startExport,
    resetExportStatus,
    setExportSuccess,
    setExportError,
    triggerPrint,

    // Export methods
    exportRxDetails,
    exportRxList,

    // Service (for advanced usage)
    exportService,

    // Utilities
    generatePdf,
    generateTxt,
    generateExportFilename,
  };
};

export default useRxExport;
