import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import MemorableDateOfBirthField from '../../components/MemorableDateOfBirthField';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
describe('<MemorableDateOfBirthField>', () => {
  let store;
  beforeEach(() => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '' } } },
      },
    };
    store = mockStore(initialState);
  });
  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField />
      </Provider>,
    );
    expect(wrapper.find('va-memorable-date')).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('should be required', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField />
      </Provider>,
    );
    const memorableDate = wrapper.find('va-memorable-date');
    const errorPropValue = memorableDate.prop('required');
    expect(errorPropValue).to.equal(true);
    wrapper.unmount();
  });
  it('should throw error if date is in the future', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField dob="2070-01-01" />
      </Provider>,
    );
    const memorableDate = wrapper.find('va-memorable-date');
    const errorPropValue = memorableDate.prop('error');
    expect(errorPropValue).to.equal(
      'Please enter a valid current or past date',
    );
    wrapper.unmount();
  });
  it('should not throw an error if a date is a valid current or past date', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField dob="2020-01-01" />
      </Provider>,
    );
    const memorableDate = wrapper.find('va-memorable-date');
    const errorPropValue = memorableDate.prop('error');
    expect(errorPropValue).to.equal('');
    wrapper.unmount();
  });
});
