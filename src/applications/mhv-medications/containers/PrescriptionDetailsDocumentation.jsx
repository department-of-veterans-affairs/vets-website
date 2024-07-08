import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { getDocumentation } from '../api/rxApi';
import { getPrescriptionDetails } from '../actions/prescriptions';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import { sanitizeKramesHtmlStr } from '../util/helpers';

const PrescriptionDetailsDocumentation = () => {
  const { prescriptionId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const ndcNumber = queryParams.get('ndc');
  const contentRef = useRef();
  const {
    prescription,
    isDisplayingDocumentation,
    hasPrescriptionApiError,
  } = useSelector(state => ({
    prescription: state.rx.prescriptions.prescriptionDetails,
    isDisplayingDocumentation:
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
    hasPrescriptionApiError: state.rx.prescriptions?.apiError,
  }));

  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState(null);
  const [hasDocApiError, setHasDocApiError] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isLoadingRx, setIsLoadingRx] = useState(false);
  useEffect(
    () => {
      if (prescriptionId && ndcNumber) {
        setIsLoadingDoc(true);
        getDocumentation(prescriptionId, ndcNumber)
          .then(response => {
            setHasDocApiError(false);
            setHtmlContent(sanitizeKramesHtmlStr(response.data));
          })
          .catch(() => {
            setHasDocApiError(true);
          })
          .finally(() => {
            setIsLoadingDoc(false);
          });
      }
    },
    [prescriptionId, ndcNumber],
  );

  useEffect(
    () => {
      if (!prescription && prescriptionId && ndcNumber) {
        setIsLoadingRx(true);
        dispatch(getPrescriptionDetails(prescriptionId));
      } else if (prescription && prescriptionId && ndcNumber && isLoadingRx) {
        setIsLoadingRx(false);
      }
    },
    [prescriptionId, ndcNumber, prescription, dispatch, isLoadingRx],
  );

  useEffect(
    () => {
      if (!isLoadingDoc && !hasDocApiError && !isLoadingRx && htmlContent) {
        contentRef.current.innerHTML = htmlContent ?? '';
      }
    },
    [isLoadingDoc, isLoadingRx, hasDocApiError, htmlContent],
  );

  if (!isDisplayingDocumentation) {
    return <PageNotFound />;
  }
  if (hasDocApiError || hasPrescriptionApiError) {
    return (
      <div className="vads-u-margin-top--1">
        <ApiErrorNotification
          errorType="access"
          content="medication information"
        />
      </div>
    );
  }

  return (
    <>
      {isLoadingDoc || isLoadingRx || !htmlContent ? (
        <va-loading-indicator message="Loading information..." set-focus />
      ) : (
        <div>
          <h1>Information: {prescription?.prescriptionName}</h1>
          <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter vads-u-margin-y--5" />
          <p className="vads-u-color--secondary vads-u-font-family--serif">
            Important: How to Use This Information
          </p>
          <p className="vads-u-font-family--serif">
            This is a summary and does NOT have all possible information about
            this product. This information does not assure that this product is
            safe, effective, or appropriate for you. This information is not
            individual medical advice and does not substitute for the advice of
            your health care professional. Always ask your health care
            professional for complete information about this product and your
            specific health needs.
          </p>
        </div>
      )}
      {/* NOTE: The HTML content comes from a reliable source (MHV API/Krames API) */}
      <div ref={contentRef} />
    </>
  );
};

export default PrescriptionDetailsDocumentation;
