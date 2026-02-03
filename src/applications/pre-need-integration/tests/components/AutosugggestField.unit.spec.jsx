import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AutosuggestField from '../../components/AutosugggestField';

const mockStore = configureStore([]);
const store = mockStore({
  form: { data: {} },
  vapService: { addressValidation: {} },
});
const wrapWithProvider = component => (
  <Provider store={store}>{component}</Provider>
);
describe('AutosuggestField in Pre-need-integration', () => {
  const defaultSchema = {
    enum: ['1', '2', '3'],
    enumNames: ['Option 1', 'Option 2', 'Option 3'],
  };
  const defaultUiSchema = {
    'ui:options': {
      labels: {
        1: 'Label 1',
        2: 'Label 2',
        3: 'Label 3',
      },
    },
  };
  const defaultProps = {
    uiSchema: defaultUiSchema,
    schema: defaultSchema,
    formData: {},
    idSchema: { $id: 'test-id' },
    formContext: { reviewMode: false },
    onChange: sinon.spy(),
    onBlur: sinon.spy(),
  };
  it('renders the component without crashing', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });
  it('renders a span in reviewMode when schema.type !== object', () => {
    const props = {
      ...defaultProps,
      schema: { ...defaultSchema, type: 'string' },
      formData: '1',
      formContext: { reviewMode: true },
    };
    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    const span = wrapper.find('span');
    expect(span.text()).to.equal('Label 1');
    wrapper.unmount();
  });
  it('generates suggestions when getOptions is not provided', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    expect(instance.useEnum).to.be.true;
    expect(instance.state.suggestions).to.deep.equal([
      { id: '1', label: 'Label 1' },
      { id: '2', label: 'Label 2' },
      { id: '3', label: 'Label 3' },
    ]);
    wrapper.unmount();
  });
  it('getFormData returns correct values for enum and freeInput', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    instance.useEnum = true;
    expect(instance.getFormData({ id: '1', label: 'Opt 1' })).to.eq('1');
    instance.useEnum = false;
    wrapper.setProps({
      children: (
        <AutosuggestField
          {...defaultProps}
          uiSchema={{
            'ui:options': {
              freeInput: true,
            },
          }}
        />
      ),
    });
    expect(instance.getFormData({ id: '1', label: 'Opt 1' })).to.eq('Opt 1');
    wrapper.unmount();
  });
  it('getItemFromInput returns matching exact label', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    instance.useEnum = true;
    const suggestions = [{ id: '1', label: 'MatchMe' }];
    const result = instance.getItemFromInput(
      'MatchMe',
      suggestions,
      defaultUiSchema['ui:options'],
    );
    expect(result).to.equal('MatchMe');
    wrapper.unmount();
  });

  it('applies inputTransformers when provided', () => {
    const transform = input => input.toUpperCase();

    const props = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {
          freeInput: true,
          inputTransformers: [transform],
          labels: {
            1: 'Label 1',
          },
        },
      },
    };

    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    const instance = wrapper.find('AutosuggestField').instance();

    const suggestions = [{ id: '1', label: 'hello' }];
    const result = instance.getItemFromInput(
      'hello',
      suggestions,
      props.uiSchema['ui:options'],
    );

    expect(result).to.equal('HELLO');
    wrapper.unmount();
  });
  it('skips debounced getOptions when queryForResults is false', () => {
    const props = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {
          queryForResults: false,
          getOptions: sinon.stub().resolves([]),
          labels: {
            1: 'Label 1',
          },
        },
      },
    };

    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    const instance = wrapper.find('AutosuggestField').instance();

    sinon.spy(instance, 'debouncedGetOptions');
    instance.handleInputValueChange('new');

    expect(instance.debouncedGetOptions.called).to.be.false;
    wrapper.unmount();
  });
  it('calls getOptions on mount when not in reviewMode', () => {
    const getOptionsStub = sinon.stub().resolves([]);
    const props = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {
          getOptions: getOptionsStub,
        },
      },
    };
    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    expect(getOptionsStub.called).to.be.true;
    wrapper.unmount();
  });
  it('cancels debounced call on unmount', () => {
    const getOptionsStub = sinon.stub().resolves([]);
    const props = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {
          getOptions: getOptionsStub,
        },
      },
    };
    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    const instance = wrapper.find('AutosuggestField').instance();
    const cancelSpy = sinon.spy(instance.debouncedGetOptions, 'cancel');
    wrapper.unmount();
    expect(cancelSpy.calledOnce).to.be.true;
  });

  it('handles input value change and triggers state update', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    sinon.spy(instance, 'getItemFromInput');
    sinon.spy(instance, 'getSuggestions');
    instance.handleInputValueChange('test');
    expect(instance.getItemFromInput.called).to.be.true;
    expect(instance.getSuggestions.called).to.be.true;
    expect(instance.state.input).to.equal('test');
    instance.handleInputValueChange('');
    expect(defaultProps.onChange.calledWith()).to.be.true;
    expect(instance.state.input).to.equal('');
    wrapper.unmount();
  });
  it('handles selection and sets input', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    sinon.spy(instance, 'getFormData');
    instance.handleChange({ id: '1', label: 'Label 1' });
    expect(instance.getFormData.called).to.be.true;
    expect(defaultProps.onChange.calledWith('1')).to.be.true;
    expect(instance.state.input).to.equal('Label 1');
    wrapper.unmount();
  });
  it('renders without highlightText spans when disabled', () => {
    const props = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {
          labels: {
            1: 'Test label',
          },
          highlightText: false,
        },
      },
    };

    const wrapper = mount(wrapWithProvider(<AutosuggestField {...props} />));
    const instance = wrapper.find('AutosuggestField').instance();

    instance.setState({
      input: 'Test',
      suggestions: [{ id: '1', label: 'Test label' }],
    });

    wrapper.update();

    // Downshift v9 uses children function instead of render prop
    const downshiftChildrenFn = wrapper.find('Downshift').prop('children');
    const rendered = downshiftChildrenFn({
      getInputProps: () => ({}),
      getItemProps: ({ item }) => ({ key: item.id }),
      isOpen: true,
      selectedItem: null,
      highlightedIndex: null,
    });

    const renderedWrapper = mount(<>{rendered}</>);

    const item = renderedWrapper.find('.autosuggest-item');
    expect(item.exists()).to.be.true;
    expect(item.text()).to.include('Test label');
    expect(item.find('.autosuggest-highlight')).to.have.lengthOf(0);

    wrapper.unmount();
  });

  it('clears input on Escape key press', () => {
    const wrapper = mount(
      wrapWithProvider(<AutosuggestField {...defaultProps} />),
    );
    const instance = wrapper.find('AutosuggestField').instance();
    instance.setState({ input: 'ClearMe' });
    instance.handleKeyDown({ keyCode: 27 });
    expect(instance.state.input).to.equal('');
    wrapper.unmount();
  });
});
