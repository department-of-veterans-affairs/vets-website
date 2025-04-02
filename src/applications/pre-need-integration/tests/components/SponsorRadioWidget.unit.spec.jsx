import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RadioWidget from '../../components/SponsorRadioWidget';

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

describe('RadioWidget in Pre-need-integration info', () => {
  const mockEnumOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const props = {
    id: 'testRadio',
    options: {
      enumOptions: mockEnumOptions,
      enableAnalytics: false,
      title: 'Test Title',
    },
    value: 'value1',
    onChange: sinon.spy(),
  };

  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <RadioWidget {...props} />
      </Provider>,
    );
    expect(wrapper.find('.form-radio-buttons').length).to.equal(2);
    wrapper.unmount();
  });

  it('should invoke onChange when a radio button is clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <RadioWidget {...props} onChange={onChange} />
      </Provider>,
    );

    const vaRadio = wrapper.find('VaRadio');
    expect(vaRadio.exists()).to.be.true;

    vaRadio.props().onVaValueChange({ detail: { value: 'no' } });
    expect(onChange.calledWith('no')).to.be.true;
    wrapper.unmount();
  });
});
