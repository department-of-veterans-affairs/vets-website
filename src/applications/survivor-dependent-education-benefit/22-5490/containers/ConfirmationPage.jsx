import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import UnderReviewConfirmationFry from '../components/confirmation/UnderReviewConfirmationFry';
import UnderReviewConfirmationDEAChapter35 from '../components/confirmation/UnderReviewConfirmationDEAChapter35';

const ConfirmationPage = ({ form }) => {
  const { formId, data } = form;
  const { fullName, chosenBenefit } = data;

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

  // Render the appropriate component based on the chosenBenefit value
  if (chosenBenefit === 'fry') {
    return (
      <UnderReviewConfirmationFry
        user={`${fullName.first} ${fullName.middle || ''} ${
          fullName.last
        } ${fullName.suffix || ''}`}
        dateReceived={newReceivedDate}
        formId={formId}
        printPage={printPage}
      />
    );
  }

  if (chosenBenefit === 'dea') {
    return (
      <UnderReviewConfirmationDEAChapter35
        user={`${fullName.first} ${fullName.middle || ''} ${
          fullName.last
        } ${fullName.suffix || ''}`}
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
      chosenBenefit: PropTypes.string, // Prop for chosen benefit
    }),
    formId: PropTypes.string,
  }),
};

export default connect(mapStateToProps)(ConfirmationPage);
