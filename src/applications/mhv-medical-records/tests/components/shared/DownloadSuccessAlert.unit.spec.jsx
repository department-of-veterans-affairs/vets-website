import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import DownloadSuccessAlert from '../../../components/shared/DownloadSuccessAlert';

describe('DownloadSuccessAlert', () => {
  describe('should render the alert', () => {
    it('with the generic message when no type is provided', () => {
      const recordEvent = sinon.spy();
      const { getByText } = render(
        <DownloadSuccessAlert recordEvent={recordEvent} />,
      );
      expect(getByText('Download started')).to.exist;
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });

    it('with a type-specific message', () => {
      const recordEvent = sinon.spy();
      const { getByText } = render(
        <DownloadSuccessAlert type="Test" recordEvent={recordEvent} />,
      );
      expect(getByText('Test started')).to.exist;
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
