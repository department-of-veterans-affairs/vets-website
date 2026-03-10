import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import OtherIncomeSummary from '../../components/householdIncome/OtherIncomeSummary';
import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';

describe('Modal Components', () => {
  describe('<DeleteConfirmationModal />', () => {
    let wrapper;

    beforeEach(() => {
      const onCloseSpy = sinon.spy();
      const onDeleteSpy = sinon.spy();

      wrapper = mount(
        <DeleteConfirmationModal
          isOpen
          onClose={onCloseSpy}
          onDelete={onDeleteSpy}
          modalTitle="Delete Something"
        />,
      );
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('should be open when `isOpen` prop is true', () => {
      expect(wrapper.prop('isOpen')).to.be.true;
    });

    it('should call `onClose` prop when cancel is clicked', () => {
      const onCloseSpy = wrapper.prop('onClose');
      wrapper
        .find('VaModal')
        .props()
        .onSecondaryButtonClick();
      expect(onCloseSpy.calledOnce).to.be.true;
    });

    it('should call `onDelete` prop when confirm is clicked', () => {
      const onDeleteSpy = wrapper.prop('onDelete');
      wrapper
        .find('VaModal')
        .props()
        .onPrimaryButtonClick();
      expect(onDeleteSpy.calledOnce).to.be.true;
    });
  });

  describe('<OtherIncomeSummary />', () => {
    it('should handle modal correctly', () => {
      // Initialize wrapper and other required props for OtherIncomeSummary
      const wrapper = mount(
        <OtherIncomeSummary
          data={{
            additionalIncome: {
              addlIncRecords: [{ name: 'Social Security', amount: '1200.65' }],
            },
          }}
        />,
      );

      wrapper
        .find('MiniSummaryCard')
        .first()
        .props()
        .onDelete();

      wrapper.unmount();
    });
  });
});
