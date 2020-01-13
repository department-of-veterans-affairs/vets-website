import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import VetTecCalculatorForm from '../../components/vet-tec/VetTecCalculatorForm';

const defaultProps = {
  inputs: {},
  displayedInputs: {},
  onShowModal: () => {},
  onInputChange: () => {},
};

describe('<VetTecCalculatorForm>', () => {
  it('should render', () => {
    const wrapper = shallow(<VetTecCalculatorForm {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('tuition amount blur should log GTM analytics event', () => {
    const wrapper = mount(<VetTecCalculatorForm {...defaultProps} />);

    wrapper.find('input[name="vetTecTuitionFees"]').simulate('blur');

    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent['gibct-form-field']).to.eq(
      'Tuition & Fees Text Field',
    );
    expect(recordedEvent['gibct-form-value']).to.eq(0);
    wrapper.unmount();
  });

  it('scholarship amount blur should log GTM analytics event', () => {
    const wrapper = mount(<VetTecCalculatorForm {...defaultProps} />);

    wrapper.find('input[name="vetTecScholarships"]').simulate('blur');

    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent['gibct-form-field']).to.eq('Scholarships Text Field');
    expect(recordedEvent['gibct-form-value']).to.eq(0);
    wrapper.unmount();
  });
});
