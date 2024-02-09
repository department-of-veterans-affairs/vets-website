import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import ChangeOfAddressForm from '../../components/ChangeOfAddressForm';

describe('when <ChangeOfAddressForm/> renders', () => {
  const mockFormChange = sinon.spy();
  const mockFormSubmit = sinon.spy();
  const mockAddressFormData = {};
  const dummyProps = {
    title: 'TEST Address Information',
    formChange: () => {},
    formData: {},
    formPrefix: 'test-',
    formSubmit: () => {},
  };
  const setupRenderComp = () => {
    const wrapper = mount(
      <ChangeOfAddressForm
        addressFormData={mockAddressFormData}
        formChange={mockFormChange}
        formSubmit={mockFormSubmit}
      />,
    );
    return { wrapper };
  };
  it('Should render without crashing', () => {
    const wrapper = render(<ChangeOfAddressForm {...dummyProps} />);
    expect(wrapper).to.be.not.null;
  });
  it('calls useEffect on initial render and sets initial state', () => {
    const newAddressFormData = { 'view:livesOnMilitaryBaseInfo': true };
    const { wrapper } = setupRenderComp();
    wrapper.setProps({ addressFormData: newAddressFormData });
    expect(wrapper.find('SchemaForm').prop('data')).to.eql(newAddressFormData);
    wrapper.unmount();
  });
  it('renders SchemaForm with the correct props', () => {
    const { wrapper } = setupRenderComp();
    const schemaForm = wrapper.find(SchemaForm);
    expect(schemaForm.exists()).to.be.true;
    expect(schemaForm.prop('data')).to.eql(mockAddressFormData);
    wrapper.unmount();
  });
  it('renders an error message when city input is invalid', () => {
    const { wrapper } = setupRenderComp();
    wrapper.find('form').simulate('submit');
    const cityErrorMsg = wrapper.find('.usa-input-error').at(2);
    expect(cityErrorMsg.text()).includes('City is required');
    wrapper.unmount();
  });
  it('renders an error message when state input is invalid', () => {
    const { wrapper } = setupRenderComp();
    wrapper.find('form').simulate('submit');
    const staterrorMsg = wrapper.find('.usa-input-error').last();
    expect(staterrorMsg.text()).includes('State is required');
    wrapper.unmount();
  });
  it('sets ui:title to on APO/FPO/DPO when view:livesOnMilitaryBase is true', () => {
    const addressFormData = { 'view:livesOnMilitaryBase': true };
    const wrapper = shallow(
      <ChangeOfAddressForm addressFormData={addressFormData} />,
    );
    wrapper.setProps({ addressFormData });
    expect(wrapper.find('addressUISchema')).to.not.equal('APO/FPO/DPO');
    wrapper.unmount();
  });
  it('should return true for ui:required', () => {
    const addressFormData = {
      'view:livesOnMilitaryBase': true,
      countryCodeIso3: 'USA',
    };
    const { wrapper } = setupRenderComp();
    wrapper.find('form').simulate('submit');
    expect(mockFormSubmit.called).to.be.false;
    const newStateFormData = {
      ...addressFormData,
      stateCode: 'CA',
    };
    wrapper.setProps({ addressFormData: newStateFormData });
    wrapper.find('form').simulate('submit');
    expect(mockFormSubmit.calledOnce).to.be.false;
    wrapper.unmount();
  });
  it('removes stateCode as a required field when certain conditions are met', () => {
    const { wrapper } = setupRenderComp();
    let addressFormData = {
      countryCodeIso3: 'USA',
      'view:livesOnMilitaryBase': false,
    };

    wrapper.setProps({ addressFormData });
    wrapper.find('form').simulate('submit');
    addressFormData = {
      countryCodeIso3: 'USA',
      'view:livesOnMilitaryBase': true,
    };
    wrapper.setProps({ addressFormData });
    wrapper.find('form').simulate('submit');
    const stateCodeField = wrapper.find('input[name="stateCode"]');
    expect(stateCodeField.exists()).to.be.false;
    wrapper.unmount();
  });
});
