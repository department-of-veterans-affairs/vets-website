import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { scrollToTop } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useSelector, useDispatch } from 'react-redux';
import { getDocumentation } from '../api/rxApi';
import { getPrescriptionDetails } from '../actions/prescriptions';

const PrescriptionDetailsDocumentation = () => {
  const prescription = useSelector(
    state => state.rx.prescriptions.prescriptionDetails,
  );
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { prescriptionId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const ndcNumber = queryParams.get('ndc');
  useEffect(
    () => {
      if (prescriptionId && ndcNumber) {
        setLoading(true);
        getDocumentation(prescriptionId, ndcNumber)
          .then(response => {
            scrollToTop();
            setHtmlContent(response.data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    [prescriptionId, ndcNumber],
  );
  useEffect(
    () => {
      if (!prescription && prescriptionId && ndcNumber)
        dispatch(getPrescriptionDetails(prescriptionId));
    },
    [prescriptionId, dispatch, prescription, ndcNumber],
  );
  if (!prescription) {
    return null;
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
          <p className="vads-u-font-family--serif">
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
