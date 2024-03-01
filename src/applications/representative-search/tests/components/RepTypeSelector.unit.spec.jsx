import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import RepTypeSelector from '../../components/search/RepTypeSelector';

describe('RepTypeSelector component', () => {
  it('should render', () => {
    const mockOnChange = () => {};

    const { container } = render(
      <RepTypeSelector
        onChange={mockOnChange}
        representativeType="veteran_service_officer"
      />,
    );

    expect($('va-radio', container)).to.exist;
  });

  it('should render the first va-radio-option as checked', () => {
    const { container } = render(
      <RepTypeSelector
        onChange={() => {}}
        representativeType="veteran_service_officer"
      />,
    );

    const radioOption = container.querySelector(
      'va-radio-option[label="Accredited Veterans Service Officer (VSO)"]',
    );

    expect(radioOption).to.exist;
    expect(radioOption).to.have.attr('checked', 'true');
  });

  it('should update representative type', () => {
    const { container } = render(
      <RepTypeSelector
        onChange={() => {}}
        representativeType="veteran_service_officer"
      />,
    );

    // Select the first va-radio-option
    const radioOption = container.querySelector(
      'va-radio-option[label="Accredited Veterans Service Officer (VSO)"]',
    );

    // Assert that the first va-radio-option is present and checked
    expect(radioOption).to.exist;
    expect(radioOption).to.have.attr('checked', 'true');
  });

  it('calls onChange when radio button is selected', () => {
    const onChangeSpy = sinon.spy();
    const wrapper = mount(
      <RepTypeSelector onChange={onChangeSpy} representativeType="" />,
    );

    const event = { detail: { value: 'veteran_service_officer' } };
    wrapper.find('VaRadio').prop('onVaValueChange')(event);

    expect(onChangeSpy.calledOnce).to.be.true;
    expect(
      onChangeSpy.calledWith({ representativeType: 'veteran_service_officer' }),
    ).to.be.true;

    wrapper.unmount();
  });
});
