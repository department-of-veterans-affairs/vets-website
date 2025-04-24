import { countries } from '@department-of-veterans-affairs/platform-forms/address';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import CountrySelect from '../../../components/FormFields/CountrySelect';

describe('CountrySelect', () => {
  let store;
  let wrapper;
  let onChange;

  beforeEach(() => {
    store = {
      getState: () => ({
        form: {
          data: {
            onBaseOutsideUS: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    onChange = sinon.spy();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  const mountComponent = (props = {}) => {
    wrapper = mount(
      <Provider store={store}>
        <CountrySelect
          id="test-country-select"
          value="USA"
          onChange={onChange}
          {...props}
        />
      </Provider>,
    );
    return wrapper;
  };

  it('should render with default props', () => {
    mountComponent();
    const select = wrapper.find('VaSelect');
    expect(select.exists()).to.be.true;
    expect(select.prop('id')).to.equal('test-country-select');
    expect(select.prop('value')).to.equal('USA');
    expect(select.prop('disabled')).to.be.false;
  });

  it('should render all country options', () => {
    mountComponent();
    const options = wrapper.find('option');
    expect(options).to.have.lengthOf(countries.length);

    // Verify first option
    const firstOption = options.first();
    expect(firstOption.prop('value')).to.equal(countries[0].value);
    expect(firstOption.text()).to.equal(countries[0].label);
  });

  it('should be disabled when onBaseOutsideUS is true', () => {
    store = {
      getState: () => ({
        form: {
          data: {
            onBaseOutsideUS: true,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    mountComponent();
    const select = wrapper.find('VaSelect');
    expect(select.prop('disabled')).to.be.true;
  });

  it('should call onChange when a new country is selected', () => {
    mountComponent();
    const select = wrapper.find('VaSelect');

    select.prop('onVaSelect')({ target: { value: 'CAN' } });
    expect(onChange.calledOnce).to.be.true;
    expect(onChange.calledWith('CAN')).to.be.true;
  });

  it('should not be disabled when form data is empty', () => {
    store = {
      getState: () => ({
        form: {},
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    mountComponent();
    const select = wrapper.find('VaSelect');
    expect(select.prop('disabled')).to.equal(undefined);
  });

  it('should not be disabled when form state is missing', () => {
    store = {
      getState: () => ({}),
      subscribe: () => {},
      dispatch: () => {},
    };
    mountComponent();
    const select = wrapper.find('VaSelect');
    expect(select.prop('disabled')).to.equal(undefined);
  });
});
