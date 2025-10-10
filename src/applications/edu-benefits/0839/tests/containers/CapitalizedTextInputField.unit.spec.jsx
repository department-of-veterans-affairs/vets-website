import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import CapitalizedTextInputField from '../../containers/CapitalizedTextInputField';

const mockStore = configureStore([]);

describe('CapitalizedTextInputField Component', () => {
  let store;
  let onBlurSpy;
  let onChangeSpy;

  const getProps = ({
    onChange = () => {},
    onBlur = () => {},
    value = '',
  } = {}) => ({
    label: 'Test Field',
    childrenProps: {
      name: 'testField',
      formData: value,
      onChange,
      onBlur,
      schema: { type: 'string' },
      uiSchema: {},
      idSchema: { $id: 'testField' },
    },
    uiOptions: {},
  });

  beforeEach(() => {
    onBlurSpy = sinon.spy();
    onChangeSpy = sinon.spy();
    store = mockStore({
      form: {
        data: {
          authorizedOfficial: {
            fullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      },
    });
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <CapitalizedTextInputField {...getProps(props)} />
      </Provider>,
    );
  };

  const triggerBlur = input => {
    // Get the React fiber instance to access props
    const reactPropsKey = Object.keys(input).find(key =>
      key.startsWith('__react'),
    );
    if (reactPropsKey) {
      const reactProps = input[reactPropsKey];
      if (reactProps?.memoizedProps?.onBlur) {
        // Call the onBlur handler with a mock event
        reactProps.memoizedProps.onBlur({
          target: { value: input.value || '' },
        });
      }
    }
  };

  it('renders VaTextInput component', () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    expect(container.querySelector('va-text-input')).to.exist;
  });

  it('renders with initial value', () => {
    const { container } = renderComponent({
      value: 'Test',
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');
    expect(input).to.have.attribute('value', 'Test');
  });

  it('capitalizes input value on blur', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');

    inputVaTextInput(container, 'jd');

    await waitFor(() => {
      expect(input.value).to.equal('jd');
    });

    triggerBlur(input);

    await waitFor(() => {
      expect(input.value).to.equal('JD');
      expect(onChangeSpy.called).to.be.true;
      expect(onChangeSpy.lastCall.args[0]).to.equal('JD');
    });
  });

  it('calls onBlur callback when field loses focus', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');

    triggerBlur(input);

    await waitFor(() => {
      expect(onBlurSpy.called).to.be.true;
    });
  });

  it('calls onChange callback when value changes', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });

    inputVaTextInput(container, 'J');

    await waitFor(() => {
      expect(onChangeSpy.called).to.be.true;
    });
  });

  it('validates initials against first and last name from Redux store', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');

    inputVaTextInput(container, 'JD');
    triggerBlur(input);

    await waitFor(() => {
      expect(input.getAttribute('error')).to.be.null;
    });
  });

  it('shows validation error when initials do not match name', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');

    inputVaTextInput(container, 'AB');
    triggerBlur(input);

    await waitFor(() => {
      const error = input.getAttribute('error');
      expect(error).to.not.be.null;
      expect(error).to.contain('Initials must match your name');
    });
  });

  it('clears validation error when user starts typing after validation error', async () => {
    const { container } = renderComponent({
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
    });
    const input = container.querySelector('va-text-input');

    inputVaTextInput(container, 'AB');
    triggerBlur(input);

    await waitFor(() => {
      const error = input.getAttribute('error');
      expect(error).to.not.be.null;
      expect(error).to.contain('Initials must match your name');
    });

    inputVaTextInput(container, 'JD');

    await waitFor(() => {
      const error = input.getAttribute('error');
      expect(error).to.be.null;
    });
  });
});
