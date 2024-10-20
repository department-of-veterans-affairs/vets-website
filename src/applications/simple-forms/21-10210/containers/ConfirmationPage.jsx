import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import environment from 'platform/utilities/environment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { ConfirmationPageView as OldConfirmationPageView } from '../../shared/components/ConfirmationPageView';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../definitions/constants';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/flow1.json');
  mockData = mockData?.data;
}

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
  headlineText: 'You’ve successfully submitted your Lay or Witness Statement',
  nextStepsText:
    'Once we’ve reviewed your submission, a coordinator will contact you to discuss next steps.',
};

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const showNewConfirmationPage = useSelector(
    state =>
      toggleValues(state)[FEATURE_FLAG_NAMES.confirmationPageNew] || false,
  );
  const { formConfig } = props.route;
  const { submission } = form;
  const preparerFullName = getPreparerFullName(form.data);
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return showNewConfirmationPage ? (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={formConfig}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
        mockData,
      }}
    />
  ) : (
    <OldConfirmationPageView
      submitterName={preparerFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      formConfig={formConfig}
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
  route: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
