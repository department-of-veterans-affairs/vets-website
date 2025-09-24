import React from 'react';
import * as ReactRedux from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import PreparerRadioWidget from '../../components/PreparerRadioWidget';

describe('PreparerRadioWidget in Pre-need preparer info', () => {
  const mockEnumOptions = [
    { value: 'Freddy Kruger', label: 'Self' },
    { value: 'Pinhead', label: 'Other' },
  ];

  const props = {
    id: 'testRadio',
    options: {
      enumOptions: mockEnumOptions,
      enableAnalytics: false,
    },
    value: 'value1',
    onChange: sinon.spy(),
  };

  it('should render', () => {
    const wrapper = mount(<PreparerRadioWidget {...props} />);
    expect(wrapper.find('va-radio-option').length).to.equal(2);
    wrapper.unmount();
  });

  it('should invoke onChange when a radio button is clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <PreparerRadioWidget {...props} onChange={onChange} />,
    );

    const vaRadio = wrapper.find('VaRadio');
    expect(vaRadio.exists()).to.be.true;

    vaRadio
      .props()
      .onVaValueChange({ detail: { value: 'Pinhead', checked: true } });
    expect(onChange.calledWith('Pinhead')).to.be.true;
    wrapper.unmount();
  });

  it('should render only the selected option label when in review mode', () => {
    // Mock the formContext for review mode
    const formContext = {
      onReviewPage: true,
      reviewMode: true,
    };

    const wrapper = mount(
      <PreparerRadioWidget
        {...props}
        value="Bruce Wayne"
        formContext={formContext}
      />,
    );

    // Check that radio options are not rendered
    expect(wrapper.find('va-radio-option').exists()).to.be.false;

    // Check that only a span with the selected label is rendered
    const span = wrapper.find('span');
    expect(span.exists()).to.be.true;
    expect(span.text().trim()).to.equal('');

    wrapper.unmount();
  });

  it('should render radio buttons when not on review page', () => {
    // Mock the formContext for non-review page
    const formContext = {
      onReviewPage: false,
    };

    const wrapper = mount(
      <PreparerRadioWidget {...props} formContext={formContext} />,
    );

    // Check that radio options are rendered
    expect(wrapper.find('va-radio-option').length).to.equal(2);

    wrapper.unmount();
  });

  it('should render radio buttons when on review page but not in review mode', () => {
    // Mock the formContext for review page but not in review mode
    const formContext = {
      onReviewPage: true,
      reviewMode: false,
    };

    const wrapper = mount(
      <PreparerRadioWidget {...props} formContext={formContext} />,
    );

    // Check that radio options are rendered
    expect(wrapper.find('va-radio-option').length).to.equal(2);

    wrapper.unmount();
  });

  it('should correctly access formData from state', () => {
    // We need to mock the useSelector hook
    const mockUseSelector = sinon.stub();
    mockUseSelector.returns({ someData: 'test' });

    // Save the original useSelector
    const originalUseSelector = ReactRedux.useSelector;

    // Replace useSelector with mock
    ReactRedux.useSelector = mockUseSelector;

    try {
      const wrapper = mount(<PreparerRadioWidget {...props} />);

      expect(mockUseSelector.called).to.be.false;

      wrapper.unmount();
    } finally {
      // Restore the original useSelector
      ReactRedux.useSelector = originalUseSelector;
    }
  });
});
