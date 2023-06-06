import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Footer from '../../components/Footer';
import DesktopLinks from '../../components/DesktopLinks';
import MobileLinks from '../../components/MobileLinks';
import LanguageSupport from '../../components/LanguageSupport';

const accessibilityUtils = require('../../../../utilities/accessibility/index');

const headerFooter = require('../../../../landing-pages/header-footer-data.json');

describe('<Footer>', () => {
  const generateProps = () => {
    return {
      footerData: headerFooter.footerData,
      onFooterLoad: sinon.stub().resolves(true),
      minimalFooter: false,
    };
  };

  let props = generateProps();
  const middleware = [];
  const mockStore = configureStore(middleware);
  const state = {
    i18State: {
      lang: 'en',
    },
  };
  const store = mockStore(state);

  const isWideScreen = sinon
    .stub(accessibilityUtils, 'isWideScreen')
    .returns(true);

  afterEach(() => {
    props = generateProps();
    isWideScreen.returns(true);
  });

  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find('.footer-inner').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render Desktop Links on wide screens', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(DesktopLinks).exists()).to.be.true;
    expect(wrapper.find(DesktopLinks).props().visible).to.be.true;

    wrapper.unmount();
  });

  it('should not render Desktop Links on mobile screens', () => {
    isWideScreen.returns(false);

    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(DesktopLinks).exists()).to.be.true;
    expect(wrapper.find(DesktopLinks).props().visible).to.be.false;

    wrapper.unmount();
  });

  it('should render Mobile Links on mobile screens', () => {
    isWideScreen.returns(false);

    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(MobileLinks).exists()).to.be.true;
    expect(wrapper.find(MobileLinks).props().visible).to.be.true;

    wrapper.unmount();
  });

  it('should not render Mobile Links on desktop screens', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(MobileLinks).exists()).to.be.true;
    expect(wrapper.find(MobileLinks).props().visible).to.be.false;

    wrapper.unmount();
  });

  it('should render Language Support Links on wide screens', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(LanguageSupport).exists()).to.be.true;

    wrapper.unmount();
  });

  it('should render Language Support Links on mobile screens', () => {
    isWideScreen.returns(false);

    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find(LanguageSupport).exists()).to.be.true;

    wrapper.unmount();
  });

  it('should only show the Logo on desktop screens when the minimal footer is enabled', () => {
    props.minimalFooter = true;

    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find('.footer-banner').exists()).to.be.true;
    expect(wrapper.find('.va-footer-links-bottom').exists()).to.be.false;
    expect(wrapper.find(MobileLinks).props().visible).to.be.false;
    expect(wrapper.find(LanguageSupport).exists()).to.be.false;

    wrapper.unmount();
  });

  it('should only show the Logo and VCL banner on mobile screens when the minimal footer is enabled', () => {
    isWideScreen.returns(false);
    props.minimalFooter = true;

    const wrapper = mount(
      <Provider store={store}>
        <Footer {...props} />
      </Provider>,
    );
    expect(wrapper.find('.footer-banner').exists()).to.be.true;
    expect(wrapper.find('#footer-crisis-line').exists()).to.be.true;
    expect(wrapper.find(LanguageSupport).exists()).to.be.false;
    expect(wrapper.find('.va-footer-links-bottom').exists()).to.be.false;
    expect(wrapper.find('.va-footer-accordion-content').exists()).to.be.false;

    wrapper.unmount();
  });
});
