import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Vet360Transaction from '../../components/base/Transaction';
import { TRANSACTION_STATUS } from '../../constants';

describe('<Vet360Transaction/>', () => {
  let props = null;
  beforeEach(() => {
    props = {
      refreshTransaction: sinon.stub(),
      title: 'Some title',
      transaction: null,
    };
  });

  it('renders', () => {
    const component = enzyme.shallow(
      <Vet360Transaction {...props}>
        <div>Children</div>
      </Vet360Transaction>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );

    component.setProps({
      transaction: {
        data: {
          attributes: { transactionStatus: TRANSACTION_STATUS.REJECTED },
        },
      },
    });

    expect(
      component.find('Vet360TransactionInlineErrorMessage'),
      'renders error messages',
    ).to.have.lengthOf(1);

    component.setProps({
      transaction: {
        data: {
          attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED },
        },
      },
    });

    expect(
      component.find('Vet360TransactionPending'),
      'renders a transaction-pending message',
    ).to.have.lengthOf(1);
    expect(
      component.html(),
      'does not render children components when there is a pending transaction',
    ).to.not.contain('Children');
  });
});
