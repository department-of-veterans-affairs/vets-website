import React from 'react';
import { expect } from 'chai';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { App } from '../../components/App';
import * as MobileHeader from '../../components/Header';
import * as helpers from '../../helpers';

const mockStore = {
  getState: () => ({}),
  subscribe: () => {},
  dispatch: () => {},
  router: { push: () => {} },
};

const MockMobileHeader = () => <div>Mobile header</div>;

describe('Header <App>', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(MobileHeader, 'default').callsFake(MockMobileHeader);
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
    cleanup();
  });

  function setupHeader(options = {}) {
    const show = options.show ?? true;
    const { showMinimalHeader } = options;
    const staticDom = document.createElement('div');
    document.body.appendChild(staticDom);

    if (showMinimalHeader !== undefined) {
      staticDom.innerHTML += `
      <div id="header-minimal" class="vads-u-display--none">
        Minimal header
      </div>
    `;
    }

    staticDom.innerHTML += `
      <header role="banner" id="header-default">
        <div
          data-widget-type="header"
          id="header-v2"
        ></div>
        <div id="desktop-header" class="vads-u-display--none">
          Legacy header
        </div>
      </header>
    `;

    const header = staticDom.querySelector('#header-v2');

    const renderProps = render(
      <Provider store={mockStore}>
        <App show={show} showMinimalHeader={showMinimalHeader} />
      </Provider>,
      { container: header },
    );

    return { ...renderProps, staticDom };
  }

  it('renders no header if show is false', () => {
    const { queryByText, staticDom } = setupHeader({ show: false });
    expect(staticDom.querySelector('#desktop-header')).to.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.not.exist;
    expect(staticDom.querySelector('#header-minimal')).to.not.exist;

    document.body.removeChild(staticDom);
  });

  it('renders legacy header when our width is more than 768px', () => {
    window.innerWidth = 768;
    const showDesktopHeaderSpy = sinon.spy(helpers, 'showDesktopHeader');
    const hideDesktopHeaderSpy = sinon.spy(helpers, 'hideDesktopHeader');
    const toggleMinimalHeader = sinon.spy(helpers, 'toggleMinimalHeader');

    const { queryByText, staticDom } = setupHeader();

    expect(showDesktopHeaderSpy.called).to.be.true;
    expect(hideDesktopHeaderSpy.called).to.be.false;
    expect(toggleMinimalHeader.called).to.be.false;

    expect(staticDom.querySelector('#header-default')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(staticDom.querySelector('#desktop-header')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.not.exist;
    expect(staticDom.querySelector('#header-minimal')).to.not.exist;

    document.body.removeChild(staticDom);
    showDesktopHeaderSpy.restore();
    hideDesktopHeaderSpy.restore();
    toggleMinimalHeader.restore();
  });

  it('renders header v2 (mobile) when our width is less than 768px', () => {
    window.innerWidth = 767;
    const showDesktopHeaderSpy = sinon.spy(helpers, 'showDesktopHeader');
    const hideDesktopHeaderSpy = sinon.spy(helpers, 'hideDesktopHeader');
    const toggleMinimalHeader = sinon.spy(helpers, 'toggleMinimalHeader');

    const { queryByText, staticDom } = setupHeader();

    expect(showDesktopHeaderSpy.called).to.be.false;
    expect(hideDesktopHeaderSpy.called).to.be.true;
    expect(toggleMinimalHeader.called).to.be.false;

    expect(staticDom.querySelector('#header-default')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(staticDom.querySelector('#desktop-header')).to.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.exist;
    expect(staticDom.querySelector('#header-minimal')).to.not.exist;

    document.body.removeChild(staticDom);
    showDesktopHeaderSpy.restore();
    hideDesktopHeaderSpy.restore();
    toggleMinimalHeader.restore();
  });

  it('renders minimal-header when applicable', () => {
    window.innerWidth = 768;
    const showDesktopHeaderSpy = sinon.spy(helpers, 'showDesktopHeader');
    const hideDesktopHeaderSpy = sinon.spy(helpers, 'hideDesktopHeader');
    const toggleMinimalHeader = sinon.spy(helpers, 'toggleMinimalHeader');

    const { queryByText, staticDom } = setupHeader({ showMinimalHeader: true });

    expect(toggleMinimalHeader.calledWith(true)).to.be.true;
    expect(staticDom.querySelector('#header-default')).to.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.not.exist;
    expect(staticDom.querySelector('#header-minimal')).to.exist;

    document.body.removeChild(staticDom);
    showDesktopHeaderSpy.restore();
    hideDesktopHeaderSpy.restore();
    toggleMinimalHeader.restore();
  });

  it('renders legacy if minimal-header is false and is Desktop size', () => {
    window.innerWidth = 768;
    const showDesktopHeaderSpy = sinon.spy(helpers, 'showDesktopHeader');
    const hideDesktopHeaderSpy = sinon.spy(helpers, 'hideDesktopHeader');
    const toggleMinimalHeader = sinon.spy(helpers, 'toggleMinimalHeader');

    const { queryByText, staticDom } = setupHeader({
      showMinimalHeader: () => false,
    });

    expect(showDesktopHeaderSpy.called).to.be.true;
    expect(hideDesktopHeaderSpy.called).to.be.false;
    expect(toggleMinimalHeader.calledWith(false)).to.be.true;

    expect(staticDom.querySelector('#header-default')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(staticDom.querySelector('#desktop-header')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.not.exist;
    expect(staticDom.querySelector('#header-minimal')).to.have.class(
      'vads-u-display--none',
    );

    document.body.removeChild(staticDom);
    showDesktopHeaderSpy.restore();
    hideDesktopHeaderSpy.restore();
    toggleMinimalHeader.restore();
  });

  it('renders mobile if minimal-header is false and is mobile size', () => {
    window.innerWidth = 767;
    const showDesktopHeaderSpy = sinon.spy(helpers, 'showDesktopHeader');
    const hideDesktopHeaderSpy = sinon.spy(helpers, 'hideDesktopHeader');
    const toggleMinimalHeader = sinon.spy(helpers, 'toggleMinimalHeader');

    const { queryByText, staticDom } = setupHeader({
      showMinimalHeader: () => false,
    });

    expect(showDesktopHeaderSpy.called).to.be.false;
    expect(hideDesktopHeaderSpy.called).to.be.true;
    expect(toggleMinimalHeader.calledWith(false)).to.be.true;

    expect(staticDom.querySelector('#header-default')).to.not.have.class(
      'vads-u-display--none',
    );
    expect(staticDom.querySelector('#desktop-header')).to.have.class(
      'vads-u-display--none',
    );
    expect(queryByText('Mobile header')).to.exist;
    expect(staticDom.querySelector('#header-minimal')).to.have.class(
      'vads-u-display--none',
    );

    document.body.removeChild(staticDom);
    showDesktopHeaderSpy.restore();
    hideDesktopHeaderSpy.restore();
    toggleMinimalHeader.restore();
  });
});
