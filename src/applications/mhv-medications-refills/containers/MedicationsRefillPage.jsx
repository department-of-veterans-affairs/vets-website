import React from 'react';
import { useGetRefillablePrescriptionsQuery } from '../api/refillsApi';
import MedicationsRefillPageSkeleton from '../components/MedicationsRefillPage.Skeleton';

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

  // Show skeleton while loading (provides better UX than loading spinner)
  if (isLoading) {
    return <MedicationsRefillPageSkeleton />;
  }

  const prescriptions = data?.prescriptions || [];

  return (
    <div className="medications-refills-page">
      <h1>Refill prescriptions</h1>

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
          <div data-testid="prescription-list" className="vads-u-margin-top--3">
            {prescriptions.map(prescription => (
              <div
                key={prescription.id || prescription.attributes?.prescriptionId}
                className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
              >
                <h3 className="vads-u-margin-top--0">
                  {prescription.attributes?.prescriptionName || 'Prescription'}
                </h3>
                <p className="vads-u-margin-bottom--0">
                  <strong>Prescription number:</strong>{' '}
                  {prescription.attributes?.prescriptionNumber}
                </p>
                {prescription.attributes?.refillRemaining !== undefined && (
                  <p className="vads-u-margin-bottom--0">
                    <strong>Refills remaining:</strong>{' '}
                    {prescription.attributes?.refillRemaining}
                  </p>
                )}
              </div>
            ))}
          </div>

          <va-button
            text="Request refills"
            primary
            className="vads-u-margin-top--3"
          />
        </>
      )}
    </div>
  );
};

export default MedicationsRefillPage;
