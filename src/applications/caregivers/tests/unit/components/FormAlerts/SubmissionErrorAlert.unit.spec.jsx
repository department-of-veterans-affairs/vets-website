import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';

describe('CG <SubmissionErrorAlert>', () => {
  const subject = () => {
    const mockStore = {
      getState: () => ({
        form: {
          submission: { response: undefined, timestamp: undefined },
          data: { veteranFullName: {} },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <SubmissionErrorAlert />
      </Provider>,
    );
    const selectors = () => ({
      download: container.querySelector('.caregiver-application--download'),
      vaAlert: container.querySelector('va-alert[status="error"]'),
    });
    return { container, selectors };
  };

  it('should render content and download application container', () => {
    const { selectors } = subject();
    const { download, vaAlert } = selectors();
    expect(vaAlert).to.not.be.empty;
    expect(download).to.not.be.empty;
  });
});
