import React from 'react';
import PropTypes from 'prop-types';

export function NoRep({ DynamicHeader }) {
  return (
    <va-card show-shadow>
      <div className="auth-card">
        <div className="auth-header-icon">
          <va-icon
            icon="account_circle"
            size={4}
            srtext="Your representative"
          />{' '}
        </div>
        <div className="auth-no-rep-text">
          <DynamicHeader className="auth-no-rep-header">
            You don’t have an accredited representative
          </DynamicHeader>
          <div className="auth-no-rep-body">
            <va-link
              href="https://www.va.gov/resources/va-accredited-representative-faqs/"
              text="Learn about accredited representatives"
            />
          </div>
        </div>
      </div>
    </va-card>
  );
}

NoRep.propTypes = {
  DynamicHeader: PropTypes.string,
};
