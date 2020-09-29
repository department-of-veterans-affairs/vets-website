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
  it('renders View Payments Lists component', async () => {
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
    await expect(getAllPayments.toBeCalled);
    await expect(wrapper.findByText(/Payments you received/)).to.exist;
  });

  it('shows a loading indicator when loading', () => {
    const wrapper = render(<ViewPaymentsLists store={store} isLoading />);

    expect(wrapper.getByText(/Loading payment information.../)).to.exist;
  });

  it('should render both the tables', async () => {
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

    await expect(wrapper.findByText(/Payments you received/)).to.exist;
    await expect(wrapper.findByText(/Payments returned/)).to.exist;
  });

  it('should render one table when data for the other in unavailable', async () => {
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

    await expect(wrapper.findByText(/Payments you received/)).to.exist;
    await expect(wrapper.findByText(/Payments returned/)).to.be.empty;
    await expect(getAllPayments.toBeCalled);
  });

  it('shows an info error when no payments are present', async () => {
    const getAllPayments = sinon.spy();
    const wrapper = render(
      <ViewPaymentsLists
        store={store}
        isLoading={false}
        error={false}
        getAllPayments={getAllPayments}
      />,
    );

    await expect(
      wrapper.findByText(/We don’t have a record of VA payments for you/),
    ).to.exist;
  });
});
