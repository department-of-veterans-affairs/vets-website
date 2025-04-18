const transformSubmitResponse = orders => {
  const processedProductIds = orders
    .filter(({ status }) => status.match(/processed/i))
    .map(order => order.productId);

  const pendingProductIds = orders
    .filter(({ status }) => !status.match(/processed/i))
    .map(order => order.productId);

  const orderIds = orders.map(({ orderId }) => orderId);

  return {
    processedProductIds,
    pendingProductIds,
    orderIds: [...new Set(orderIds)],
  };
};

export default transformSubmitResponse;
