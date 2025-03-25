import React from 'react';
import { expect } from 'chai';
import { cleanup, render, waitFor, fireEvent } from '@testing-library/react';
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
  let showDesktopHeader;
  let hideDesktopHeader;
  let toggleMinimalHeader;
  let staticDom;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(MobileHeader, 'default').callsFake(MockMobileHeader);
    showDesktopHeader = sandbox.spy(helpers, 'showDesktopHeader');
    hideDesktopHeader = sandbox.spy(helpers, 'hideDesktopHeader');
    toggleMinimalHeader = sandbox.spy(helpers, 'toggleMinimalHeader');
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
    cleanup();
    staticDom = null;
  });

  function setupHeader(options = {}) {
    const show = options.show ?? true;
    const { showMinimalHeader } = options;
    staticDom = document.createElement('div');

    if (showMinimalHeader) {
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
        <div id="legacy-header" class="vads-u-display--none">
          Legacy header
        </div>
      </header>
    `;

    document.body.appendChild(staticDom);
    const header = staticDom.querySelector('#header-v2');

    const renderProps = render(
      <Provider store={mockStore}>
        <App show={show} showMinimalHeader={showMinimalHeader} />
      </Provider>,
      { container: header },
    );

    return { ...renderProps };
  }

  it('renders no header if show is false', async () => {
    const { queryByText } = setupHeader({ show: false });

    await waitFor(() => {
      expect(staticDom.querySelector('#legacy-header')).to.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.not.exist;
      expect(staticDom.querySelector('#header-minimal')).to.not.exist;
    });
  });

  it('renders legacy header when our width is more than 768px', async () => {
    Object.assign(window, { innerWidth: 768 });
    fireEvent(window, new Event('resize'));
    const { queryByText } = setupHeader();

    await waitFor(() => {
      expect(showDesktopHeader.called).to.be.true;
      expect(hideDesktopHeader.called).to.be.false;
      expect(toggleMinimalHeader.called).to.be.false;
      expect(staticDom.querySelector('#header-default')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(staticDom.querySelector('#legacy-header')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.not.exist;
      expect(staticDom.querySelector('#header-minimal')).to.not.exist;
    });
  });

  it('renders header v2 (mobile) when our width is less than 768px', async () => {
    Object.assign(window, { innerWidth: 767 });
    fireEvent(window, new Event('resize'));
    const { queryByText } = setupHeader();

    await waitFor(() => {
      expect(showDesktopHeader.called).to.be.false;
      expect(hideDesktopHeader.called).to.be.true;
      expect(toggleMinimalHeader.called).to.be.false;

      expect(staticDom.querySelector('#header-default')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(staticDom.querySelector('#legacy-header')).to.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.exist;
      expect(staticDom.querySelector('#header-minimal')).to.not.exist;
    });
  });

  it('renders minimal-header when applicable', async () => {
    Object.assign(window, { innerWidth: 768 });
    fireEvent(window, new Event('resize'));
    const { queryByText } = setupHeader({ showMinimalHeader: true });

    await waitFor(() => {
      expect(toggleMinimalHeader.calledWith(true)).to.be.true;
      expect(staticDom.querySelector('#header-default')).to.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.not.exist;
      expect(staticDom.querySelector('#header-minimal')).to.exist;
    });
  });

  it('renders legacy if minimal-header is false and is Desktop size', async () => {
    Object.assign(window, { innerWidth: 768 });
    fireEvent(window, new Event('resize'));
    const { queryByText } = setupHeader({
      showMinimalHeader: () => false,
    });

    await waitFor(() => {
      expect(showDesktopHeader.called).to.be.true;
      expect(hideDesktopHeader.called).to.be.false;
      expect(toggleMinimalHeader.calledWith(false)).to.be.true;

      expect(staticDom.querySelector('#header-default')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(staticDom.querySelector('#legacy-header')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.not.exist;
      expect(staticDom.querySelector('#header-minimal')).to.have.class(
        'vads-u-display--none',
      );
    });
  });

  it('renders mobile if minimal-header is false and is mobile size', async () => {
    Object.assign(window, { innerWidth: 767 });
    fireEvent(window, new Event('resize'));
    const { queryByText } = setupHeader({
      showMinimalHeader: () => false,
    });

    await waitFor(() => {
      expect(showDesktopHeader.called).to.be.false;
      expect(hideDesktopHeader.called).to.be.true;
      expect(toggleMinimalHeader.calledWith(false)).to.be.true;

      expect(staticDom.querySelector('#header-default')).to.not.have.class(
        'vads-u-display--none',
      );
      expect(staticDom.querySelector('#legacy-header')).to.have.class(
        'vads-u-display--none',
      );
      expect(queryByText('Mobile header')).to.exist;
      expect(staticDom.querySelector('#header-minimal')).to.have.class(
        'vads-u-display--none',
      );
    });
  });
});
