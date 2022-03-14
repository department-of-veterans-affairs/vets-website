import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import CancelButton from '../CancelButton';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('CancelButton', () => {
      it('passes axeCheck', () => {
        axeCheck(<CancelButton />);
      });
      it('renders the cancel button', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <CancelButton jumpToPage={() => {}} backPage="foo">
            Cancel
          </CancelButton>,
        );
        expect(getByText('Cancel')).to.exist;
      });
      it('calls jumpToPage and clearData function with backPage when the cancel button is clicked', () => {
        const jumpToPage = sinon.spy();
        const clearData = sinon.spy();
        const { getByText } = render(
          <CancelButton
            jumpToPage={jumpToPage}
            backPage="foo"
            clearData={clearData}
          >
            Cancel
          </CancelButton>,
        );
        fireEvent.click(getByText('Cancel'));
        expect(jumpToPage.calledWith('foo')).to.be.true;
        expect(clearData.called).to.be.true;
      });
    });
  });
});
