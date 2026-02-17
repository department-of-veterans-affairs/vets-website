import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent, cleanup } from '@testing-library/react';

import * as ui from 'platform/utilities/ui';
import { PrintPage, mapStateToProps } from '../../containers/PrintPage';

const mockStore = configureStore([]);

describe('<PrintPage/>', () => {
  // Create dummy elements to simulate header, footer, and va-breadcrumbs
  let headerEl;
  let footerEl;
  let breadcrumbsEl;
  const pushSpy = sinon.spy();
  const defaultProps = { router: { push: pushSpy }, enrollmentData: {} };

  beforeEach(() => {
    // Create and add header, footer, and va-breadcrumbs to the document
    headerEl = document.createElement('header');
    footerEl = document.createElement('footer');
    breadcrumbsEl = document.createElement('va-breadcrumbs');
    document.body.appendChild(headerEl);
    document.body.appendChild(footerEl);
    document.body.appendChild(breadcrumbsEl);
    // Stub focusElement so we can avoid real focusing during tests
    if (!ui.focusElement.isSinonStub) {
      sinon.stub(ui, 'focusElement').callsFake(() => {});
    }
  });

  afterEach(() => {
    cleanup();
    // Remove the dummy elements after each test
    document.body.removeChild(headerEl);
    document.body.removeChild(footerEl);
    document.body.removeChild(breadcrumbsEl);
    if (ui.focusElement.isSinonStub) {
      ui.focusElement.restore();
    }
    pushSpy.reset();
  });

  it('should render', () => {
    const store = mockStore({});
    const { container } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    expect(container.querySelector('.gib-info')).to.exist;
  });

  it('should return enrollmentData from state', () => {
    const fakeState = { post911GIBStatus: { enrollmentData: { foo: 'bar' } } };
    const props = mapStateToProps(fakeState);
    expect(props).to.deep.equal({ enrollmentData: { foo: 'bar' } });
  });

  it('should add no-print-no-sr class on mount', () => {
    const store = mockStore({});
    const { unmount } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );

    expect(headerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.true;
    unmount();
  });

  it('should remove no-print-no-sr class on unmount', () => {
    const store = mockStore({});
    const { unmount } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    // Verify classes were added on mount
    expect(headerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.true;
    // Unmount component to trigger componentWillUnmount
    unmount();
    // Verify classes were removed after unmount
    expect(headerEl.classList.contains('no-print-no-sr')).to.be.false;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.false;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.false;
  });

  it('renders a UserInfoSection child (by checking its content)', () => {
    const store = mockStore({});
    const { getByText } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    expect(getByText(/Name\s*:/i)).to.exist;
  });

  it('should render a print button', () => {
    const store = mockStore({});
    const { getByRole } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    const printButton = getByRole('button', {
      name: /print this page/i,
    });
    expect(printButton).to.exist;
  });

  it('should render a back to statement button', () => {
    const store = mockStore({});
    const { getByRole } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    const backButton = getByRole('button', {
      name: /back to statement page/i,
    });
    expect(backButton).to.exist;
  });

  it('should fire a print request when print button clicked', () => {
    const oldPrint = global.window.print;
    const printSpy = sinon.spy();
    global.window.print = printSpy;

    const store = mockStore({});
    const { getByRole } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    const printButton = getByRole('button', {
      name: /print this page/i,
    });
    expect(printSpy.notCalled).to.be.true;

    fireEvent.click(printButton);
    expect(printSpy.calledOnce).to.be.true;

    global.window.print = oldPrint;
  });

  it('should navigate to statement when back to statement button clicked', () => {
    const store = mockStore({});
    const { getByRole } = render(
      <Provider store={store}>
        <PrintPage {...defaultProps} />
      </Provider>,
    );
    const backButton = getByRole('button', {
      name: /back to statement page/i,
    });
    expect(pushSpy.notCalled).to.be.true;

    fireEvent.click(backButton);
    expect(pushSpy.calledOnce).to.be.true;
  });

  it('should default enrollmentData to an empty object when not provided (still renders user info)', () => {
    const store = mockStore({});
    const props = { router: { push: () => {} } }; // enrollmentData omitted
    const { getByText } = render(
      <Provider store={store}>
        <PrintPage {...props} />
      </Provider>,
    );
    expect(getByText(/Name\s*:/i)).to.exist;
  });
});
