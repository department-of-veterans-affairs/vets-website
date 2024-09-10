import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertVerifyAndRegister from '../../../components/alerts/AlertVerifyAndRegister';

const { defaultProps } = AlertVerifyAndRegister;

describe('<AlertVerifyAndRegister />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId } = render(<AlertVerifyAndRegister {...props} />);
    getByTestId(defaultProps.testId);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
