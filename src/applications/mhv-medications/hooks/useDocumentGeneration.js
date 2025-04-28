import { useState, useCallback } from 'react';
import { reportGeneratedBy } from '@department-of-veterans-affairs/mhv/exports';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
} from '../util/helpers';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
} from '../util/constants';
import {
  buildPrescriptionsPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import { buildPrescriptionsTXT, buildAllergiesTXT } from '../util/txtConfigs';

/**
 * Custom hook for handling document generation (PDF/TXT/Print) for medications
 *
 * @param {Object} params - Configuration parameters
 * @param {Object} params.userName - User name object with first and last properties
 * @param {string} params.dob - Date of birth
 * @param {string} params.selectedSortOption - Current sort option
 * @param {function} params.dispatch - Redux dispatch function for fetching allergies if needed
 * @param {function} params.getAllergiesList - Action creator for fetching allergies
 * @returns {Object} Document generation methods and state
 */
export const useDocumentGeneration = ({
  userName,
  dob,
  selectedSortOption,
  dispatch,
  getAllergiesList,
}) => {
  const [generationStatus, setGenerationStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
    error: false,
  });
  const [prescriptionsFullList, setPrescriptionsFullList] = useState([]);
  const [printedList, setPrintedList] = useState([]);
  const [isRetrievingFullList, setIsRetrievingFullList] = useState(false);
  const [hasFullListDownloadError, setHasFullListDownloadError] = useState(
    false,
  );

  // Build PDF data structure
  const pdfData = useCallback(
    (rxList, allergiesList) => {
      return {
        subject: 'Full Medications List',
        headerBanner: [
          {
            text:
              "If you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at ",
          },
          {
            text: '988',
            weight: 'bold',
          },
          {
            text: '. Then select 1.',
          },
        ],
        headerLeft: userName.first
          ? `${userName.last}, ${userName.first}`
          : `${userName.last || ' '}`,
        headerRight: `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}`,
        footerLeft: reportGeneratedBy,
        footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
        title: 'Medications',
        preface: [
          {
            value: `This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.`,
          },
        ],
        results: [
          {
            header: 'Medications list',
            preface: `Showing ${rxList?.length} medications, ${
              selectedSortOption ? selectedSortOption.toLowerCase() : ''
            }`,
            list: rxList,
          },
          {
            header: 'Allergies',
            ...(allergiesList &&
              allergiesList.length > 0 && {
                preface: [
                  {
                    value:
                      'This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
                  },
                  {
                    value: `Showing ${
                      allergiesList.length
                    } records from newest to oldest`,
                  },
                ],
              }),
            list: allergiesList || [],
            ...(allergiesList &&
              !allergiesList.length && {
                preface:
                  'There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.',
              }),
            ...(!allergiesList && {
              preface: [
                {
                  value:
                    "We couldn't access your allergy records when you downloaded this list. We're sorry. There was a problem with our system. Try again later.",
                },
                {
                  value:
                    "If it still doesn't work, call us at 877-327-0022 (TTY: 711). We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
                },
              ],
            }),
          },
        ],
      };
    },
    [userName, dob, selectedSortOption],
  );

  // Build TXT data structure
  const txtData = useCallback(
    (rxList, allergiesList) => {
      return (
        `${"\nIf you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.\n\n\n" +
          'Medications\n\n'}${
          userName.first
            ? `${userName.last}, ${userName.first}`
            : userName.last || ' '
        }\n\n` +
        `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}\n\n` +
        `Report generated by My HealtheVet on VA.gov on ${dateFormat(
          Date.now(),
          'MMMM D, YYYY',
        )}\n\n` +
        `This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.\n\n\n` +
        `Medications list\n\n` +
        `Showing ${prescriptionsFullList?.length} records, ${
          selectedSortOption ? selectedSortOption.toLowerCase() : ''
        }\n\n${rxList}${allergiesList ?? ''}`
      );
    },
    [userName, dob, selectedSortOption, prescriptionsFullList],
  );

  // Generate PDF document
  const generatePDF = useCallback(
    (rxList, allergiesList) => {
      return generateMedicationsPDF(
        'medications',
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
        pdfData(rxList, allergiesList),
      ).then(() => {
        setGenerationStatus(prev => ({
          ...prev,
          status: PDF_TXT_GENERATE_STATUS.Success,
        }));
        return true;
      });
    },
    [userName, pdfData],
  );

  // Generate TXT document
  const generateTXT = useCallback(
    (rxList, allergiesList) => {
      generateTextFile(
        txtData(rxList, allergiesList),
        `VA-medications-list-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY_hmmssa').replace(/\./g, '')}`,
      );
      setGenerationStatus(prev => ({
        ...prev,
        status: PDF_TXT_GENERATE_STATUS.Success,
      }));
      return true;
    },
    [userName, txtData],
  );

  // Print prescriptions list
  const printRxList = useCallback(() => {
    return setTimeout(() => {
      window.print();
    }, 1);
  }, []);

  // Handle download or print request
  const handleFullListDownload = useCallback(
    async format => {
      setHasFullListDownloadError(false);
      const isTxtOrPdf =
        format === DOWNLOAD_FORMAT.PDF || format === DOWNLOAD_FORMAT.TXT;

      if (
        (isTxtOrPdf || format === PRINT_FORMAT.PRINT_FULL_LIST) &&
        !prescriptionsFullList.length
      ) {
        setIsRetrievingFullList(true);
      }

      setGenerationStatus({
        status: PDF_TXT_GENERATE_STATUS.InProgress,
        format,
        error: false,
      });

      // Ensure we have allergies data
      if (dispatch && getAllergiesList) {
        await dispatch(getAllergiesList());
      }
    },
    [prescriptionsFullList, dispatch, getAllergiesList],
  );

  return {
    generationStatus,
    setGenerationStatus,
    prescriptionsFullList,
    setPrescriptionsFullList,
    printedList,
    setPrintedList,
    isRetrievingFullList,
    setIsRetrievingFullList,
    hasFullListDownloadError,
    setHasFullListDownloadError,
    generatePDF,
    generateTXT,
    printRxList,
    handleFullListDownload,
    pdfData,
    txtData,
    buildPrescriptionsPDFList,
    buildAllergiesPDFList,
    buildPrescriptionsTXT,
    buildAllergiesTXT,
  };
};

export default useDocumentGeneration;
