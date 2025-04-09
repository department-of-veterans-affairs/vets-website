import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  updatePageTitle,
  reportGeneratedBy,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  getPrescriptionDetails,
  getAllergiesList,
} from '../actions/prescriptions';
import PrintOnlyPage from './PrintOnlyPage';
import {
  dateFormat,
  generateMedicationsPDF,
  generateTextFile,
  getErrorTypeFromFormat,
  pharmacyPhoneNumber,
} from '../util/helpers';
import PrintDownload from '../components/shared/PrintDownload';
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
import { PDF_TXT_GENERATE_STATUS, DOWNLOAD_FORMAT } from '../util/constants';
import PrescriptionPrintOnly from '../components/PrescriptionDetails/PrescriptionPrintOnly';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';
import { Actions } from '../util/actionTypes';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import { pageType } from '../util/dataDogConstants';
import { selectGroupingFlag } from '../util/selectors';

const PrescriptionDetails = () => {
  const prescription = useSelector(
    state => state.rx.prescriptions?.prescriptionDetails,
  );
  const prescriptionsApiError = useSelector(
    state => state.rx.prescriptions?.apiError,
  );
  const nonVaPrescription = prescription?.prescriptionSource === 'NV';
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);
  const allergies = useSelector(state => state.rx.allergies?.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const { prescriptionId } = useParams();
  const [prescriptionPdfList, setPrescriptionPdfList] = useState([]);
  const [pdfTxtGenerateStatus, setPdfTxtGenerateStatus] = useState({
    status: PDF_TXT_GENERATE_STATUS.NotStarted,
    format: undefined,
  });
  const showGroupingContent = useSelector(selectGroupingFlag);
  const dispatch = useDispatch();

  const prescriptionHeader =
    prescription?.prescriptionName ||
    (prescription?.dispStatus === 'Active: Non-VA'
      ? prescription?.orderableItem
      : '');
  const refillHistory = [...(prescription?.rxRfRecords || [])];
  refillHistory.push({
    prescriptionName: prescription?.prescriptionName,
    dispensedDate: prescription?.dispensedDate,
    cmopNdcNumber: prescription?.cmopNdcNumber,
    id: prescription?.prescriptionId,
  });

  useEffect(
    () => {
      if (prescription) {
        focusElement(document.querySelector('h1'));
        updatePageTitle('Medications details | Veterans Affairs');
      } else {
        window.scrollTo(0, 0);
      }
    },
    [prescription],
  );

  const baseTitle = 'Medications | Veterans Affairs';
  usePrintTitle(baseTitle, userName, dob, updatePageTitle);

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
              preface: [
                {
                  value:
                    'We couldn’t access your allergy records when you downloaded this list. We’re sorry. There was a problem with our system. Try again later. If it still doesn’t work, call us at 877-327-0022 (TTY: 711). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
                },
              ],
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
      if (!prescription && prescriptionId)
        dispatch(getPrescriptionDetails(prescriptionId));
    },
    [prescriptionId, dispatch, prescription],
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
        } else {
          setPdfTxtGenerateStatus({
            status: PDF_TXT_GENERATE_STATUS.NotStarted,
            format: 'print',
          });
        }
      }
      if (
        allergies &&
        pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.NotStarted &&
        pdfTxtGenerateStatus.format === 'print'
      ) {
        window.print();
      }
    },
    [allergies, pdfTxtGenerateStatus, generatePDF, generateTXT],
  );

  useEffect(
    () => {
      if (!prescription) return;
      setPrescriptionPdfList(
        nonVaPrescription
          ? buildNonVAPrescriptionPDFList(prescription)
          : buildVAPrescriptionPDFList(prescription),
      );
    },
    [nonVaPrescription, prescription],
  );

  const filledEnteredDate = () => {
    if (nonVaPrescription) {
      return (
        <>
          Documented on {dateFormat(prescription?.orderedDate, 'MMMM D, YYYY')}
        </>
      );
    }
    return (
      <>
        {prescription?.sortedDispensedDate ? (
          <span>
            Last filled on{' '}
            {dateFormat(prescription.sortedDispensedDate, 'MMMM D, YYYY')}
          </span>
        ) : (
          <span>Not filled yet</span>
        )}
      </>
    );
  };

  const isErrorNotificationVisible = Boolean(
    pdfTxtGenerateStatus.status === PDF_TXT_GENERATE_STATUS.InProgress &&
      allergiesError,
  );
  const hasPrintError =
    prescription && !prescriptionsApiError && !allergiesError;

  const pendingMedAlert = () => {
    const { orderedDate } = prescription;
    const { pendingMed } = prescription;
    const orderedMoreThanSevenDaysAgo = () => {
      const today = new Date();
      const eightDaysLater = new Date(orderedDate);
      eightDaysLater.setDate(eightDaysLater.getDate() + 8);

      return today > eightDaysLater;
    };
    return (
      <>
        <VaAlert
          visible={pendingMed}
          id="pending-med"
          status={`${orderedMoreThanSevenDaysAgo() ? 'warning' : 'info'}`}
          setFocus
          className={
            pendingMed
              ? 'vads-u-margin-y--1 vads-u-margin-bottom--3'
              : 'vads-u-margin-bottom--3'
          }
        >
          <h2
            className="vads-u-margin-y--0 vads-u-font-size--h3"
            data-testid="pending-med-alert"
          >
            {orderedMoreThanSevenDaysAgo()
              ? 'Your VA pharmacy is still reviewing this prescription'
              : 'Your VA pharmacy is reviewing this prescription'}
          </h2>
          <p>
            {orderedMoreThanSevenDaysAgo()
              ? 'This pharmacy review is taking longer than expected.'
              : 'It may take 24-72 hours to review. And the prescription details may change. Check back for updates.'}
          </p>
          <p>
            If you need this prescription now, call your VA pharmacy
            {pharmacyPhoneNumber(prescription) && (
              <>
                {' '}
                at{' '}
                <va-telephone
                  contact={pharmacyPhoneNumber(prescription)}
                  not-clickable
                />{' '}
                (<va-telephone tty contact="711" not-clickable />)
              </>
            )}
            .
          </p>
        </VaAlert>
      </>
    );
  };

  const content = () => {
    if (prescription || prescriptionsApiError) {
      return (
        <div>
          <div className="no-print">
            <h1
              aria-describedby="last-filled"
              data-testid="prescription-name"
              className="vads-u-margin-bottom--0 wrap-text"
              id="prescription-name"
              data-dd-privacy="mask"
            >
              {prescriptionHeader}
            </h1>
            {prescriptionsApiError ? (
              <ApiErrorNotification errorType="access" content="medications" />
            ) : (
              <>
                <p
                  id="last-filled"
                  className={`title-last-filled-on vads-u-font-family--sans vads-u-margin-top--2 medium-screen:${
                    showGroupingContent
                      ? 'vads-u-margin-bottom--3 vads-u-margin-bottom--2'
                      : 'vads-u-margin-bottom--4 vads-u-margin-bottom--3'
                  }`}
                  data-testid="rx-last-filled-date"
                >
                  {filledEnteredDate()}
                </p>
                {prescription.prescriptionSource === 'PD' && pendingMedAlert()}
                {isErrorNotificationVisible && (
                  <ApiErrorNotification
                    errorType={getErrorTypeFromFormat(
                      pdfTxtGenerateStatus.format,
                    )}
                    content="records"
                  >
                    <p>
                      If it still doesn’t work, call us at{' '}
                      <va-telephone contact="8773270022" /> (
                      <va-telephone contact={CONTACTS[711]} tty />
                      ). We’re here Monday through Friday, 8:00 a.m. to 8:00
                      p.m. ET.
                    </p>
                  </ApiErrorNotification>
                )}
                {/* TODO: clean after grouping flag is gone */}
                {showGroupingContent && (
                  <>
                    {nonVaPrescription ? (
                      <NonVaPrescription {...prescription} />
                    ) : (
                      <VaPrescription {...prescription} />
                    )}
                  </>
                )}
                {/* TODO: clean after grouping flag is gone */}
                <div
                  className={`no-print${
                    showGroupingContent
                      ? ' vads-u-margin-top--3 vads-u-margin-bottom--5'
                      : ''
                  }`}
                >
                  {/* TODO: clean after grouping flag is gone */}
                  {showGroupingContent && (
                    <>
                      <div className="vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-y--3 medium-screen:vads-u-margin-y--4" />
                      <BeforeYouDownloadDropdown page={pageType.DETAILS} />
                    </>
                  )}
                  <PrintDownload
                    onDownload={handleFileDownload}
                    isSuccess={
                      pdfTxtGenerateStatus.status ===
                      PDF_TXT_GENERATE_STATUS.Success
                    }
                    isLoading={
                      !allergiesError &&
                      pdfTxtGenerateStatus.status ===
                        PDF_TXT_GENERATE_STATUS.InProgress
                    }
                  />
                  {/* TODO: clean after grouping flag is gone */}
                  {!showGroupingContent && (
                    <BeforeYouDownloadDropdown page={pageType.DETAILS} />
                  )}
                </div>
                {/* TODO: clean after grouping flag is gone */}
                {!showGroupingContent && (
                  <>
                    {nonVaPrescription ? (
                      <NonVaPrescription {...prescription} />
                    ) : (
                      <VaPrescription {...prescription} />
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <PrintOnlyPage
            title="Medication details"
            hasError={!hasPrintError}
            preface={
              hasPrintError
                ? 'This is a single medication record from your VA medical records. When you download a medication record, we also include a list of allergies and reactions in your VA medical records.'
                : undefined
            }
          >
            <PrescriptionPrintOnly
              rx={prescription}
              refillHistory={!nonVaPrescription ? refillHistory : []}
              isDetailsRx
            />
            <AllergiesPrintOnly allergies={allergies} />
          </PrintOnlyPage>
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading your medication record..."
        set-focus
        data-testid="loading-indicator"
      />
    );
  };

  return <div>{content()}</div>;
};

export default PrescriptionDetails;
