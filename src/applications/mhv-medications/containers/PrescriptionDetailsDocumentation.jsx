import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { getDocumentation } from '../api/rxApi';
import { getPrescriptionDetails } from '../actions/prescriptions';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';

const PrescriptionDetailsDocumentation = () => {
  const prescription = useSelector(
    state => state.rx.prescriptions.prescriptionDetails,
  );
  const isDisplayingDocumentation = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent
      ],
  );
  const hasPrescriptionsApiError = useSelector(
    state => state.rx.prescriptions?.apiError,
  );
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState(null);
  const [hasDocumentationApiError, setHasDocumentationApiError] = useState(
    false,
  );
  const [loading, setLoading] = useState(false);
  const { prescriptionId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const ndcNumber = queryParams.get('ndc');
  const isMissingPrescriptionId =
    prescriptionId === undefined || prescriptionId === null;
  useEffect(
    () => {
      if (!isMissingPrescriptionId && ndcNumber) {
        setLoading(true);
        getDocumentation(prescriptionId, ndcNumber)
          .then(response => {
            setHtmlContent(response.data);
            setLoading(false);
            setHasDocumentationApiError(false);
          })
          .catch(() => {
            setLoading(false);
            setHasDocumentationApiError(true);
          });
      }
    },
    [prescriptionId, ndcNumber, isMissingPrescriptionId],
  );
  useEffect(
    () => {
      if (!prescription && !isMissingPrescriptionId && ndcNumber) {
        dispatch(getPrescriptionDetails(prescriptionId));
      }
    },
    [
      prescriptionId,
      dispatch,
      prescription,
      ndcNumber,
      isMissingPrescriptionId,
    ],
  );

  if (!isDisplayingDocumentation) {
    return <PageNotFound />;
  }
  if (!hasPrescriptionsApiError && (isMissingPrescriptionId || !prescription)) {
    return (
      <va-loading-indicator
        message="Getting medication documentation..."
        set-focus
        data-testid="documentation-loader"
        class="vads-u-margin-top--4"
      />
    );
  }
  if (hasDocumentationApiError) {
    return (
      <div className="vads-u-margin-top--1">
        <ApiErrorNotification
          errorType="access"
          content="medication documentation"
        />
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <va-loading-indicator message="Loading documentation..." set-focus />
      ) : (
        <div>
          <h1>Medication Documentation: {prescription?.prescriptionName}</h1>
          <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter vads-u-margin-y--5" />
          <p className="vads-u-color--secondary vads-u-font-family--serif">
            Important: How to Use This Information
          </p>
          <p className="vads-u-font-family--serif vads-u-margin-bottom--2p5">
            This is a summary and does NOT have all possible information about
            this product. This information does not assure that this product is
            safe, effective, or appropriate for you. This information is not
            individual medical advice and does not substitute for the advice of
            your health care professional. Always ask your health care
            professional for complete information about this product and your
            specific health needs.
          </p>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: htmlContent ?? '' }} />
        </div>
      )}
    </>
  );
};

export default PrescriptionDetailsDocumentation;
