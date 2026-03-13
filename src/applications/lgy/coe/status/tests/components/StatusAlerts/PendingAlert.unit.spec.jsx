import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { PendingAlert } from '../../../components/StatusAlerts/PendingAlert';

const defaultProps = {
  referenceNumber: '18959346',
  requestDate: 1722543158000,
};

describe('PendingAlert', () => {
  const mockStore = configureStore([]);
  const store = mockStore({});

  it('should display reference number and request date', () => {
    const { container } = render(
      <Provider store={store}>
        <PendingAlert {...defaultProps} />
      </Provider>,
    );
    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(container.textContent).to.contain('18959346');
    expect(container.textContent).to.contain('August 1, 2024');
  });
});
