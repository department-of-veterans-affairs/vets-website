import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaPagination,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useGetPrescriptionsListQuery } from '../api/prescriptionsApi';
import { rxListSortingOptions } from '../util/constants';
import { dateFormat, validateField } from '../util/helpers';

const PrescriptionsList = ({
  sortOption = rxListSortingOptions.alphabeticalOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const { data, error, isLoading, isFetching } = useGetPrescriptionsListQuery({
    page: currentPage,
    perPage,
    sortEndpoint: sortOption.API_ENDPOINT,
  });

  const handlePageChange = e => {
    setCurrentPage(e.detail.page);
  };

  if (isLoading) {
    return (
      <div className="vads-u-margin-y--4">
        <VaLoadingIndicator message="Loading your prescriptions..." setFocus />
      </div>
    );
  }

  if (error) {
    return (
      <div className="usa-alert usa-alert-error" role="alert">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">Unable to load prescriptions</h3>
          <p className="usa-alert-text">
            We’re sorry. Something went wrong on our end. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  const { prescriptions = [], pagination = {} } = data || {};
  const totalPages = pagination.totalPages || 1;

  return (
    <div data-testid="prescriptions-list">
      <h2>Your prescriptions</h2>

      {isFetching && (
        <div className="vads-u-margin-y--2">
          <VaLoadingIndicator
            message="Updating your prescriptions..."
            setFocus
          />
        </div>
      )}

      {prescriptions.length === 0 && !isFetching ? (
        <p>No prescriptions found.</p>
      ) : (
        <>
          <table className="usa-table-borderless va-table-sortable vads-u-margin-top--2">
            <thead>
              <tr>
                <th scope="col">Medication name</th>
                <th scope="col">Status</th>
                <th scope="col">Last filled</th>
                <th scope="col">Refills left</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(prescription => (
                <tr
                  key={prescription.prescriptionId}
                  data-testid="prescription-row"
                >
                  <td>{prescription.prescriptionName}</td>
                  <td>{prescription.dispStatus}</td>
                  <td>
                    {prescription.sortedDispensedDate
                      ? dateFormat(
                          prescription.sortedDispensedDate,
                          'MMMM D, YYYY',
                        )
                      : 'Not filled yet'}
                  </td>
                  <td>{validateField(prescription.refillRemaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <VaPagination
              onPageSelect={handlePageChange}
              page={currentPage}
              pages={totalPages}
              className="vads-u-justify-content--center vads-u-margin-top--3"
              uswds
            />
          )}
        </>
      )}
    </div>
  );
};

PrescriptionsList.propTypes = {
  sortOption: PropTypes.shape({
    API_ENDPOINT: PropTypes.string.isRequired,
    LABEL: PropTypes.string.isRequired,
  }),
};

export default PrescriptionsList;
