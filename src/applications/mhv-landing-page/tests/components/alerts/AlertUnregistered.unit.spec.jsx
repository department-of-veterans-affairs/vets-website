import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertUnregistered, {
  defaultProps,
} from '../../../components/alerts/AlertUnregistered';

describe('<AlertUnregistered />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByTestId } = render(<AlertUnregistered {...props} />);
    getByTestId('mhv-alert--unregistered');
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
