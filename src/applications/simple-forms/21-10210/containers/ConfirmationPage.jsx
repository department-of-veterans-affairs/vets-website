import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

const getPreparerFullName = formData => {
  const { claimOwnership, claimantType } = formData;
  let fullName = formData.veteranFullName; // Flow 1: self claim, vet claimant

  if (claimOwnership && claimOwnership === CLAIM_OWNERSHIPS.SELF) {
    if (claimantType && claimantType === CLAIMANT_TYPES.NON_VETERAN) {
      // Flow 3: self claim, non-vet claimant
      fullName = formData.claimantFullName;
    }
  } else {
    // Flows 2 & 4: third-party claim
    fullName = formData.witnessFullName;
  }

  return fullName;
};

const content = {
  headlineText: 'You’ve successfully submitted your Lay or Witness Statement.',
  nextStepsText:
    'Once we’ve reviewed your submission, a coordinator will contact you to discuss next steps.',
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const preparerFullName = getPreparerFullName(form.data);
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterName={preparerFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        attributes: PropTypes.shape({
          confirmationNumber: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      timestamp: PropTypes.string.isRequired,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
