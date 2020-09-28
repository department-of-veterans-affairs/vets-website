import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import allPayments from '../../../reducers/index';
import createCommonStore from 'platform/startup/store';

const store = createCommonStore(allPayments);

import ViewPaymentsLists from '../../../components/view-payments-lists/ViewPaymentsLists.jsx';

import { payments } from '../../helpers';

describe('View Payments Lists', () => {
  it('renders View Payments Lists component', () => {
    const getAllPayments = sinon.spy();
    const wrapper = render(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={payments}
        getAllPayments={getAllPayments}
      />,
    );
    // We need to set a timeout to wait for the getAllPayments call to resolve
    setTimeout(async () => {
      expect(wrapper.getByText(/Payments you received/)).to.exist;
      expect(getAllPayments.toBeCalled);
      wrapper.unmount();
    }, 3000);
  });

  it('shows a loading indicator when loading', () => {
    const wrapper = render(<ViewPaymentsLists store={store} isLoading />);

    expect(wrapper.getByText(/Loading payment information.../)).to.exist;
    wrapper.unmount();
  });

  it('should render both the tables', () => {
    const getAllPayments = sinon.spy();
    const wrapper = render(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={payments}
        getAllPayments={getAllPayments}
      />,
    );

    setTimeout(async () => {
      expect(wrapper.getByText(/Payments you received/)).to.exist;
      expect(wrapper.getByText(/Payments returned/)).to.exist;
      expect(getAllPayments.toBeCalled);
      wrapper.unmount();
    }, 3000);
  });

  it('should render one table when data for the other in unavailable', () => {
    const getAllPayments = sinon.spy();
    const wrapper = render(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        payments={payments.payments}
        getAllPayments={getAllPayments}
      />,
    );

    setTimeout(async () => {
      expect(wrapper.getByText(/Payments you received/)).to.exist;
      expect(wrapper.getByText(/Payments returned/)).to.not.exist;
      expect(getAllPayments.toBeCalled);
      wrapper.unmount();
    }, 3000);
  });
});
