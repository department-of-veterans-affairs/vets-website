import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import StateSelect from '../../../components/FormFields/StateSelect';

describe('StateSelect Component', () => {
  it('should render the VaSelect element with state options', () => {
    const wrapper = mount(
      <StateSelect id="state-select" onChange={() => {}} value="" />,
    );

    expect(wrapper.find(VaSelect)).to.have.lengthOf(1);

    const options = wrapper.find('option');
    expect(options).to.have.lengthOf(states.USA.length);

    expect(options.at(0).text()).to.equal(states.USA[0].label);

    wrapper.unmount();
  });

  it('should call onChange with the selected value when changed', () => {
    const handleChange = sinon.spy();
    const wrapper = mount(
      <StateSelect id="state-select" onChange={handleChange} value="" />,
    );

    wrapper.find(VaSelect).prop('onVaSelect')({ target: { value: 'CA' } });

    expect(handleChange.calledOnce).to.be.true;
    expect(handleChange.calledWith('CA')).to.be.true;

    wrapper.unmount();
  });

  it('should select the correct value based on the passed prop', () => {
    const wrapper = mount(
      <StateSelect id="state-select" onChange={() => {}} value="NY" />,
    );

    expect(wrapper.find(VaSelect).prop('value')).to.equal('NY');

    wrapper.unmount();
  });
});
