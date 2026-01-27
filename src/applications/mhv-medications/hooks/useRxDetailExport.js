import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportGeneratedBy } from '@department-of-veterans-affairs/mhv/exports';
import {
  PDF_TXT_GENERATE_STATUS,
  DOWNLOAD_FORMAT,
  PRINT_FORMAT,
  DATETIME_FORMATS,
} from '../util/constants';
import {
  buildVAPrescriptionPDFList,
  buildNonVAPrescriptionPDFList,
  buildAllergiesPDFList,
} from '../util/pdfConfigs';
import {
  buildVAPrescriptionTXT,
  buildNonVAPrescriptionTXT,
  buildAllergiesTXT,
} from '../util/txtConfigs';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
  generateTimestampForFilename,
} from '../util/helpers';

/**
 * Hook to manage generating PDF/TXT/print exports for a single prescription details page.
 * Consumers supply user info, prescription data, allergies data, and feature flags.
 */
const useRxDetailExport = ({
  user,
  prescription,
  allergies,
  allergiesError,
  isNonVaPrescription = false,
  features = {},
}) => {
  const { isCernerPilot = false, isV2StatusMapping = false } = features;
  const [shouldPrint, setShouldPrint] = useState(false);
  const [status, setStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });

  const prescriptionHeader =
    prescription?.prescriptionName || prescription?.orderableItem;

  const prescriptionPdfList = useMemo(
    () => {
      if (!prescription) return [];
      return isNonVaPrescription
        ? buildNonVAPrescriptionPDFList(
            prescription,
            isCernerPilot,
            isV2StatusMapping,
          )
        : buildVAPrescriptionPDFList(
            prescription,
            isCernerPilot,
            isV2StatusMapping,
          );
    },
    [prescription, isNonVaPrescription, isCernerPilot, isV2StatusMapping],
  );

  const isLoading = useMemo(
    () =>
      status.status === PDF_TXT_GENERATE_STATUS.InProgress && !allergiesError,
    [status, allergiesError],
  );

  const isSuccess = useMemo(
    () => status.status === PDF_TXT_GENERATE_STATUS.Success,
    [status],
  );

  const hasError = useMemo(
    () =>
      status.status === PDF_TXT_GENERATE_STATUS.InProgress && allergiesError,
    [status, allergiesError],
  );

  // Compute the effective error format - use status.format when there's an allergies error
  const effectiveErrorFormat = useMemo(
    () =>
      status.status === PDF_TXT_GENERATE_STATUS.InProgress && allergiesError
        ? status.format
        : undefined,
    [status, allergiesError],
  );

  const buildPdfData = useCallback(
    allergiesPdfList => {
      return {
        subject: `Single Medication Record - ${prescription?.prescriptionName}`,
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
        headerLeft: user.first
          ? `${user.last}, ${user.first}`
          : `${user.last || ' '}`,
        headerRight: `Date of birth: ${dateFormat(
          user.dob,
          DATETIME_FORMATS.longMonthDate,
        )}`,
        footerLeft: reportGeneratedBy,
        footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
        title: 'Medication details',
        preface: [
          {
            value:
              'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.',
          },
        ],
        results: [
          {
            header: prescriptionHeader,
            list: prescriptionPdfList,
          },
          {
            header: 'Allergies and reactions',
            ...(allergiesPdfList &&
              allergiesPdfList.length > 0 && {
                preface: [
                  {
                    value:
                      'This list includes all allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions). If you have allergies or reactions that are missing from this list, tell your care team at your next appointment.',
                  },
                  {
                    value: `Showing ${
                      allergiesPdfList.length
                    } records from newest to oldest`,
                  },
                ],
              }),
            list: allergiesPdfList || [],
            ...(allergiesPdfList &&
              !allergiesPdfList.length && {
                preface:
                  'There are no allergies or reactions in your VA medical records. If you have allergies or reactions that are missing from your records, tell your care team at your next appointment.',
              }),
            ...(!allergiesPdfList && {
              preface: [
                {
                  value:
                    "We couldn't access your allergy records when you downloaded this list. We're sorry. There was a problem with our system. Try again later. If it still doesn't work, call us at 877-327-0022 (TTY: 711). We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
                },
              ],
            }),
          },
        ],
      };
    },
    [user, prescription, prescriptionHeader, prescriptionPdfList],
  );

  const buildTxtData = useCallback(
    allergiesList => {
      return (
        `${"\nIf you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.\n\n\n" +
          'Medication details\n\n' +
          'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.\n\n'}${
          user.first ? `${user.last}, ${user.first}` : user.last || ' '
        }\n\n` +
        `Date of birth: ${dateFormat(
          user.dob,
          DATETIME_FORMATS.longMonthDate,
        )}\n\n` +
        `Report generated by My HealtheVet on VA.gov on ${dateFormat(
          Date.now(),
          DATETIME_FORMATS.longMonthDate,
        )}\n\n${
          isNonVaPrescription
            ? buildNonVAPrescriptionTXT(
                prescription,
                {},
                isCernerPilot,
                isV2StatusMapping,
              )
            : buildVAPrescriptionTXT(
                prescription,
                isCernerPilot,
                isV2StatusMapping,
              )
        }${allergiesList ?? ''}`
      );
    },
    [user, prescription, isNonVaPrescription, isCernerPilot, isV2StatusMapping],
  );

  const finalizeSuccess = useCallback(
    () => {
      setStatus({
        status: PDF_TXT_GENERATE_STATUS.Success,
        format: status.format,
      });
    },
    [status.format],
  );

  const handlePdfGeneration = useCallback(
    allergiesList => {
      generateMedicationsPDF(
        'medications',
        `${isNonVaPrescription ? 'Non-VA' : 'VA'}-medications-details-${
          user.first ? `${user.first}-${user.last}` : user.last
        }-${generateTimestampForFilename()}`,
        buildPdfData(allergiesList),
      ).then(() => {
        finalizeSuccess();
      });
    },
    [isNonVaPrescription, user, buildPdfData, finalizeSuccess],
  );

  const handleTxtGeneration = useCallback(
    allergiesList => {
      generateTextFile(
        buildTxtData(allergiesList),
        `${isNonVaPrescription ? 'Non-VA' : 'VA'}-medications-details-${
          user.first ? `${user.first}-${user.last}` : user.last
        }-${generateTimestampForFilename()}`,
      );
      finalizeSuccess();
    },
    [isNonVaPrescription, user, buildTxtData, finalizeSuccess],
  );

  const onDownload = useCallback(format => {
    setStatus({ status: PDF_TXT_GENERATE_STATUS.InProgress, format });
  }, []);

  // Handle generation when status changes to InProgress and allergies are ready
  useEffect(
    () => {
      const isInProgress = status.status === PDF_TXT_GENERATE_STATUS.InProgress;
      if (!isInProgress) return;

      const { format } = status;
      const allergiesReady = !!allergies && !allergiesError;

      // Handle print - doesn't require allergies
      if (format === PRINT_FORMAT.PRINT) {
        setStatus({
          status: PDF_TXT_GENERATE_STATUS.NotStarted,
          format: 'print',
        });
        return;
      }

      // For PDF/TXT, wait for allergies
      if (!allergiesReady) return;

      if (format === DOWNLOAD_FORMAT.PDF) {
        handlePdfGeneration(buildAllergiesPDFList(allergies));
      } else if (format === DOWNLOAD_FORMAT.TXT) {
        handleTxtGeneration(buildAllergiesTXT(allergies));
      }
    },
    [
      status,
      allergies,
      allergiesError,
      handlePdfGeneration,
      handleTxtGeneration,
    ],
  );

  // Handle print trigger
  useEffect(
    () => {
      if (
        allergies &&
        status.status === PDF_TXT_GENERATE_STATUS.NotStarted &&
        status.format === 'print'
      ) {
        window.print();
        setShouldPrint(false);
      }
    },
    [allergies, status],
  );

  return {
    onDownload,
    status,
    isLoading,
    isSuccess,
    hasError,
    errorFormat: effectiveErrorFormat,
    shouldPrint,
    prescriptionPdfList,
  };
};

export default useRxDetailExport;
