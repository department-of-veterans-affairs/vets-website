import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { VAPServiceTransactionReporter } from '../../containers/VAPServiceTransactionReporter';

describe('<VAPServiceTransactionReporter/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      clearTransaction() {},
      mostRecentErroredTransaction: null,
      erroredTransactions: null,
    };
  });

  it('renders nothing when there are no successful or errored transactions', () => {
    const component = enzyme.shallow(
      <VAPServiceTransactionReporter {...props} />,
    );
    expect(component.text()).to.be.equal('');
    component.unmount();
  });

  it('renders a success or error component when there are success or errored transactions', () => {
    props.erroredTransactions = [
      { data: { attributes: { transactionId: 'transaction_2' } } },
    ];

    props.mostRecentErroredTransaction = props.erroredTransactions[0];

    const component = enzyme.shallow(
      <VAPServiceTransactionReporter {...props} />,
    );

    const vapServiceTransactionErrorBanner = component.find(
      'VAPServiceTransactionErrorBanner',
    );
    expect(
      vapServiceTransactionErrorBanner,
      'the errored transaction rendered',
    ).to.have.lengthOf(1);
    component.unmount();
  });

  it('calls clearTransaction on each errored transaction', () => {
    props.clearTransaction = sinon.stub();
    props.erroredTransactions = [
      { data: { attributes: { transactionId: 'transaction_1' } } },
      { data: { attributes: { transactionId: 'transaction_2' } } },
      { data: { attributes: { transactionId: 'transaction_3' } } },
    ];
    props.mostRecentErroredTransaction = props.erroredTransactions[0];

    const component = enzyme.shallow(
      <VAPServiceTransactionReporter {...props} />,
    );

    const errorBanner = component.find('VAPServiceTransactionErrorBanner');
    errorBanner.props().clearTransaction();

    expect(
      props.clearTransaction.callCount,
      'Closing the success banner resulted in a call to clearTransaction for each successful transaction',
    ).to.be.equal(props.erroredTransactions.length);
    component.unmount();
  });
});
