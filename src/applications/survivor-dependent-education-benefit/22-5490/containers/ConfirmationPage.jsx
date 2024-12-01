import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import UnderReviewConfirmationFry from '../components/confirmation/UnderReviewConfirmationFry';
import UnderReviewConfirmationDEAChapter35 from '../components/confirmation/UnderReviewConfirmationDEAChapter35';

const ConfirmationPage = ({ form, claimantFullName }) => {
  const { formId, data } = form;
  const { chosenBenefit } = data;

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

  // Create a safe user name string with fallback values for each name part
  const userName = `${claimantFullName?.first ||
    ''} ${claimantFullName?.middle || ''} ${claimantFullName?.last ||
    ''} ${claimantFullName?.suffix || ''}`.trim();

  // Render the appropriate component based on the chosenBenefit value
  if (chosenBenefit === 'fry') {
    return (
      <UnderReviewConfirmationFry
        user={userName}
        dateReceived={newReceivedDate}
        formId={formId}
        printPage={printPage}
      />
    );
  }

  if (chosenBenefit === 'dea') {
    return (
      <UnderReviewConfirmationDEAChapter35
        user={userName}
        dateReceived={newReceivedDate}
        formId={formId}
        printPage={printPage}
      />
    );
  }

  // No component rendered if chosenBenefit is not 'fry' or 'dea'
  return null;
};

const mapStateToProps = state => ({
  form: state.form,
  claimantFullName: state.user?.profile?.userFullName || {}, // Provide a default empty object to avoid undefined errors
});

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      chosenBenefit: PropTypes.string, // Prop for chosen benefit
    }),
    formId: PropTypes.string,
  }).isRequired,
  claimantFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

ConfirmationPage.defaultProps = {
  claimantFullName: { first: '', middle: '', last: '', suffix: '' }, // Default values for claimantFullName parts
};

export default connect(mapStateToProps)(ConfirmationPage);
