// Dependencies
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import AlertMessage from '../../components/AlertMessage';

// Relative Imports
import CarefulConsiderationStatement from '../../components/CarefulConsiderationStatement';

describe('Discharge Wizard <CarefulConsiderationStatement />', () => {
  it('should show nothing of the component if no reason && dischargeType is populated on props', () => {
    const tree = shallow(
      <CarefulConsiderationStatement
        formValues={{
          '4_reason': null,
          '5_dischargeType': null,
        }}
      />,
    );
    expect(tree.html()).to.equal(''); // component renders null
    tree.unmount();
  });

  it('should show alert box if 12_priorService is populated on props', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formValues={{
          '4_reason': null,
          '5_dischargeType': null,
          '12_priorService': '1',
        }}
      />,
    );
    expect(wrapper.find(AlertMessage)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should show the text if 4_reason and 5_dischargeType is populated on props', () => {
    const wrapper = mount(
      <CarefulConsiderationStatement
        formValues={{
          '4_reason': '3',
          '5_dischargeType': '2',
        }}
      />,
    );
    expect(wrapper.html()).to.include(
      'Because you answered that your discharge was due to your',
    );
    wrapper.unmount();
  });
});
