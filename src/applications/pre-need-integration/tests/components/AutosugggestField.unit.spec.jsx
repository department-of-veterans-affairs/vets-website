import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import AutosuggestField from '../../components/AutosugggestField';

describe('AutosuggestField in Pre-need-integration', () => {
  it('should render the component correctly', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
        getOptions: sinon.stub().resolves([]),
        debounceRate: 300,
        maxOptions: 5,
        queryForResults: true,
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { 1: 'Label 1' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render a read-only view in review mode', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
        getOptions: sinon.stub().resolves([]),
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { 1: 'Label 1' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: true };

    const wrapper = mount(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    expect(wrapper.find('.review-row').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should use enum and generate suggestions when getOptions is not provided', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1', 2: 'Label 2', 3: 'Label 3' },
        debounceRate: 300,
        maxOptions: 5,
        queryForResults: false,
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { widget: 'autosuggest', label: '' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    expect(wrapper.instance().useEnum).to.be.true;

    expect(wrapper.state('suggestions')).to.deep.equal([
      { id: '1', label: 'Label 1' },
      { id: '2', label: 'Label 2' },
      { id: '3', label: 'Label 3' },
    ]);
    wrapper.unmount();
  });

  it('should return correct form data based on useEnum and freeInput', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
        freeInput: true,
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { widget: 'autosuggest', label: '' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    wrapper.instance().useEnum = true;
    let formDataResult = wrapper
      .instance()
      .getFormData({ id: '1', label: 'Option 1' });
    expect(formDataResult).to.equal('1');

    wrapper.instance().useEnum = false;
    formDataResult = wrapper
      .instance()
      .getFormData({ id: '1', label: 'Option 1' });
    expect(formDataResult).to.equal('Option 1');
    wrapper.unmount();
  });

  it('should return correct item from input value and suggestions', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { widget: 'autosuggest', label: '' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    const suggestions = [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
    ];

    wrapper.instance().useEnum = true;

    const item = wrapper
      .instance()
      .getItemFromInput('Option 1', suggestions, uiSchema['ui:options']);
    expect(item).to.equal('Option 1');
    wrapper.unmount();
  });

  it('should handle input value change', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
        queryForResults: true,
        getOptions: sinon.stub().resolves([]),
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { widget: 'autosuggest', label: '' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    const instance = wrapper.instance();
    sinon.spy(instance, 'debouncedGetOptions');
    sinon.spy(instance, 'getItemFromInput');
    sinon.spy(instance, 'getSuggestions');

    instance.handleInputValueChange('new value');

    expect(instance.debouncedGetOptions.calledWith('new value')).to.be.true;

    expect(
      instance.getItemFromInput.calledWith(
        'new value',
        instance.state.suggestions,
        uiSchema['ui:options'],
      ),
    ).to.be.true;

    expect(mockOnChange.called).to.be.true;

    expect(instance.state.input).to.equal('new value');
    expect(
      instance.getSuggestions.calledWith(instance.state.options, 'new value'),
    ).to.be.true;

    instance.handleInputValueChange('');

    expect(mockOnChange.calledWith()).to.be.true;
    expect(instance.state.input).to.equal('');
    wrapper.unmount();
  });

  it('should handle selection change', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
      },
    };
    const schema = {
      enum: ['1', '2', '3'],
      enumNames: ['Option 1', 'Option 2', 'Option 3'],
    };
    const formData = { widget: 'autosuggest', label: '' };
    const idSchema = { $id: 'test-id' };
    const formContext = { reviewMode: false };

    const wrapper = shallow(
      <AutosuggestField
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        idSchema={idSchema}
        formContext={formContext}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />,
    );

    const instance = wrapper.instance();
    sinon.spy(instance, 'getFormData');

    const selectedItem = { id: '1', label: 'Option 1' };

    instance.handleChange(selectedItem);

    expect(instance.getFormData.calledWith(selectedItem)).to.be.true;

    expect(mockOnChange.calledWith('1')).to.be.true;

    expect(instance.state.input).to.equal('Option 1');
    wrapper.unmount();
  });
});
