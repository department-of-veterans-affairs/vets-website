import React from 'react';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect, useSelector } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'You’ve submitted your personal records request',
  nextStepsText:
    'After we review your request, we’ll contact you to tell you what happens next in the request process.',
};

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const useConfirmationPageV2 = useSelector(
    state =>
      toggleValues(state)[FEATURE_FLAG_NAMES.confirmationPageNew] || false,
  );
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  if (useConfirmationPageV2) {
    return (
      <ConfirmationView
        formConfig={props.route?.formConfig}
        submitDate={submitDate}
        confirmationNumber={confirmationNumber}
        devOnly={{
          showButtons: true,
        }}
      />
    );
  }

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={form.data.fullName}
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
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
