import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import UpdateButton from '../UpdateButton';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('UpdateButton', () => {
      it('passes axeCheck', () => {
        axeCheck(<UpdateButton />);
      });
      it('renders the cancel button', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <UpdateButton jumpToPage={() => {}} backPage="foo" />,
        );
        expect(getByText('Update')).to.exist;
      });
      it('calls jumpToPage, clearData and handleUpdate function with backPage when the cancel button is clicked', () => {
        const jumpToPage = sinon.spy();
        const clearData = sinon.spy();
        const handleUpdate = sinon.spy();
        const { getByText } = render(
          <UpdateButton
            jumpToPage={jumpToPage}
            backPage="foo"
            clearData={clearData}
            handleUpdate={handleUpdate}
            isUpdatable
          />,
        );
        fireEvent.click(getByText('Update'));
        expect(jumpToPage.calledWith('foo')).to.be.true;
        expect(clearData.called).to.be.true;
        expect(handleUpdate.called).to.be.true;
      });
      it('button is disabled if isUpdatable is false', () => {
        const { getByText } = render(<UpdateButton isUpdatable={false} />);
        expect(getByText('Update')).to.have.attribute('disabled');
      });
      it('button is enabled if isUpdatable is true', () => {
        const { getByText } = render(<UpdateButton isUpdatable />);
        expect(getByText('Update')).to.not.have.attribute('disabled');
      });
    });
  });
});
