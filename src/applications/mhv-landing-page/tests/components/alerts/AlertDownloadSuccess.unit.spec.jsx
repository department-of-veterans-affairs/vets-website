import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertDownloadSuccess from '../../../components/alerts/AlertDownloadSuccess';

const { defaultProps } = AlertDownloadSuccess;

describe('<AlertDownloadSuccess />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByTestId } = render(<AlertDownloadSuccess {...props} />);
    getByTestId(defaultProps.testId);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
