import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertUnregistered from '../../../components/alerts/AlertUnregistered';

const { defaultProps } = AlertUnregistered;

describe('<AlertUnregistered />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByTestId } = render(<AlertUnregistered {...props} />);
    getByTestId(defaultProps.testId);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
