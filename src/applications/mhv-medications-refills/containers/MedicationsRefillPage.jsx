import React from 'react';
import { useGetRefillablePrescriptionsQuery } from '../api/refillsApi';
import { dateFormat } from '../../mhv-medications/util/helpers';
// Import skeleton HTML as raw string
import skeletonHTML from '../components/MedicationsRefillPage.Skeleton.html';

/**
 * MedicationsRefillPage component
 * Main page for viewing and managing prescription refills
 * Uses RTK Query hook to access data that was prefetched by the loader
 */
const MedicationsRefillPage = () => {
  // RTK Query hook - data should already be in cache from loader
  // isLoading will be false on initial render due to prefetch
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetRefillablePrescriptionsQuery();

  if (isError) {
    return (
      <div className="usa-alert usa-alert-error" role="alert">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">Error loading prescriptions</h3>
          <p className="usa-alert-text">
            {error?.message ||
              'Unable to load your refillable prescriptions. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  // Show skeleton HTML while fetching data
  if (isLoading) {
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: skeletonHTML }} />;
  }

  const prescriptions = data?.prescriptions || [];

  return (
    <div className="usa-grid">
      <div className="medications-refills-page">
        <h1>Refill prescriptions</h1>
        <p className="vads-u-margin-top--2">
          Bring your medications list to each appointment. And tell your
          provider about any new allergies or reactions. If you use Meds by
          Mail, you can also call your servicing center and ask them to update
          your records.
        </p>

        {prescriptions.length === 0 ? (
          <div className="usa-alert usa-alert-info">
            <div className="usa-alert-body">
              <h3 className="usa-alert-heading">No refillable prescriptions</h3>
              <p className="usa-alert-text">
                You don’t have any prescriptions available for refill at this
                time.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              data-testid="prescription-list"
              className="vads-u-margin-top--3"
            >
              {prescriptions.map(prescription => {
                const attrs = prescription.attributes || {};
                return (
                  <div
                    key={prescription.id || attrs.prescriptionId}
                    className="vads-u-background-color--white vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--base-dark vads-u-padding--2"
                    data-testid="prescription-card"
                    data-dd-privacy="mask"
                  >
                    <p
                      data-testid="prescription-name"
                      className="vads-u-font-weight--bold vads-u-margin--0"
                    >
                      {attrs.prescriptionName || 'Prescription'}
                    </p>
                    <p data-testid="prescription-number" data-dd-privacy="mask">
                      Prescription number: {attrs.prescriptionNumber}
                    </p>
                    <p data-testid="refills-left">
                      {attrs.refillRemaining !== undefined
                        ? attrs.refillRemaining
                        : 'Not available'}
                    </p>
                    {attrs.expirationDate && (
                      <p data-testid="expiration-date">
                        {dateFormat(
                          attrs.expirationDate,
                          'MMMM D, YYYY',
                          'Date not available',
                        )}
                      </p>
                    )}
                    {attrs.facilityName && (
                      <p data-testid="facility-name">{attrs.facilityName}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <va-button
              text="Request refills"
              primary
              className="vads-u-margin-top--3"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationsRefillPage;
