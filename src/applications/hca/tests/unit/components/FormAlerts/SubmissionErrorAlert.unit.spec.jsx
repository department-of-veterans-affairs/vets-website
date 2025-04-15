import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';

const subject = (featureToggles = {}) => {
  const getStore = () =>
    createStore(() => ({
      featureToggles,
      form: {
        data: {
          'view:veteranInformation': {
            veteranFullName: { first: 'John', last: 'Smith' },
          },
        },
      },
    }));
  const { container } = render(
    <Provider store={getStore()}>
      <SubmissionErrorAlert />
    </Provider>,
  );
  const selectors = () => ({
    vaAlert: container.querySelector('va-alert'),
    downloadLink: container.querySelector('.hca-application--download'),
  });
  return { selectors };
};

describe('hca <SubmissionErrorAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `error`', () => {
      const { selectors } = subject();
      const { vaAlert, downloadLink } = selectors();
      expect(vaAlert).to.exist;
      expect(vaAlert).to.have.attr('status', 'error');
      expect(downloadLink).to.not.exist;
    });

    it('should render download link when `hca_download_completed_pdf` is true', () => {
      const { selectors } = subject({
        // eslint-disable-next-line camelcase
        hca_download_completed_pdf: true,
      });
      const { downloadLink, vaAlert } = selectors();
      expect(vaAlert).to.exist;
      expect(downloadLink).to.exist;
    });
  });
});
