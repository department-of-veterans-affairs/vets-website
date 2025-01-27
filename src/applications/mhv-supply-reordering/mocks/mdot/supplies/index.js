// eslint-disable-next-line no-unused-vars
const { unprocessableEntity, internalServerError } = require('../../errors');

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
  'POST /v0/mdot/supplies': (_, res) => res.status(202).json(accepted),
  // 'POST /v0/mdot/supplies': partialOrder,
  // 'POST /v0/mdot/supplies': createOrder,
  // 'POST /v0/mdot/supplies': (_, res) => res.status(422).json(unprocessableEntity),
  // 'POST /v0/mdot/supplies': (_, res) => res.status(500).json(internalServerError),
};
