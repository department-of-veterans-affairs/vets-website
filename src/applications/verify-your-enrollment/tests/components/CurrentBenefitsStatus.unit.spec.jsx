import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import CurrentBenefitsStatus from '../../components/CurrentBenefitsStatus';

describe('<CurrentBenefitsStatus />', () => {
  const mockStore = configureStore([]);
  const defaultProps = {
    updated: 'January 1, 2025',
    remainingBenefits: '24 months',
    expirationDate: 'December 31, 2028',
    link: () => <a href="https://www.va.gov">Go to VA.gov</a>,
  };
  const renderComponent = (storeStateOverrides = {}, props = {}) => {
    const store = mockStore({
      personalInfo: {
        error: null,
        personalInfo: {
          status: 200,
          verificationRecord: { status: 200 },
        },
        ...storeStateOverrides,
      },
    });

    return mount(
      <Provider store={store}>
        <CurrentBenefitsStatus {...defaultProps} {...props} />
      </Provider>,
    );
  };

  it('renders without crashing under normal conditions', () => {
    const wrapper = renderComponent();
    expect(wrapper.isEmptyRender()).to.be.false;
    expect(wrapper.find('h2').text()).to.include('UPDATED January 1, 2025');
    expect(wrapper.find('h2').text()).to.include('Current benefits status');
    expect(wrapper.text()).to.include('Remaining benefits');
    expect(wrapper.text()).to.include('24 months');
    expect(wrapper.text()).to.include('Delimiting date');
    expect(wrapper.text()).to.include('December 31, 2028');
    expect(wrapper.text()).to.include(
      'Benefits end 10 years from the date of your last discharge',
    );
    expect(wrapper.find('a[href="https://www.va.gov"]')).to.have.lengthOf(1);
    expect(wrapper.find('a').text()).to.equal('Go to VA.gov');
  });

  it('returns null (does not render) if personalInfo is missing', () => {
    const wrapper = renderComponent({
      personalInfo: null,
    });
    expect(wrapper.isEmptyRender()).to.be.true;
  });

  it('returns null (does not render) if error.error is "Forbidden"', () => {
    const wrapper = renderComponent({
      error: { error: 'Forbidden' },
    });
    expect(wrapper.isEmptyRender()).to.be.true;
  });

  it('returns null (does not render) if verificationRecord.status or personalInfo.status is 204', () => {
    const wrapper1 = renderComponent({
      personalInfo: {
        verificationRecord: { status: 204 },
        status: 200,
      },
    });
    expect(wrapper1.isEmptyRender()).to.be.true;
    const wrapper2 = renderComponent({
      personalInfo: {
        verificationRecord: { status: 200 },
        status: 204,
      },
    });
    expect(wrapper2.isEmptyRender()).to.be.true;
  });

  it('does not render expiration date elements if expirationDate is absent', () => {
    const wrapper = renderComponent({}, { expirationDate: null });
    expect(wrapper.text()).to.not.include('Delimiting date');
    expect(wrapper.text()).to.not.include(
      'Benefits end 10 years from the date of your last discharge',
    );
  });

  it('does not render link if link prop is absent', () => {
    const wrapper = renderComponent({}, { link: null });
    expect(wrapper.find('a')).to.have.lengthOf(0);
  });
});
