import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import allPayments from '../../../reducers/index';
import createCommonStore from 'platform/startup/store';

const store = createCommonStore(allPayments);

import ViewPaymentsLists from '../../../components/view-payments-lists/ViewPaymentsLists.jsx';

import { thePayments } from './helpers';

describe('View Payments Lists', () => {
  it('renders View Payments Lists component', () => {
    const getAllPayments = sinon.spy();
    const wrapper = render(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={thePayments}
        getAllPayments={getAllPayments}
      />,
    );

    expect(wrapper.findByText(/Payments you received/)).to.exist;
    expect(getAllPayments.toBeCalled);
    wrapper.unmount();
  });
  /*
  it('shows a loading indicator when loading', () => {
    const wrapper = shallow(<ViewPaymentsLists store={store} isLoading />);

    expect(wrapper.find('.loading-indicator-container')).to.exist;
    wrapper.unmount();
  });

  it('should render the header above the tables', () => {
    const getAllPayments = sinon.spy();
    const wrapper = mount(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={thePayments}
        getAllPayments={getAllPayments}
      />,
    );

    expect(wrapper.find('.vads-u-font-size--lg')).to.exist;
    wrapper.unmount();
  });

  it('should render the tables', () => {
    const getAllPayments = sinon.spy();
    const wrapper = mount(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={thePayments}
        getAllPayments={getAllPayments}
      />,
    );

    expect(wrapper.find('.va-table')).to.exist;
    wrapper.unmount();
  });

  it('should render an alert when no payments are present', () => {
    const wrapper = shallow(
      <ViewPaymentsLists store={store} isLoading={false} />,
    );

    expect(wrapper.find('.usa-alert-info')).to.exist;
    wrapper.unmount();
  });
  */
});
