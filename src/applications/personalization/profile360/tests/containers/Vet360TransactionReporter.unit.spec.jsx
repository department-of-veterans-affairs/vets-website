import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Vet360TransactionReporter } from '../../containers/Vet360TransactionReporter';

describe('<Vet360ProfileField/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      clearTransaction() {},
      mostRecentSuccessfulTransaction: null,
      mostRecentErroredTransaction: null,
      successfulTransactions: null,
      erroredTransactions: null
    };
  });

  it('renders nothing when there are no successful or errored transactions', () => {
    const component = enzyme.shallow(
      <Vet360TransactionReporter {...props}/>
    );
    expect(component.text()).to.be.equal('');
  });

  it('renders a success or error component when there are success or errored transactions', () => {
    props.successfulTransactions = [
      { data: { attributes: { transactionId: 'transaction_1' } } }
    ];
    props.erroredTransactions = [
      { data: { attributes: { transactionId: 'transaction_2' } } }
    ];

    props.mostRecentSuccessfulTransaction = props.successfulTransactions[0];
    props.mostRecentErroredTransaction = props.erroredTransactions[0];

    const component = enzyme.shallow(
      <Vet360TransactionReporter {...props}/>
    );

    const successBanner = component.find('Vet360TransactionSuccessBanner');
    expect(successBanner, 'the successful transaction rendered a banner').to.have.lengthOf(1);

    const vet360TransactionErrorBanner  = component.find('Vet360TransactionErrorBanner');
    expect(vet360TransactionErrorBanner, 'the errored transaction rendered').to.have.lengthOf(1);
  });

  it('calls clearTransaction on each successful transaction', () => {
    props.clearTransaction = sinon.stub();
    props.successfulTransactions = [
      { data: { attributes: { transactionId: 'transaction_1' } } },
      { data: { attributes: { transactionId: 'transaction_2' } } },
      { data: { attributes: { transactionId: 'transaction_3' } } }
    ];
    props.mostRecentSuccessfulTransaction = props.successfulTransactions[0];

    const component = enzyme.shallow(
      <Vet360TransactionReporter {...props}/>
    );

    const successBanner = component.find('Vet360TransactionSuccessBanner');
    successBanner.props().clearTransaction();

    expect(props.clearTransaction.callCount,
      'Closing the success banner resulted in a call to clearTransaction for each successful transaction'
    ).to.be.equal(props.successfulTransactions.length);
  });

});
