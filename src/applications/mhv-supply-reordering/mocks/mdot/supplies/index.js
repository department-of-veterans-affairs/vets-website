// eslint-disable-next-line no-unused-vars
const { unprocessableEntity, internalServerError } = require('../../errors');

// eslint-disable-next-line no-unused-vars
const accepted = [
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

// eslint-disable-next-line no-unused-vars
const failure = [
  {
    status:
      'Unable to order item since the last order was less than 5 months ago.',
    orderId: 0,
    productId: 6650,
  },
];

// eslint-disable-next-line no-unused-vars
const createOrder = (request, response) => {
  const { order } = request.body;
  const responseBody = order.map(({ productId }, i) => ({
    status: 'Order Processed',
    orderId: `${1000 + i}`,
    productId,
  }));
  return response.json(responseBody);
};

module.exports = {
  // 'POST /v0/mdot/supplies': (_, res) => res.status(200).json(accepted),
  // 'POST /v0/mdot/supplies': partialOrder,
  // 'POST /v0/mdot/supplies': createOrder,
  'POST /v0/mdot/supplies': (_, res) => res.status(200).json(failure),
  // 'POST /v0/mdot/supplies': (_, res) => res.status(422).json(unprocessableEntity),
  // 'POST /v0/mdot/supplies': (_, res) => res.status(500).json(internalServerError),
};
