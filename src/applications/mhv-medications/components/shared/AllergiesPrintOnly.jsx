import React from 'react';
import PropTypes from 'prop-types';
import { validateField } from '../../util/helpers';

const AllergiesPrintOnly = props => {
  const { allergies } = props;

  const content = () => {
    return (
      <>
        {allergies?.length > 0 ? (
          <>
            <div>
              <div className="vads-u-margin-bottom--1">
                This list includes all allergies, reactions, and side effects in
                your VA medical records. This includes medication side effects
                (also called adverse drug reactions). If you have allergies or
                reactions that are missing from this list, tell your care team
                at your next appointment.
              </div>
              Showing {allergies.length} records from newest to oldest
            </div>
            <div>
              {allergies?.map(allergy => (
                <div key={allergy.id}>
                  <div className="print-only-rx-details-container">
                    <h3>{allergy.name}</h3>
                    <div className="print-only-rx-details-container">
                      <p>
                        <strong>Date entered:</strong>{' '}
                        {validateField(allergy.date)}
                        <br />
                        <strong>Signs and symptoms:</strong>{' '}
                        {allergy?.reaction?.length > 0 ? (
                          allergy?.reaction?.map(
                            (reaction, idx) =>
                              idx === 0 ? (
                                <span key={idx}>{reaction}</span>
                              ) : (
                                <span key={idx}>, {reaction}</span>
                              ),
                          )
                        ) : (
                          <span>None noted</span>
                        )}
                        <br />
                        <strong>Type of allergy:</strong>{' '}
                        {validateField(allergy.type)}
                        <br />
                        <strong>Location:</strong>{' '}
                        {validateField(allergy.location)}
                        <br />
                        <strong>Observed or historical:</strong>{' '}
                        {validateField(allergy.observedOrReported)}
                        <br />
                        <strong>Provider notes:</strong>{' '}
                        {validateField(allergy.notes)}
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div data-testid="no-allergies-message">
            There are no allergies or reactions in your VA medical records. If
            you have allergies or reactions that are missing from your records,
            tell your care team at your next appointment.
          </div>
        )}
      </>
    );
  };

  return (
    <div className="print-only print-only-rx-container vads-u-border-top--1px vads-u-border-color--black">
      <h2>Allergies</h2>
      {content()}
    </div>
  );
};

export default AllergiesPrintOnly;

AllergiesPrintOnly.propTypes = {
  allergies: PropTypes.array,
  allergiesError: PropTypes.bool,
};
