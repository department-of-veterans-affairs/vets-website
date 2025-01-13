const ok = [
  {
    status: 'Order Processed',
    orderId: '12345',
    productId: '9999',
  },
];

// eslint-disable-next-line no-unused-vars
const partialOrder = [
  {
    status: 'Order Processed',
    orderId: '12345',
    productId: '9999',
  },
  {
    status: 'Order Pending',
    orderId: '12346',
    productId: '9998',
  },
];

module.exports = {
  'POST /v0/mdot/supplies': ok,
};
