import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  UnauthenticatedWarningAlert,
  handleAlertMaxItems,
  handleVeteranMaxMarriagesAlert,
  handleSpouseMaxMarriagesAlert,
} from '../../../components/FormAlerts';

const createMockStore = (isLoggedIn = false) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
  }),
  subscribe: () => {},
  dispatch: sinon.spy(),
});

describe('534 EZ Form Alerts', () => {
  it('renders warning alert for unauthenticated users', () => {
    const { container } = render(
      <Provider store={createMockStore(false)}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('warning');
    expect(container.textContent).to.include('8 steps long');
  });

  it('does not render alert for authenticated users', () => {
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.not.exist;
  });

  it('dispatches toggleLoginModal action on link click', () => {
    const mockStore = createMockStore(false);
    const { getByText } = render(
      <Provider store={mockStore}>
        <UnauthenticatedWarningAlert />
      </Provider>,
    );

    const link = getByText(
      'You can sign in after you start your application. But you’ll lose any information you already filled in.',
    ).previousSibling.querySelector('va-link');
    link.click();

    expect(mockStore.dispatch.calledOnce).to.be.true;
  });

  it('renders <handleAlertMaxItems> correctly', () => {
    const { container } = render(<div>{handleAlertMaxItems()}</div>);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).to.equal(2);
    expect(listItems[0].textContent).to.include(
      'Statement in Support of Claim (VA Form 21-4138)',
    );
    expect(listItems[1].textContent).to.include(
      'Application Request to Add and/or Remove Dependents (VA Form 21-686c)',
    );

    it('renders <handleVeteranMaxMarriagesAlert> correctly', () => {
      const { maxVeteranMarriages } = render(
        <handleVeteranMaxMarriagesAlert />,
      );
      const alert = maxVeteranMarriages.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('warning');
      expect(maxVeteranMarriages.textContent).to.include(
        'You can only have up to three marriages listed on this application.',
      );
    });

    it('renders <handleSpouseMaxMarriagesAlert> correctly', () => {
      const { maxSpouseMarriages } = render(<handleSpouseMaxMarriagesAlert />);
      const alert = maxSpouseMarriages.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('warning');
      expect(maxSpouseMarriages.textContent).to.include(
        'Your spouse can only have up to three marriages listed on this application.',
      );
    });
  });
});
