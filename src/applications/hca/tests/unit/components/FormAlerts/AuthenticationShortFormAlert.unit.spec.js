import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as recordEventModule from 'platform/monitoring/record-event';
import AuthenticatedShortFormAlert from '../../../../components/FormAlerts/AuthenticatedShortFormAlert';

describe('hca <AuthenticatedShortFormAlert>', () => {
  const getData = () => ({
    mockStore: {
      getState: () => {},
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <AuthenticatedShortFormAlert />
      </Provider>,
    );
    const selectors = {
      alert: container.querySelector('va-alert-expandable'),
    };
    return { selectors };
  };
  let mockStore;

  beforeEach(() => {
    mockStore = getData().mockStore;
  });

  it('should render `va-alert-expandable` with status of `success`', () => {
    const { selectors } = subject({ mockStore });
    expect(selectors.alert).to.exist;
    expect(selectors.alert).to.have.attr('status', 'success');
  });

  it('should fire the `recordEvent` method to log the interaction to analytics', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    subject({ mockStore });

    await waitFor(() => {
      const data = { event: 'hca-short-form-flow' };
      expect(recordEventStub.calledWith(data)).to.be.true;
      recordEventStub.restore();
    });
  });
});
