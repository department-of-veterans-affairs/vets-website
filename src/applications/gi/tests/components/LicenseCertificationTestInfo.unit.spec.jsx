import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import LicenseCertificationTestInfo from '../../components/LicenseCertificationTestInfo';

const mockStore = configureStore([thunk]);

describe('<LicenseCertificationTestInfo>', () => {
  let store;
  let container;
  const OriginalMutationObserver = global.MutationObserver;

  beforeEach(() => {
    store = mockStore({});
    container = document.createElement('div');
    container.className = 'table-wrapper';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    global.MutationObserver = OriginalMutationObserver;
  });

  const mountComponent = props => {
    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <LicenseCertificationTestInfo {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  const singleTest = [
    {
      name: 'Test 1',
      fee: 100.0,
    },
  ];

  const multipleTests = Array(15)
    .fill()
    .map((_, i) => ({
      name: `Test ${i + 1}`,
      fee: 100.0 * (i + 1),
    }));

  it('should render single test view', () => {
    const wrapper = mountComponent({ tests: singleTest });
    expect(wrapper.find('.single-test-wrapper')).to.exist;
    expect(wrapper.text()).to.include('Test name: Test 1');
    expect(wrapper.text()).to.include('$100.00');
  });

  it('should render table view for multiple tests', () => {
    const wrapper = mountComponent({ tests: multipleTests });
    expect(wrapper.find('va-table')).to.exist;
    expect(wrapper.find('va-table-row')).to.have.lengthOf(11);
  });

  it('should show pagination for more than 10 tests', () => {
    const wrapper = mountComponent({ tests: multipleTests });
    expect(wrapper.find(VaPagination)).to.exist;
  });

  it('should handle missing fee data', () => {
    const testsWithMissingFee = [
      {
        name: 'Test 1',
        fee: null,
      },
    ];
    const wrapper = mountComponent({ tests: testsWithMissingFee });
    expect(wrapper.text()).to.include('Test fee not available');
  });

  it('should update results when page changes', () => {
    const wrapper = mountComponent({ tests: multipleTests });
    const pagination = wrapper.find(VaPagination);
    pagination.props().onPageSelect({ detail: { page: 2 } });
    wrapper.update();
    expect(wrapper.text()).to.include('Test 11');
  });

  it('should set usaTable width to "100%" when observer callback is invoked', () => {
    let observerInstance;
    const observeSpy = sinon.spy();
    const disconnectSpy = sinon.spy();

    function FakeMutationObserver(callback) {
      this.callback = callback;
      this.observe = observeSpy;
      this.disconnect = disconnectSpy;
      observerInstance = this;
    }
    FakeMutationObserver.prototype.takeRecords = () => [];
    global.MutationObserver = FakeMutationObserver;

    const vaTable = document.createElement('va-table');
    container.appendChild(vaTable);

    const vaTableInner = document.createElement('va-table-inner');
    const fakeShadowRoot = document.createElement('div');
    const usaTable = document.createElement('div');
    usaTable.className = 'usa-table';
    fakeShadowRoot.appendChild(usaTable);
    Object.defineProperty(vaTableInner, 'shadowRoot', {
      value: fakeShadowRoot,
      configurable: true,
    });
    container.appendChild(vaTableInner);
    const wrapper = mountComponent({ tests: multipleTests });

    expect(observeSpy.calledOnce).to.be.true;

    observerInstance.callback();
    expect(usaTable.style.width).to.equal('100%');

    wrapper.unmount();
  });

  it('should call observer.disconnect on component unmount', () => {
    // eslint-disable-next-line no-unused-vars, no-empty-pattern
    let observerInstance;
    const observeSpy = sinon.spy();
    const disconnectSpy = sinon.spy();

    function FakeMutationObserver(callback) {
      this.callback = callback;
      this.observe = observeSpy;
      this.disconnect = disconnectSpy;
      observerInstance = this;
    }
    FakeMutationObserver.prototype.takeRecords = () => [];
    global.MutationObserver = FakeMutationObserver;

    const vaTable = document.createElement('va-table');
    container.appendChild(vaTable);

    const vaTableInner = document.createElement('va-table-inner');
    const fakeShadowRoot = document.createElement('div');
    const usaTable = document.createElement('div');
    usaTable.className = 'usa-table';
    fakeShadowRoot.appendChild(usaTable);
    Object.defineProperty(vaTableInner, 'shadowRoot', {
      value: fakeShadowRoot,
      configurable: true,
    });
    container.appendChild(vaTableInner);

    const wrapper = mountComponent({
      tests: multipleTests,
    });
    wrapper.unmount();

    expect(disconnectSpy.calledOnce).to.be.true;
  });
  it('should add "usa-table--bordered" and remove "usa-table--borderless" on mobile view', () => {
    const vaTableInner = document.createElement('va-table-inner');
    const fakeShadowRoot = document.createElement('div');
    const usaTable = document.createElement('div');
    usaTable.className = 'usa-table';
    fakeShadowRoot.appendChild(usaTable);
    Object.defineProperty(vaTableInner, 'shadowRoot', {
      value: fakeShadowRoot,
      configurable: true,
    });
    container.appendChild(vaTableInner);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });

    const wrapper = mountComponent({ tests: multipleTests });

    window.dispatchEvent(new Event('resize'));

    expect(usaTable.classList.contains('usa-table--bordered')).to.be.true;
    expect(usaTable.classList.contains('usa-table--borderless')).to.be.false;

    wrapper.unmount();
  });

  it('should add "usa-table--borderless" and remove "usa-table--bordered" on desktop view', () => {
    const vaTableInner = document.createElement('va-table-inner');
    const fakeShadowRoot = document.createElement('div');
    const usaTable = document.createElement('div');
    usaTable.className = 'usa-table';
    fakeShadowRoot.appendChild(usaTable);
    Object.defineProperty(vaTableInner, 'shadowRoot', {
      value: fakeShadowRoot,
      configurable: true,
    });
    container.appendChild(vaTableInner);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const wrapper = mountComponent({ tests: multipleTests });

    window.dispatchEvent(new Event('resize'));

    expect(usaTable.classList.contains('usa-table--borderless')).to.be.true;
    expect(usaTable.classList.contains('usa-table--bordered')).to.be.false;

    wrapper.unmount();
  });

  it('should remove the resize event listener on component unmount', () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    const removeEventListenerSpy = sinon.spy(window, 'removeEventListener');

    const vaTableInner = document.createElement('va-table-inner');
    const fakeShadowRoot = document.createElement('div');
    const usaTable = document.createElement('div');
    usaTable.className = 'usa-table';
    fakeShadowRoot.appendChild(usaTable);
    Object.defineProperty(vaTableInner, 'shadowRoot', {
      value: fakeShadowRoot,
      configurable: true,
    });
    container.appendChild(vaTableInner);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const wrapper = mountComponent({ tests: multipleTests });

    expect(addEventListenerSpy.calledWith('resize')).to.be.true;

    wrapper.unmount();
    expect(removeEventListenerSpy.calledWith('resize')).to.be.true;

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });
});
