import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as recordEventModule from 'platform/monitoring/record-event';
import RegistrationOnlyAlert from '../../../../components/FormAlerts/RegistrationOnlyAlert';

describe('hca <RegisrationOnlyAlert>', () => {
  const getData = ({ headingLevel = undefined, loggedIn = false }) => ({
    mockStore: {
      getState: () => ({
        user: { login: { currentlyLoggedIn: loggedIn } },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
    props: { headingLevel },
  });
  const subject = ({ props, mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <RegistrationOnlyAlert {...props} />
      </Provider>,
    );
    const selectors = () => ({
      h1: container.querySelectorAll('h1, h2'),
      h3: container.querySelectorAll('h3, h4'),
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors };
  };

  it('should render with default heading level when prop is undefined', () => {
    const { props, mockStore } = getData({});
    const { selectors } = subject({ props, mockStore });
    const { vaAlert, h3 } = selectors();
    expect(vaAlert).to.exist;
    expect(h3.length).to.be.greaterThan(1);
  });

  it('should render with correct heading level when prop is defined', () => {
    const { props, mockStore } = getData({ headingLevel: 1 });
    const { selectors } = subject({ props, mockStore });
    const { vaAlert, h1 } = selectors();
    expect(vaAlert).to.exist;
    expect(h1.length).to.be.greaterThan(1);
  });

  it('should fire the `recordEvent` method with the correct event data when the user is `logged out`', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { mockStore } = getData({});
    subject({ mockStore });

    await waitFor(() => {
      const data = {
        event: 'hca-reg-only-flow',
        'user-auth-status': 'logged out',
      };
      expect(recordEventStub.calledWith(data)).to.be.true;
      recordEventStub.restore();
    });
  });

  it('should fire the `recordEvent` method with the correct event data when the user is `logged in`', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { mockStore } = getData({ loggedIn: true });
    subject({ mockStore });

    await waitFor(() => {
      const data = {
        event: 'hca-reg-only-flow',
        'user-auth-status': 'logged in',
      };
      expect(recordEventStub.calledWith(data)).to.be.true;
      recordEventStub.restore();
    });
  });
});
