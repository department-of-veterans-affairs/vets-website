import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SkinDeep from 'skin-deep';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as validation from 'platform/forms-system/src/js/validation';
import DeceasedPersons from '../../components/DeceasedPersons';

const mockStore = configureStore([]);
const store = mockStore({
  form: {
    data: {
      application: {
        applicant: {
          name: {
            first: 'John',
            last: 'Doe',
          },
          'view:applicantInfo': {
            mailingAddress: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'NY',
              postalCode: '12345',
              country: 'USA',
            },
          },
          'view:contactInfo': {
            applicantPhoneNumber: '123-456-7890',
            applicantEmail: 'john.doe@example.com',
          },
        },
        veteran: {
          address: {},
        },
      },
    },
  },
});

describe('DeceasedPersons Component', () => {
  const defaultProps = {
    schema: {
      type: 'array',
      items: {},
      additionalItems: {},
      minItems: 1,
    },
    uiSchema: {
      'ui:options': {
        viewField: props => <div>{props.formData.name.first}</div>,
      },
      'ui:title': 'Deceased Persons',
      'ui:description': 'Description',
    },
    errorSchema: {},
    idSchema: {
      $id: 'root',
    },
    formData: [
      {
        name: {
          first: 'John',
          last: 'Doe',
        },
      },
    ],
    registry: {
      fields: {
        SchemaField: () => <div />,
        TitleField: () => <div />,
      },
      widgets: {},
      definitions: {},
      formContext: {
        setTouched: sinon.spy(),
      },
    },
    onChange: sinon.spy(),
  };

  it('should render without errors', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    expect(wrapper.find('.va-growable').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should throw an error if no viewField is provided', () => {
    const propsWithoutViewField = {
      ...defaultProps,
      uiSchema: {
        'ui:options': {},
      },
    };

    expect(() =>
      SkinDeep.shallowRender(<DeceasedPersons {...propsWithoutViewField} />),
    ).to.throw('No viewField found in uiSchema for DeceasedPersons root.');
  });

  it('handles modal primary and secondary button clicks', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );

    const instance = wrapper.find(DeceasedPersons).instance();
    instance.handleRemove(0, true);
    expect(instance.state.removing[0]).to.be.true;

    // Simulate modal "No"
    instance.closeRemoveModal(0);
    expect(instance.state.removing.length).to.equal(0);

    // Simulate modal "Yes"
    instance.handleRemove(0, true);
    instance.handleRemoveModal(0);
    expect(instance.state.editing.length).to.equal(0);

    wrapper.unmount();
  });

  it('falls back to raw description JSX when no text or component', () => {
    const props = {
      ...defaultProps,
      uiSchema: {
        ...defaultProps.uiSchema,
        'ui:description': (
          <span className="raw-desc">Fallback Description</span>
        ),
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...props} />
      </Provider>,
    );

    expect(wrapper.find('.raw-desc').text()).to.include('Fallback');
    wrapper.unmount();
  });

  it('calls focusOnFirstFocusableElement and skips when wrapper is missing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );

    const instance = wrapper.find(DeceasedPersons).instance();
    // should not throw even if DOM element not found
    instance.focusOnFirstFocusableElement(9999); // unlikely to exist
    wrapper.unmount();
  });

  it('should handle edit correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToRow = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleEdit(0);

    expect(instance.state.editing[0]).to.be.true;
    expect(instance.scrollToRow.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle update correctly when valid', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToTop = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleUpdate(0);

    expect(instance.state.editing[0]).to.be.false;
    expect(instance.state.showSave[0]).to.be.false;
    expect(instance.scrollToTop.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle update correctly when invalid', () => {
    const errorProps = {
      ...defaultProps,
      errorSchema: {
        0: {
          __errors: ['Error'],
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...errorProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToFirstError = sinon.spy();

    instance.handleUpdate(0);

    expect(defaultProps.registry.formContext.setTouched.calledOnce).to.be.true;
    expect(instance.scrollToFirstError.calledOnce).to.be.false;
    wrapper.unmount();
  });

  it('should handle add correctly and update editing state', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToRow = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleAdd();

    expect(instance.state.editing.length).to.equal(2);
    expect(instance.scrollToRow.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle remove correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToTop = sinon.spy();

    instance.handleRemove(0, false);

    expect(defaultProps.onChange.calledOnce).to.be.false;
    expect(instance.state.editing.length).to.equal(0);
    expect(instance.scrollToTop.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should handle remove modal correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToTop = sinon.spy();

    instance.handleRemoveModal(0);

    expect(defaultProps.onChange.calledOnce).to.be.false;
    expect(instance.state.editing.length).to.equal(0);
    expect(instance.scrollToTop.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should close remove modal correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();

    instance.closeRemoveModal(0);

    expect(instance.state.removing.length).to.equal(0);
    wrapper.unmount();
  });

  it('should handle item change correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();

    instance.onItemChange(0, { name: { first: 'Jane', last: 'Doe' } });

    expect(defaultProps.onChange.calledOnce).to.be.false;
    wrapper.unmount();
  });

  it('should handle add correctly when errorSchemaIsValid returns false', () => {
    const stub = sinon.stub(validation, 'errorSchemaIsValid').returns(false);

    const errorProps = {
      ...defaultProps,
      formContext: { setTouched: sinon.spy() },
      errorSchema: {},
    };

    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...errorProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();

    instance.handleAdd();

    expect(errorProps.formContext.setTouched.calledOnce).to.be.true;

    stub.restore();
    wrapper.unmount();
  });

  it('should throw an error if no viewField is provided', () => {
    const propsWithoutViewField = {
      ...defaultProps,
      uiSchema: { 'ui:options': {} },
    };
    expect(() =>
      SkinDeep.shallowRender(<DeceasedPersons {...propsWithoutViewField} />),
    ).to.throw('No viewField found in uiSchema for DeceasedPersons');
  });

  it('should call onChange with default items when formData is empty and schema.minItems > 0', () => {
    const didMountProps = {
      ...defaultProps,
      formData: [],
      schema: { ...defaultProps.schema, minItems: 1, additionalItems: {} },
    };
    const onChangeSpy = sinon.spy();
    didMountProps.onChange = onChangeSpy;
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...didMountProps} />
      </Provider>,
    );
    expect(onChangeSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should call scrollToRow and focusOnFirstFocusableElement when handleEdit is called', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToRow = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();
    instance.handleEdit(0);
    expect(instance.scrollToRow.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should update editing state and call scrollToTop when handleUpdate is called and errorSchemaIsValid returns true', () => {
    const stub = sinon.stub(validation, 'errorSchemaIsValid').returns(true);
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToTop = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleUpdate(0);
    expect(instance.state.editing[0]).to.be.false;
    expect(instance.state.showSave[0]).to.be.false;
    expect(instance.scrollToTop.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;

    stub.restore();
    wrapper.unmount();
  });

  it('should call formContext.setTouched and scrollToFirstError when handleUpdate is called and errorSchemaIsValid returns false', () => {
    const stub = sinon.stub(validation, 'errorSchemaIsValid').returns(false);
    const setTouchedSpy = sinon.spy();
    const invalidProps = {
      ...defaultProps,
      registry: {
        ...defaultProps.registry,
        formContext: { setTouched: setTouchedSpy, onReviewPage: false },
      },
      errorSchema: { 0: { __errors: ['Error'] } },
    };
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...invalidProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToFirstError = sinon.spy();

    instance.handleUpdate(0);
    expect(setTouchedSpy.calledOnce).to.be.true;

    setTouchedSpy.args[0][1]();
    expect(instance.scrollToFirstError.calledOnce).to.be.true;

    stub.restore();
    wrapper.unmount();
  });

  it('should add a new item and update state when handleAdd is called and errorSchemaIsValid returns true', () => {
    const stub = sinon.stub(validation, 'errorSchemaIsValid').returns(true);
    const addProps = {
      ...defaultProps,
      formData: [{ name: { first: 'John', last: 'Doe' } }],
      errorSchema: { 0: {} },
      uiSchema: {
        'ui:options': {
          viewField: defaultProps.uiSchema['ui:options'].viewField,
          reviewMode: false,
        },
      },
    };
    const onChangeSpy = sinon.spy();
    addProps.onChange = onChangeSpy;
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...addProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToRow = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleAdd();
    expect(onChangeSpy.calledOnce).to.be.true;
    expect(instance.state.editing.length).to.equal(2);
    expect(instance.state.showSave.length).to.equal(2);
    expect(instance.scrollToRow.calledOnce).to.be.true;
    expect(instance.focusOnFirstFocusableElement.calledOnce).to.be.true;

    stub.restore();
    wrapper.unmount();
  });

  it('should set removing state to true when handleRemove is called with confirmRemove true', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.handleRemove(0, true);
    expect(instance.state.removing[0]).to.be.true;
    wrapper.unmount();
  });

  it('should remove the item and call onChange when handleRemove is called with confirmRemove false', () => {
    const removeProps = {
      ...defaultProps,
      formData: [
        { name: { first: 'John', last: 'Doe' } },
        { name: { first: 'Jane', last: 'Doe' } },
      ],
    };
    const onChangeSpy = sinon.spy();
    removeProps.onChange = onChangeSpy;
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...removeProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToTop = sinon.spy();

    instance.handleRemove(0, false);
    expect(onChangeSpy.calledOnce).to.be.true;
    // Expect the item to have been filtered out (now only one remains)
    expect(instance.state.editing.length).to.equal(1);
    expect(instance.scrollToTop.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should remove the item and update state when handleRemoveModal is called', () => {
    const removeModalProps = {
      ...defaultProps,
      formData: [
        { name: { first: 'John', last: 'Doe' } },
        { name: { first: 'Jane', last: 'Doe' } },
      ],
    };
    const onChangeSpy = sinon.spy();
    removeModalProps.onChange = onChangeSpy;
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...removeModalProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.setState({
      editing: [true, true],
      removing: [false, true],
    });
    instance.scrollToTop = sinon.spy();

    instance.handleRemoveModal(1);
    expect(onChangeSpy.calledOnce).to.be.true;
    expect(instance.scrollToTop.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should call onChange with updated item when onItemChange is called', () => {
    const onChangeSpy = sinon.spy();
    const itemChangeProps = {
      ...defaultProps,
      formData: [{ name: { first: 'John', last: 'Doe' } }],
      onChange: onChangeSpy,
    };
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...itemChangeProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    const newValue = { name: { first: 'Jane', last: 'Doe' } };
    instance.onItemChange(0, newValue);
    expect(onChangeSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
