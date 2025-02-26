import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LicenseCertificationTestInfo from '../../components/LicenseCertificationTestInfo';

const mockStore = configureStore([thunk]);

describe('<LicenseCertificationTestInfo>', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
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
    expect(wrapper.find('va-table-row')).to.have.lengthOf(11); // 10 items + header
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
});
