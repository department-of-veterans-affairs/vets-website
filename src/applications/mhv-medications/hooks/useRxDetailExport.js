import { useCallback, useEffect, useMemo } from 'react';
import { reportGeneratedBy } from '@department-of-veterans-affairs/mhv/exports';
import { DATETIME_FORMATS } from '../util/constants';
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
  generateRxDetailFilename,
  generateTextFile,
} from '../util/helpers';
import useExportFile from './useExportFile';

/**
 * Hook to manage generating PDF/TXT/print exports for a single prescription details page.
 * Consumers supply user info, prescription data, allergies data, and feature flags.
 *
 * This hook builds the detail-specific export payloads and delegates the
 * shared export flow (status, async handling, print trigger) to useExportFile.
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

  const exportFlow = useExportFile({
    allergies,
    allergiesError,
    isReady: true,
    error: false,

    onGeneratePdf: async () => {
      const filename = generateRxDetailFilename({ user, isNonVaPrescription });
      await generateMedicationsPDF(
        'medications',
        filename,
        buildPdfData(buildAllergiesPDFList(allergies)),
      );
    },

    onGenerateTxt: async () => {
      const filename = generateRxDetailFilename({ user, isNonVaPrescription });
      generateTextFile(buildTxtData(buildAllergiesTXT(allergies)), filename);
    },

    onBeforePrint: () => {},
  });

  // Trigger actual browser print when requested
  useEffect(
    () => {
      if (exportFlow.shouldPrint) {
        window.print();
        exportFlow.clearPrintTrigger();
      }
    },
    [exportFlow.shouldPrint, exportFlow],
  );

  return {
    onDownload: exportFlow.onDownload,
    status: exportFlow.status,
    isLoading: exportFlow.isLoading,
    isSuccess: exportFlow.isSuccess,
    hasError: exportFlow.hasError,
    errorFormat: exportFlow.errorFormat,
    shouldPrint: exportFlow.shouldPrint,

    prescriptionPdfList,
  };
};

export default useRxDetailExport;
