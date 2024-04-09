import React from 'react';
import PropTypes from 'prop-types';

export const Auth = ({ hasRepresentative, DynamicHeader }) => {
  return (
    <>
      {hasRepresentative ? null : (
        <va-card>
          <div className="auth-no-rep-card">
            <div className="auth-no-rep-header-icon">
              <va-icon
                icon="account_circle"
                size={4}
                srtext="add some text for a screen reader to describe the icon's semantic meaning"
              />{' '}
            </div>
            <div className="auth-no-rep-text">
              <DynamicHeader className="auth-no-rep-header">
                You don’t have an accredited representative
              </DynamicHeader>
              <div className="auth-no-rep-body">
                <va-link
                  href="https://va.gov/va-accredited-representative-faqs"
                  text="Learn about accredited representatives"
                />
              </div>
            </div>
          </div>
        </va-card>
      )}
    </>
  );
};

Auth.propTypes = {
  DynamicHeader: PropTypes.string,
  hasRepresentative: PropTypes.bool,
};
