import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import environment from 'platform/utilities/environment';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/flow1.json');
  mockData = mockData?.data;
}

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { formConfig } = props.route;
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
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
