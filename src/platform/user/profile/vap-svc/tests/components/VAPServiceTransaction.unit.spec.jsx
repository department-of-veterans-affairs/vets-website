import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import VAPServiceTransaction from '../../components/base/VAPServiceTransaction';
import VAPServiceTransactionPending from '../../components/base/VAPServiceTransactionPending';
import { TRANSACTION_STATUS } from '../../constants';

describe('<VAPServiceTransaction/>', () => {
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
      <VAPServiceTransaction {...props}>
        <div className="content">Children</div>
      </VAPServiceTransaction>,
    );

    expect(component.html(), 'renders children components').to.contain(
      'Children',
    );
    expect(
      component.find('div.content'),
      'renders children components',
    ).to.have.lengthOf(1);
    expect(
      component.find(VAPServiceTransactionPending),
      'does not render a transaction-pending message',
    ).to.have.lengthOf(0);

    component.setProps({
      transaction: {
        data: {
          attributes: { transactionStatus: TRANSACTION_STATUS.REJECTED },
        },
      },
    });

    component.setProps({
      transaction: {
        data: {
          attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED },
        },
      },
    });
    expect(
      component.find(VAPServiceTransactionPending),
      'renders a transaction-pending message when status is RECEIVED',
    ).to.have.lengthOf(1);
    expect(
      component.find('div.content'),
      'does not render children components when status is RECEIVED',
    ).to.have.lengthOf(0);

    component.setProps({
      transaction: {
        data: {
          attributes: {
            transactionStatus: TRANSACTION_STATUS.COMPLETED_FAILURE,
          },
        },
      },
    });
    expect(
      component.find(VAPServiceTransactionPending),
      'does not render a transaction-pending message when status is COMPLETED_FAILURE',
    ).to.have.lengthOf(0);
    expect(
      component.find('div.content'),
      'renders children components when status is COMPLETED_FAILURE',
    ).to.have.lengthOf(1);

    component.unmount();
  });
});
