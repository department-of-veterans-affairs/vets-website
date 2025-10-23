import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CalculateYourBenefitsForm from '../../../components/profile/CalculateYourBenefitsForm';

describe('<CalculateYourBenefitsForm>', () => {
  it('should render', () => {
    const tree = shallow(
      <CalculateYourBenefitsForm
        eligibility={{}}
        inputs={{}}
        displayedInputs={{}}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should call calculatorInputChange with the right arguments', () => {
    const calculatorInputChangeSpy = sinon.spy();
    const recordEventSpy = sinon.spy();
    const recalculateBenefitsSpy = sinon.spy();
    const wrapper = shallow(
      <CalculateYourBenefitsForm
        inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
        displayedInputs={{ inState: 'no' }}
        calculatorInputChange={calculatorInputChangeSpy}
        recordEvent={recordEventSpy}
        recalculateBenefits={recalculateBenefitsSpy}
        eligibility={{ onlineClasses: 'onlineClasses' }}
        profile={{ attributes: 'attributes' }}
        updateEstimatedBenefits={() => {}}
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: { value: '1000', name: 'inStateTuitionFees' },
    });

    expect(
      calculatorInputChangeSpy.calledWith({
        field: 'inStateTuitionFees',
        value: '1000',
      }),
    ).to.be.true;
    wrapper.unmount();
  });
  it('should call calculatorInputChange and recalculateBenefits on input change', () => {
    const calculatorInputChangeSpy = sinon.spy();
    const recordEventSpy = sinon.spy();
    const recalculateBenefitsSpy = sinon.spy();
    const wrapper = shallow(
      <CalculateYourBenefitsForm
        inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
        displayedInputs={{ inState: 'no' }}
        calculatorInputChange={calculatorInputChangeSpy}
        recordEvent={recordEventSpy}
        recalculateBenefits={recalculateBenefitsSpy}
        eligibility={{ onlineClasses: 'onlineClasses' }}
        profile={{ attributes: 'attributes' }}
        updateEstimatedBenefits={() => {}}
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: { value: 'extension', name: 'beneficiaryLocationQuestion' },
    });

    expect(
      recordEventSpy.calledWithMatch({
        event: 'gibct-form-change',
        'gibct-form-field': 'gibctExtensionCampusSelection',
        'gibct-form-value': 'An extension campus',
      }),
    ).to.be.false;
    wrapper.unmount();
  });
  it('should handle input change for beneficiaryLocationQuestion when value is "other"', () => {
    const calculatorInputChangeSpy = sinon.spy();
    const recordEventSpy = sinon.spy();
    const recalculateBenefitsSpy = sinon.spy();
    const wrapper = shallow(
      <CalculateYourBenefitsForm
        inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
        displayedInputs={{ inState: 'no' }}
        calculatorInputChange={calculatorInputChangeSpy}
        recordEvent={recordEventSpy}
        recalculateBenefits={recalculateBenefitsSpy}
        eligibility={{ onlineClasses: 'onlineClasses' }}
        profile={{ attributes: 'attributes' }}
        updateEstimatedBenefits={() => {}}
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', {
      target: { value: 'other', name: 'beneficiaryLocationQuestion' },
    });

    expect(
      recordEventSpy.calledWithMatch({
        event: 'gibct-form-change',
        'gibct-form-field': 'gibctOtherCampusLocation ',
        'gibct-form-value': 'other location',
      }),
    ).to.be.false;
    wrapper.unmount();
  });
  it('should handle input change for "buyUp" field', () => {
    const calculatorInputChangeSpy = sinon.spy();
    const recordEventSpy = sinon.spy();
    const recalculateBenefitsSpy = sinon.spy();
    const wrapper = shallow(
      <CalculateYourBenefitsForm
        inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
        displayedInputs={{ inState: 'no' }}
        calculatorInputChange={calculatorInputChangeSpy}
        recordEvent={recordEventSpy}
        recalculateBenefits={recalculateBenefitsSpy}
        eligibility={{ onlineClasses: 'onlineClasses' }}
        profile={{ attributes: 'attributes' }}
        updateEstimatedBenefits={() => {}}
      />,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'yes', name: 'buyUp' } });

    expect(
      recordEventSpy.calledWithMatch({
        event: 'gibct-form-change',
        'gibct-form-field': 'buyUp',
        'gibct-form-value': 'yes',
      }),
    ).to.be.false;
    wrapper.unmount();
  });
  describe('test rendering sections', () => {
    it('should not render inState if displayedInputs.inState is null', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{
            classesoutsideus: 'classesoutsideus',
            inState: 'no',
            tuitionFees: 0,
          }}
          displayedInputs={{ inState: false, tuition: true }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
        />,
      );
      const radioButton = wrapper.find('VARadioButton');
      expect(radioButton).to.have.lengthOf(0);
      wrapper.unmount();
    });
    it('should render books if displayedInputs.books is true', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
          displayedInputs={{ inState: true, books: true }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
          profile={{ attributes: 'attributes' }}
        />,
      );
      const input = wrapper.find('input#books');
      expect(input).to.have.lengthOf(1);
      wrapper.unmount();
    });
    it('should not render yellowRibbon if displayedInputs.yellowRibbon is false', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{
            classesoutsideus: 'classesoutsideus',
            inState: 'no',
            tuitionAssist: 0,
          }}
          displayedInputs={{ yellowRibbon: false, tuitionAssist: true }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
        />,
      );
      const radioButton = wrapper.find('VARadioButton');
      expect(radioButton).to.have.lengthOf(0);
      wrapper.unmount();
    });
    it('should render enrollOld if displayedInputs.shouldRenderEnrolledOld is true', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
          displayedInputs={{
            inState: true,
            enrolled: false,
            enrolledOld: true,
          }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
          profile={{ attributes: 'attributes' }}
        />,
      );
      const dropDown = wrapper.find('Dropdown');
      expect(dropDown).to.have.lengthOf(1);
      wrapper.unmount();
    });
    it('should render buyUp if displayedInputs.buyUp is true', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
          displayedInputs={{ buyUp: true }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
        />,
      );
      const input = wrapper.find('input#buyUpAmount');
      expect(input).to.have.lengthOf(1);
      wrapper.unmount();
    });
    it('should render working if displayedInputs.working is true', () => {
      const wrapper = shallow(
        <CalculateYourBenefitsForm
          inputs={{ classesoutsideus: 'classesoutsideus', inState: 'no' }}
          displayedInputs={{ working: true }}
          eligibility={{ onlineClasses: 'onlineClasses' }}
        />,
      );
      const dropDown = wrapper.find('Dropdown');
      expect(dropDown).to.have.lengthOf(1);
      wrapper.unmount();
    });
  });
});
