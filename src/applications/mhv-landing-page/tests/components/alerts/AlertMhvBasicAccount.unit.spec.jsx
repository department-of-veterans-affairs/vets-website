import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertMhvBasicAccount from '../../../components/alerts/AlertMhvBasicAccount';

const { defaultProps } = AlertMhvBasicAccount;

const mockStore = createMockStore([]);

describe('<AlertMhvBasicAccount />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByRole, getByTestId } = render(
      <Provider store={mockStore()}>
        <AlertMhvBasicAccount {...props} />,
      </Provider>,
    );
    getByTestId(defaultProps.testId);

    getByRole('heading', { name: defaultProps.headline });
    expect(getByRole('button', { name: /Verify with ID.me/ })).to.exist;
    expect(getByRole('button', { name: /Verify with Login.gov/ })).to.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
