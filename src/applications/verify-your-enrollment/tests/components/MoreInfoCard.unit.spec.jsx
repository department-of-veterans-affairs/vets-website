import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MoreInforCared from '../../components/MoreInfoCard';
import PageLink from '../../components/PageLink';

describe('<MoreInfoCard />', () => {
  const mockStore = configureStore([]);
  const defaultProps = {
    marginTop: '2',
    linkText: 'Test link text',
    relativeURL: '/test-url',
    URL: 'https://www.test.com',
    className: 'test-class',
    linkDescription: 'Test link description',
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
        <MoreInforCared {...defaultProps} {...props} />
      </Provider>,
    );
  };

  it('renders without crashing under normal conditions', () => {
    const wrapper = renderComponent();
    expect(wrapper.isEmptyRender()).to.be.false;
    expect(wrapper.find('h3').text()).to.equal('More information');
    const pageLinkProps = wrapper
      .find(PageLink)
      .at(0)
      .props();
    expect(pageLinkProps.linkText).to.equal(defaultProps.linkText);
    expect(pageLinkProps.relativeURL).to.equal(defaultProps.relativeURL);
    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.equal(defaultProps.linkDescription);
    const manageDebtLinkProps = wrapper
      .find(PageLink)
      .at(1)
      .props();
    expect(manageDebtLinkProps.linkText).to.equal('Manage your VA debt');
    expect(manageDebtLinkProps.URL).to.equal(
      'https://www.va.gov/manage-va-debt/',
    );
  });

  it('returns null (does not render) if `response.error.error` is Forbidden', () => {
    const wrapper = renderComponent({
      error: { error: 'Forbidden' },
    });
    expect(wrapper.isEmptyRender()).to.be.true;
  });

  it('returns null (does not render) if `response.personalInfo` is missing', () => {
    const wrapper = renderComponent({
      personalInfo: null,
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
});
