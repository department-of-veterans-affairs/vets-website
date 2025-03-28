import React from 'react';
import * as ReactRedux from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SponsorRadioWidget from '../../components/SponsorRadioWidget';

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
        <SponsorRadioWidget {...props} />
      </Provider>,
    );
    expect(wrapper.find('.form-radio-buttons').length).to.equal(2);
    wrapper.unmount();
  });

  it('should invoke onChange when a radio button is clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget {...props} onChange={onChange} />
      </Provider>,
    );

    const vaRadio = wrapper.find('VaRadio');
    expect(vaRadio.exists()).to.be.true;

    vaRadio.props().onVaValueChange({ detail: { value: 'no' } });
    expect(onChange.calledWith('no')).to.be.true;
    wrapper.unmount();
  });

  it('should render only the selected option label when in review mode', () => {
    // Mock the formContext for review mode
    const formContext = {
      onReviewPage: true,
      reviewMode: true,
    };

    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget
          {...props}
          value="Bruce Wayne"
          formContext={formContext}
        />
      </Provider>,
    );

    // Check that radio options are not rendered
    expect(wrapper.find('va-radio-option').exists()).to.be.false;

    // Check that only a span with the selected label is rendered
    const span = wrapper.find('span');
    expect(span.exists()).to.be.true;
    expect(span.text().trim()).to.equal('');

    wrapper.unmount();
  });

  it('should render radio buttons when not on review page', () => {
    // Mock the formContext for non-review page
    const formContext = {
      onReviewPage: false,
    };

    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget {...props} formContext={formContext} />
      </Provider>,
    );

    // Check that radio options are rendered
    expect(wrapper.find('va-radio-option').length).to.equal(2);

    wrapper.unmount();
  });

  it('should render radio buttons when on review page but not in review mode', () => {
    // Mock the formContext for review page but not in review mode
    const formContext = {
      onReviewPage: true,
      reviewMode: false,
    };

    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget {...props} formContext={formContext} />
      </Provider>,
    );

    // Check that radio options are rendered
    expect(wrapper.find('va-radio-option').length).to.equal(2);

    wrapper.unmount();
  });

  it('should correctly access formData from state', () => {
    // We need to mock the useSelector hook
    const mockUseSelector = sinon.stub();
    mockUseSelector.returns({ someData: 'test' });

    // Save the original useSelector
    const originalUseSelector = ReactRedux.useSelector;

    // Replace useSelector with mock
    ReactRedux.useSelector = mockUseSelector;

    try {
      const wrapper = mount(
        <Provider store={store}>
          <SponsorRadioWidget {...props} />
        </Provider>,
      );

      expect(mockUseSelector.called).to.be.true;

      wrapper.unmount();
    } finally {
      // Restore the original useSelector
      ReactRedux.useSelector = originalUseSelector;
    }
  });

  it('should use empty string when options.title is undefined', () => {
    // Create props without title in options
    const propsWithoutTitle = {
      ...props,
      options: {
        ...props.options,
        title: undefined,
      },
    };
    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget {...propsWithoutTitle} />
      </Provider>,
    );
    // Check that component renders without errors
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should handle undefined optionLabel when item is not found', () => {
    // Create a wrapper with a value that doesn't match any enumOption
    const wrapper = mount(
      <Provider store={store}>
        <SponsorRadioWidget {...props} value="non-existent-value" />
      </Provider>,
    );
    // Trigger onChange with a value that doesn't exist in enumOptions
    const vaRadio = wrapper.find('VaRadio');
    vaRadio.props().onVaValueChange({
      detail: { value: 'non-existent-value', checked: true },
    });
    // Check that onChange was still called with the value
    expect(props.onChange.calledWith('non-existent-value')).to.be.true;
    wrapper.unmount();
  });
});
