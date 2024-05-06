import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import UnregisteredAlert from '../../components/UnregisteredAlert';

const defaultHeadline = UnregisteredAlert.defaultProps.headline;

describe('UnregisteredAlert', () => {
  it('renders', () => {
    const { getByRole } = render(<UnregisteredAlert />);
    getByRole('heading', { name: defaultHeadline });
  });

  it('reports to GA via recordEvent when rendered', async () => {
    const event = {
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': defaultHeadline,
      'alert-box-status': 'warning',
    };
    const recordEventSpy = sinon.spy();
    const props = { recordEvent: recordEventSpy };
    render(<UnregisteredAlert {...props} />);
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(event)).to.be.true;
    });
  });
});
