import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/default.json');
  mockData = mockData?.data;
}

const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;
  const pdfUrl = submission.response?.pdfUrl;

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={route.formConfig}
      pdfUrl={pdfUrl}
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
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export default ConfirmationPage;

ConfirmationPage.propTypes = {
  route: PropTypes.object,
};
