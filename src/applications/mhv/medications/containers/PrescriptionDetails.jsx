import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  getPrescriptionDetails,
  getAllergiesList,
  clearAllergiesError,
} from '../actions/prescriptions';
import PrintOnlyPage from './PrintOnlyPage';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
} from '../util/helpers';
import PrintDownload, {
  DOWNLOAD_FORMAT,
} from '../components/shared/PrintDownload';
import AllergiesErrorModal from '../components/shared/AllergiesErrorModal';
import { updatePageTitle } from '../../shared/util/helpers';
import NonVaPrescription from '../components/PrescriptionDetails/NonVaPrescription';
import VaPrescription from '../components/PrescriptionDetails/VaPrescription';
import BeforeYouDownloadDropdown from '../components/shared/BeforeYouDownloadDropdown';
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
import { PDF_TXT_GENERATE_STATUS } from '../util/constants';
import { getPrescriptionImage } from '../api/rxApi';
import PrescriptionPrintOnly from '../components/PrescriptionDetails/PrescriptionPrintOnly';
import { reportGeneratedBy } from '../../shared/util/constants';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import { Actions } from '../util/actionTypes';
import usePrintTitle from '../components/shared/usePrintTitle';

const PrescriptionDetails = () => {
  const prescription = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails,
  );
  const nonVaPrescription = prescription?.prescriptionSource === 'NV';
  const userName = useSelector(state => state.user.profile.userFullName);
  const crumbs = useSelector(state => state.rx.breadcrumbs.list);
  const dob = useSelector(state => state.user.profile.dob);
  const allergies = useSelector(state => state.rx.allergies?.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const { prescriptionId } = useParams();
  const [prescriptionPdfList, setPrescriptionPdfList] = useState([]);
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
    message: undefined,
  });
  const dispatch = useDispatch();

  const prescriptionHeader =
    prescription?.prescriptionName ||
    (prescription?.dispStatus === 'Active: Non-VA'
      ? prescription?.orderableItem
      : '');
  const refillHistory = [...(prescription?.rxRfRecords?.[0]?.[1] || [])];
  refillHistory.push({
    prescriptionName: prescription?.prescriptionName,
    dispensedDate: prescription?.dispensedDate,
    cmopNdcNumber: prescription?.cmopNdcNumber,
    id: prescription?.prescriptionId,
  });

  useEffect(() => {
    if (crumbs.length === 0 && prescription) {
      dispatch(
        setBreadcrumbs(
          [
            {
              url: '/my-health/medications/about',
              label: 'About medications',
            },
            {
              url: '/my-health/medications/1',
              label: 'Medications',
            },
          ],
          {
            url: `/my-health/medications/prescription/${
              prescription.prescriptionId
            }`,
            label: prescriptionHeader,
          },
        ),
      );
    }
  });

  useEffect(
    () => {
      if (prescription) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(`${prescription.prescriptionName} | Veterans Affairs`);
      } else {
        window.scrollTo(0, 0);
      }
    },
    [prescription],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, dateFormat, updatePageTitle);

  useEffect(
    () => {
      return () => {
        dispatch({ type: Actions.Prescriptions.CLEAR_DETAILS });
      };
    },
    [dispatch],
  );

  const pdfData = useCallback(
    allergiesPdfList => {
      return {
        subject: `Single Medication Record - ${prescription?.prescriptionName}`,
        headerBanner: [
          {
            text:
              'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at ',
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
            header: 'Allergies',
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
              preface:
                'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, email us at vamhvfeedback@va.gov.',
            }),
          },
        ],
      };
    },
    [userName, dob, prescription, prescriptionPdfList, prescriptionHeader],
  );

  const txtData = useCallback(
    allergiesList => {
      return (
        `${"\nIf you're ever in crisis and need to talk with someone right away, call the Veterans Crisis Line at 988. Then select 1.\n\n\n" +
          'Medication details\n\n' +
          'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.\n\n'}${
          userName.first
            ? `${userName.last}, ${userName.first}`
            : userName.last || ' '
        }\n\n` +
        `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}\n\n` +
        `Report generated by My HealtheVet on VA.gov on ${dateFormat(
          Date.now(),
          'MMMM D, YYYY',
        )}\n\n${
          nonVaPrescription
            ? buildNonVAPrescriptionTXT(prescription)
            : buildVAPrescriptionTXT(prescription)
        }${allergiesList ?? ''}`
      );
    },
    [userName, dob, prescription, nonVaPrescription],
  );

  const handleFileDownload = async format => {
    setPdfTxtGenerateStatus({
      status: PDF_TXT_GENERATE_STATUS.InProgress,
      format,
      message: 'Downloading your file...',
    });
    await Promise.allSettled([!allergies && dispatch(getAllergiesList())]);
  };

  const generatePDF = useCallback(
    allergiesList => {
      generateMedicationsPDF(
        'medications',
        `${nonVaPrescription ? 'Non-VA' : 'VA'}-medications-details-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY').replace(/\./g, '')}`,
        pdfData(allergiesList),
      ).then(() => {
        setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
      });
    },
    [nonVaPrescription, userName, pdfData, setPdfTxtGenerateStatus],
  );

  const generateTXT = useCallback(
    allergiesList => {
      generateTextFile(
        txtData(allergiesList),
        `${nonVaPrescription ? 'Non-VA' : 'VA'}-medications-details-${
          userName.first ? `${userName.first}-${userName.last}` : userName.last
        }-${dateFormat(Date.now(), 'M-D-YYYY').replace(/\./g, '')}`,
      );
      setPdfTxtGenerateStatus({ status: PDF_TXT_GENERATE_STATUS.Success });
    },
    [nonVaPrescription, userName, txtData, setPdfTxtGenerateStatus],
  );

  useEffect(
    () => {
      if (prescriptionId) dispatch(getPrescriptionDetails(prescriptionId));
    },
    [prescriptionId, dispatch],
  );

  useEffect(
    () => {
      dispatch(getAllergiesList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (
        allergies &&
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress
      ) {
        if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.PDF) {
          generatePDF(buildAllergiesPDFList(allergies));
        } else if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.TXT) {
          generateTXT(buildAllergiesTXT(allergies));
        }
      }
    },
    [allergies, pdfTxtGenerateStatus, generatePDF, generateTXT],
  );

  useEffect(
    () => {
      if (!prescription) return;
      const cmopNdcNumber =
        prescription.rxRfRecords?.[0]?.[1][0].cmopNdcNumber ??
        prescription.cmopNdcNumber;
      if (cmopNdcNumber) {
        getPrescriptionImage(cmopNdcNumber).then(({ data: image }) => {
          setPrescriptionPdfList(
            nonVaPrescription
              ? buildNonVAPrescriptionPDFList(prescription)
              : buildVAPrescriptionPDFList(prescription, image),
          );
        });
      } else {
        setPrescriptionPdfList(
          nonVaPrescription
            ? buildNonVAPrescriptionPDFList(prescription)
            : buildVAPrescriptionPDFList(prescription),
        );
      }
    },
    [nonVaPrescription, prescription],
  );

  const filledEnteredDate = () => {
    if (nonVaPrescription) {
      return (
        <>
          Documented on {dateFormat(prescription.orderedDate, 'MMMM D, YYYY')}
        </>
      );
    }
    return (
      <>
        {prescription.dispensedDate ||
        prescription.rxRfRecords?.[0]?.[1].find(
          record => record.dispensedDate,
        ) ? (
          <span>
            Last filled on{' '}
            {dateFormat(
              prescription.rxRfRecords?.[0]?.[1]?.find(
                record => record.dispensedDate,
              )?.dispensedDate || prescription.dispensedDate,
              'MMMM D, YYYY',
            )}
          </span>
        ) : (
          <span>Not filled yet</span>
        )}
      </>
    );
  };

  const handleModalClose = () => {
    dispatch(clearAllergiesError());
    setPdfTxtGenerateStatus({
      ...pdfTxtGenerateStatus,
      status: PDF_TXT_GENERATE_STATUS.NotStarted,
    });
  };

  const handleModalDownloadButton = () => {
    if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.PDF) {
      generatePDF();
    } else if (pdfTxtGenerateStatus.format === DOWNLOAD_FORMAT.TXT) {
      generateTXT(buildAllergiesTXT());
    }
    dispatch(clearAllergiesError());
  };

  const content = () => {
    if (
      (pdfTxtGenerateStatus.status !== PDF_TXT_GENERATE_STATUS.InProgress ||
        allergiesError) &&
      prescription
    ) {
      return (
        <>
          <div className="no-print">
            <AllergiesErrorModal
              onCloseButtonClick={handleModalClose}
              onDownloadButtonClick={handleModalDownloadButton}
              onCancelButtonClick={handleModalClose}
              visible={Boolean(
                pdfTxtGenerateStatus.status ===
                  PDF_TXT_GENERATE_STATUS.InProgress && allergiesError,
              )}
            />
            <h1
              aria-describedby="last-filled"
              data-testid="prescription-name"
              className="vads-u-margin-bottom--0"
              id="prescription-name"
            >
              {prescriptionHeader}
            </h1>
            <p
              id="last-filled"
              className="title-last-filled-on vads-u-font-family--sans vads-u-margin-top--0p5"
              data-testid="rx-last-filled-date"
            >
              {filledEnteredDate()}
            </p>
            <div className="no-print">
              <PrintDownload
                download={handleFileDownload}
                isSuccess={
                  pdfTxtGenerateStatus.status ===
                  PDF_TXT_GENERATE_STATUS.Success
                }
              />
              <BeforeYouDownloadDropdown />
            </div>
            {nonVaPrescription ? (
              <NonVaPrescription {...prescription} />
            ) : (
              <VaPrescription {...prescription} />
            )}
          </div>
          <PrintOnlyPage
            title="Medication details"
            preface="This is a single medication record from your VA medical records. When you download a medication record, we
        also include a list of allergies and reactions in your VA medical records."
          >
            <>
              <PrescriptionPrintOnly
                hideLineBreak
                rx={prescription}
                refillHistory={!nonVaPrescription ? refillHistory : []}
                isDetailsRx
              />
              <AllergiesPrintOnly
                allergies={allergies}
                allergiesError={allergiesError}
              />
            </>
          </PrintOnlyPage>
        </>
      );
    }
    return (
      <va-loading-indicator
        message={
          pdfTxtGenerateStatus.message || 'Loading your medication record...'
        }
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return <div>{content()}</div>;
};

export default PrescriptionDetails;
