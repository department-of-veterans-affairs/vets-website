import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import InfoAlert from '../../../components/shared/InfoAlert';

describe('InfoAlert', () => {
  it('should render the alert', () => {
    const recordEvent = sinon.spy();
    const { getByTestId } = render(<InfoAlert recordEvent={recordEvent} />);
    expect(getByTestId('understanding-result')).to.exist;
    expect(recordEvent.calledOnce).to.be.true;
    expect(recordEvent.calledTwice).to.be.false;
  });
});
