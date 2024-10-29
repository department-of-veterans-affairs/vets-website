import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

const ConfirmationPage = ({ form }) => {
  const { formId, data } = form;
  const { fullName } = data;
  // Set a default received date to today's date if claimStatus is not available
  const newReceivedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Set up scroll and focus when the component mounts
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  // Print page handler
  const printPage = useCallback(() => {
    window.print();
  }, []);

  // Render the UnderReviewConfirmation component with the default date
  return (
    <UnderReviewConfirmation
      user={`${fullName.first} ${fullName.middle || ''} ${
        fullName.last
      } ${fullName.suffix || ''}`}
      dateReceived={newReceivedDate} // Pass the default date
      formId={formId}
      printPage={printPage}
    />
  );
};

const mapStateToProps = state => ({
  form: state.form,
});

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

export default connect(mapStateToProps)(ConfirmationPage);
