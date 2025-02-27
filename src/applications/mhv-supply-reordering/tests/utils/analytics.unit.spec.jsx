import { expect } from 'chai';
import sinon from 'sinon';
import analytics from '../../utils/analytics';

const resource = [
  {
    status: 'Order Processed',
    productId: '9997',
    orderId: '1111',
  },
  {
    status: 'Order Processed',
    productId: '9998',
    orderId: '1112',
  },
  {
    status: 'Order Processed',
    productId: '9999',
    orderId: '1111',
  },
];

describe('analytics', () => {
  it('calls recordEventOnce on successful request', () => {
    const recordEventOnce = sinon.spy();
    analytics({
      ok: true,
      resource,
      productIdsCount: 3,
      trackingPrefix: 'prefix-',
      recordEventOnce,
    });
    expect(recordEventOnce.calledOnce).to.be.true;

    const args = {
      event: 'prefix--submission-successful',
      'product-ids-count': 3,
    };
    expect(recordEventOnce.calledWith(args)).to.be.true;
  });

  it('calls recordEventOnce on failed (!ok) request', () => {
    const recordEventOnce = sinon.spy();
    analytics({
      ok: false,
      productIdsCount: 3,
      trackingPrefix: 'prefix-',
      recordEventOnce,
    });
    expect(recordEventOnce.calledOnce).to.be.true;

    const args = {
      event: 'prefix--submission-failure',
      'product-ids-count': 3,
    };
    expect(recordEventOnce.calledWith(args)).to.be.true;
  });

  it('calls recordEventOnce on a partially successful request', () => {
    const pendingProduct = {
      status: 'Order Pending',
      productId: '9996',
      orderId: '1110',
    };
    const recordEventOnce = sinon.spy();
    analytics({
      ok: true,
      resource: [pendingProduct, ...resource],
      productIdsCount: 4,
      trackingPrefix: 'prefix-',
      recordEventOnce,
    });
    expect(recordEventOnce.calledOnce).to.be.true;

    const args = {
      event: 'prefix--submission-successful',
      'partial-failed': true,
      'product-ids-successful': ['9997', '9998', '9999'],
      'product-ids-failed': ['9996'],
      'product-ids-count': 4,
    };
    expect(recordEventOnce.calledWith(args)).to.be.true;
  });

  it('calls recordEventOnce on a successful request with 0 processed products', () => {
    const pendingProducts = [
      {
        status: 'Order Pending',
        productId: '9996',
        orderId: '1110',
      },
      {
        status: 'Order Pending',
        productId: '9997',
        orderId: '1111',
      },
    ];
    const recordEventOnce = sinon.spy();
    analytics({
      ok: true,
      resource: pendingProducts,
      productIdsCount: 2,
      trackingPrefix: 'prefix-',
      recordEventOnce,
    });
    expect(recordEventOnce.calledOnce).to.be.true;

    const args = {
      event: 'prefix--submission-failure',
      'product-ids-failed': ['9996', '9997'],
      'product-ids-count': 2,
    };
    expect(recordEventOnce.calledWith(args)).to.be.true;
  });
});
