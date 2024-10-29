import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

const ConfirmationPage = ({ form }) => {
  const { formId, data } = form;
  const { fullName } = data;

  // Set up scroll and focus when the component mounts
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  // Print page handler
  const printPage = useCallback(() => {
    window.print();
  }, []);

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Application for VA Education Benefits (VA Form 22-5490)</h2>
      </div>
      <h2 className="vads-u-font-size--h3">
        Your application has been submitted
      </h2>
      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">Please print this page for your records.</p>

      {/* Render the UnderReviewConfirmation component */}
      <UnderReviewConfirmation
        user={`${fullName.first} ${fullName.middle || ''} ${
          fullName.last
        } ${fullName.suffix || ''}`}
        formId={formId}
        printPage={printPage}
      />
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      }),
    }),
    formId: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(ConfirmationPage);
