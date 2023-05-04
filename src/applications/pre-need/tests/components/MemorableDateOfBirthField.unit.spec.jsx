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
  it('should render', () => {
    const initialState = {
      form: {
        data: { application: { claimant: { dateOfBirth: '1990-01-01' } } },
      },
    };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemorableDateOfBirthField />
      </Provider>,
    );
    expect(wrapper.find('va-memorable-date')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
