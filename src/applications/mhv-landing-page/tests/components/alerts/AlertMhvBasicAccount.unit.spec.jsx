import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertMhvBasicAccount from '../../../components/alerts/AlertMhvBasicAccount';

const { defaultProps } = AlertMhvBasicAccount;

describe('<AlertMhvBasicAccount />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByRole, getByTestId } = render(
      <AlertMhvBasicAccount {...props} />,
    );
    getByTestId(defaultProps.testId);
    getByRole('heading', { name: defaultProps.headline });
    getByRole('link', { name: /^Learn more about/ });
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
    });
  });
});
