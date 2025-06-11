import { expect } from 'chai';
import transformSubmitResponse from '../../utils/transformSubmitResponse';

let resource;

describe('transformSubmitResponse', () => {
  it('transforms the response data', () => {
    resource = [
      {
        status: 'Order Processed',
        productId: '9997',
        orderId: '1111',
      },
      {
        status: 'Order Pending',
        productId: '9998',
        orderId: '1112',
      },
      {
        status: 'Order Processed',
        productId: '9999',
        orderId: '1111',
      },
    ];

    const {
      processedProductIds,
      pendingProductIds,
      orderIds,
    } = transformSubmitResponse(resource);
    expect(processedProductIds).to.deep.equal(['9997', '9999']);
    expect(pendingProductIds).to.deep.equal(['9998']);
    expect(orderIds).to.deep.equal(['1111', '1112']);
  });

  it('handles an empty array', () => {
    const {
      processedProductIds,
      pendingProductIds,
      orderIds,
    } = transformSubmitResponse([]);
    expect(processedProductIds).to.deep.equal([]);
    expect(pendingProductIds).to.deep.equal([]);
    expect(orderIds).to.deep.equal([]);
  });
});
