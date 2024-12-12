import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import MilitaryAutoSuggest from '../../components/MilitaryAutoSuggestField';

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
        },
      },
    },
  },
});

describe('MilitaryAutoSuggest Component', () => {
  const defaultProps = {
    value: '',
    setValue: sinon.spy(),
    labels: [
      { key: 'A1', value: 'Alpha' },
      { key: 'B2', value: 'Bravo' },
      { key: 'C3', value: 'Charlie' },
    ],
    onSelectionChange: sinon.spy(),
    maxItems: 500,
  };

  it('should render without errors', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MilitaryAutoSuggest {...defaultProps} />
      </Provider>,
    );
    expect(wrapper.find('input').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should update input value correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MilitaryAutoSuggest {...defaultProps} />
      </Provider>,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'A' } });
    expect(input.instance().value).to.equal('');
    wrapper.unmount();
  });

  it('should display dropdown items based on input value', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MilitaryAutoSuggest {...defaultProps} />
      </Provider>,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'A' } });
    expect(
      wrapper
        .find('.autosuggest-item')
        .at(0)
        .text(),
    ).to.equal('A1 - Alpha');
    wrapper.unmount();
  });

  it('should update value on selection', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MilitaryAutoSuggest {...defaultProps} />
      </Provider>,
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'A' } });
    wrapper
      .find('.autosuggest-item')
      .at(0)
      .simulate('click');
    expect(defaultProps.setValue.calledWith('A1 - Alpha')).to.be.true;
    expect(
      defaultProps.onSelectionChange.calledWith({ key: 'A1', value: 'Alpha' }),
    ).to.be.true;
    wrapper.unmount();
  });
});
