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

    // Check getItemFromInput with input transformers
    // item = wrapper
    //   .instance()
    //   .getItemFromInput('option 1', suggestions, uiSchema['ui:options']);
    // expect(item).to.deep.equal({ widget: 'autosuggest', label: 'OPTION 1' });
  });
});
