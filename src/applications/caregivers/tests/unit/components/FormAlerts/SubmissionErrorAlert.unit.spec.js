import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SubmissionErrorAlert from '../../../../components/FormAlerts/SubmissionErrorAlert';

describe('CG <SubmissionErrorAlert>', () => {
  const getData = () => ({
    mockStore: {
      getState: () => ({
        form: {
          submission: {
            response: undefined,
            timestamp: undefined,
          },
          data: { veteranFullName: {} },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <SubmissionErrorAlert />
      </Provider>,
    );
    const selectors = {
      wrapper: container.querySelector('.caregiver-error-message'),
      download: container.querySelector('.caregiver-application--download'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.download).to.not.be.empty;
  });
});
