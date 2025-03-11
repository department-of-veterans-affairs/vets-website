import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SkinDeep from 'skin-deep';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
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

  it('should handle add correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <DeceasedPersons {...defaultProps} />
      </Provider>,
    );
    const instance = wrapper.find(DeceasedPersons).instance();
    instance.scrollToRow = sinon.spy();
    instance.focusOnFirstFocusableElement = sinon.spy();

    instance.handleAdd();

    expect(defaultProps.onChange.calledOnce).to.be.true;
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
});
