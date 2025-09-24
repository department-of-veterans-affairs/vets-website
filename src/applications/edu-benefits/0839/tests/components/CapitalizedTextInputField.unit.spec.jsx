import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { inputVaTextInput } from 'platform/testing/unit/helpers';

import CapitalizedTextInputField from '../../components/CapitalizedTextInputField';

const mockStore = configureStore();

describe('<CapitalizedTextInputField />', () => {
  const defaultProps = {
    label: 'Test Label',
    required: false,
    error: undefined,
    uiOptions: {},
    childrenProps: {
      name: 'testField',
      value: '',
      onChange: () => {},
      onBlur: () => {},
      schema: { type: 'string' },
      uiSchema: {},
      idSchema: { $id: 'testField' },
      formData: '',
    },
  };

  const renderComponent = (props = {}) => {
    const store = mockStore({});
    const mergedProps = { ...defaultProps, ...props };

    return render(
      <Provider store={store}>
        <CapitalizedTextInputField {...mergedProps} />
      </Provider>,
    );
  };

  it('renders VaTextInput with correct props', () => {
    const { container } = renderComponent();

    const vaTextInput = container.querySelector('va-text-input');
    expect(vaTextInput).to.exist;
    expect(vaTextInput.getAttribute('label')).to.equal('Test Label');
    expect(vaTextInput.getAttribute('name')).to.equal('testField');
  });

  it('displays initial value correctly', () => {
    const { container } = renderComponent({
      childrenProps: {
        ...defaultProps.childrenProps,
        formData: 'test value',
      },
    });

    const vaTextInput = container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('value')).to.equal('test value');
  });

  it('capitalizes text on blur', () => {
    const onBlurSpy = sinon.spy();
    const onChangeSpy = sinon.spy();

    const { container } = renderComponent({
      childrenProps: {
        ...defaultProps.childrenProps,
        onBlur: onBlurSpy,
        onChange: onChangeSpy,
      },
    });

    const vaTextInput = container.querySelector('va-text-input');

    inputVaTextInput(container, 'abc');

    expect(vaTextInput.getAttribute('value')).to.equal('abc');

    fireEvent.blur(vaTextInput);

    expect(vaTextInput.getAttribute('value')).to.equal('ABC');
    expect(onBlurSpy.called).to.be.true;
    expect(onChangeSpy.calledWith('ABC')).to.be.true;
  });

  it('handles empty value correctly', () => {
    const { container } = renderComponent({
      childrenProps: {
        ...defaultProps.childrenProps,
        formData: '',
      },
    });

    const vaTextInput = container.querySelector('va-text-input');
    expect(vaTextInput.getAttribute('value')).to.equal('');
  });

  it('calls onBlur callback when provided', () => {
    const onBlurSpy = sinon.spy();

    const { container } = renderComponent({
      childrenProps: {
        ...defaultProps.childrenProps,
        onBlur: onBlurSpy,
      },
    });

    const vaTextInput = container.querySelector('va-text-input');

    fireEvent.blur(vaTextInput);

    expect(onBlurSpy.called).to.be.true;
  });

  it('calls onChange callback with correct parameters', () => {
    const onChangeSpy = sinon.spy();

    const { container } = renderComponent({
      childrenProps: {
        ...defaultProps.childrenProps,
        onChange: onChangeSpy,
      },
    });

    const vaTextInput = container.querySelector('va-text-input');

    inputVaTextInput(container, 'abc');
    expect(onChangeSpy.called).to.be.true;

    fireEvent.blur(vaTextInput);
    expect(onChangeSpy.calledWith('ABC')).to.be.true;
  });

  it('maintains state correctly during multiple input/blur cycles', () => {
    const { container } = renderComponent();

    const vaTextInput = container.querySelector('va-text-input');

    inputVaTextInput(container, 'abc');
    expect(vaTextInput.getAttribute('value')).to.equal('abc');

    fireEvent.blur(vaTextInput);
    expect(vaTextInput.getAttribute('value')).to.equal('ABC');

    inputVaTextInput(container, 'def');
    expect(vaTextInput.getAttribute('value')).to.equal('def');

    fireEvent.blur(vaTextInput);
    expect(vaTextInput.getAttribute('value')).to.equal('DEF');
  });
});
