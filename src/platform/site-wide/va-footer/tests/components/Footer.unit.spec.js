import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup, render } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Footer from '../../components/Footer';
import DesktopLinks from '../../components/DesktopLinks';
import MobileLinks from '../../components/MobileLinks';
import LanguageSupport from '../../components/LanguageSupport';
import { setupMinimalFooter } from '../../index';

const accessibilityUtils = require('../../../../utilities/accessibility/index');

const headerFooter = require('../../../../landing-pages/header-footer-data.json');

const generateProps = () => {
  return {
    footerData: headerFooter.footerData,
    onFooterLoad: sinon.stub().resolves(true),
    showMinimalFooter: false,
  };
};

describe('<Footer>', () => {
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
    props.showMinimalFooter = true;

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
    props.showMinimalFooter = true;

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

describe('static <Footer> minimal-footer with various options', () => {
  const mockStore = path => ({
    getState: () => ({
      i18State: {
        lang: 'en',
      },
      navigation: {
        route: {
          path,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
    router: { push: () => {} },
  });

  const setup = ({ footerHTML, path }) => {
    const staticDom = document.createElement('div');
    staticDom.innerHTML += footerHTML;
    document.body.appendChild(staticDom);

    const props = generateProps();
    props.showMinimalFooter = setupMinimalFooter();

    return render(
      <Provider store={mockStore(path)}>
        <Footer {...props} />
      </Provider>,
    );
  };

  afterEach(() => {
    cleanup();
  });

  const expectMinimalFooterExists = container => {
    // if there are links, that means its the full footer
    expect(container.querySelector('.va-footer-links-bottom')).to.not.exist;
  };

  const expectMinimalFooterDoesNotExist = container => {
    // if there are no links, then its the minimal footer
    expect(container.querySelector('.va-footer-links-bottom')).to.exist;
  };

  it('should render minimal footer if true', () => {
    const { container } = setup({
      footerHTML: '<div id="footerNav" data-minimal-footer="true"></div>',
      path: '/introduction',
    });

    expectMinimalFooterExists(container);
  });

  it('should not render minimal footer if false', () => {
    const { container } = setup({
      footerHTML: '<div id="footerNav" data-minimal-footer="false"></div>',
      path: '/introduction',
    });

    expectMinimalFooterDoesNotExist(container);
  });

  it('should not render minimal footer if true but on an excluded path', () => {
    const { container } = setup({
      footerHTML:
        '<div id="footerNav" data-minimal-footer="true" data-minimal-exclude-paths="[&quot;/introduction&quot;]"></div>',
      path: '/introduction',
    });

    expectMinimalFooterDoesNotExist(container);
  });

  it('should render minimal footer if true and on a path not excluded', () => {
    const { container } = setup({
      footerHTML:
        '<div id="footerNav" data-minimal-footer="true" data-minimal-exclude-paths="[&quot;/introduction&quot;]"></div>',
      path: '/confirmation',
    });

    expectMinimalFooterExists(container);
  });
});
