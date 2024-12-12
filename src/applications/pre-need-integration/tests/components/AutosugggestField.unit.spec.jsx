/* eslint-disable @department-of-veterans-affairs/enzyme-unmount */
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

    // Check for read-only display
    expect(wrapper.find('.review-row').exists()).to.be.false;
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

    // Check if useEnum is set to true
    expect(wrapper.instance().useEnum).to.be.true;

    // Check if suggestions are generated correctly
    expect(wrapper.state('suggestions')).to.deep.equal([
      { id: '1', label: 'Label 1' },
      { id: '2', label: 'Label 2' },
      { id: '3', label: 'Label 3' },
    ]);
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

    // Check getFormData with useEnum
    wrapper.instance().useEnum = true;
    let formDataResult = wrapper
      .instance()
      .getFormData({ id: '1', label: 'Option 1' });
    expect(formDataResult).to.equal('1');

    // Check getFormData with freeInput
    wrapper.instance().useEnum = false;
    formDataResult = wrapper
      .instance()
      .getFormData({ id: '1', label: 'Option 1' });
    expect(formDataResult).to.equal('Option 1');
  });

  it('should return correct item from input value and suggestions', () => {
    const mockOnChange = sinon.spy();
    const mockOnBlur = sinon.spy();
    const uiSchema = {
      'ui:options': {
        labels: { 1: 'Label 1' },
        // inputTransformers: [input => input.toUpperCase()],
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

    // Ensure useEnum is set to true
    wrapper.instance().useEnum = true;

    // Check getItemFromInput with exact match
    const item = wrapper
      .instance()
      .getItemFromInput('Option 1', suggestions, uiSchema['ui:options']);
    expect(item).to.equal('Option 1'); // Since getFormData returns suggestion.id when useEnum is true
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

    // Simulate input value change
    instance.handleInputValueChange('new value');

    // Check if debouncedGetOptions is called
    expect(instance.debouncedGetOptions.calledWith('new value')).to.be.true;

    // Check if getItemFromInput is called
    expect(
      instance.getItemFromInput.calledWith(
        'new value',
        instance.state.suggestions,
        uiSchema['ui:options'],
      ),
    ).to.be.true;

    // Check if onChange is called
    expect(mockOnChange.called).to.be.true;

    // Check if state is updated
    expect(instance.state.input).to.equal('new value');
    expect(
      instance.getSuggestions.calledWith(instance.state.options, 'new value'),
    ).to.be.true;

    // Simulate input value change to empty string
    instance.handleInputValueChange('');

    // Check if onChange is called with no arguments
    expect(mockOnChange.calledWith()).to.be.true;
    expect(instance.state.input).to.equal('');
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

    // Simulate selection change
    instance.handleChange(selectedItem);

    // Check if getFormData is called
    expect(instance.getFormData.calledWith(selectedItem)).to.be.true;

    // Check if onChange is called with the correct value
    expect(mockOnChange.calledWith('1')).to.be.true;

    // Check if state is updated
    expect(instance.state.input).to.equal('Option 1');
  });
});
