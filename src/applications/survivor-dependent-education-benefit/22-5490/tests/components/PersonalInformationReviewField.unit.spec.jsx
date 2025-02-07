import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PersonalInformationReviewField from '../../components/PersonalInformationReviewField';

describe('PersonalInformationReviewField component', () => {
  const mockStore = configureStore();
  const initialState = {
    user: {
      profile: {
        userFullName: {
          first: 'test',
          middle: 'T',
          last: 'testerson',
        },
        dob: '1990-01-01',
      },
    },
  };
  it('renders the PersonalInformationReviewField footer', () => {
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <PersonalInformationReviewField
          data={{ highSchoolDiploma: 'yes' }}
          title="date of birth"
        />
      </Provider>,
    );
    expect(wrapper.text()).to.include('test T testerson');

    wrapper.unmount();
  });
});
