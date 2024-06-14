import React from 'react';
import PropTypes from 'prop-types';

import { kebabCase } from 'lodash';
import { ORDER_TYPES } from '../utils/constants';

const getOrderItems = (type, orders) => {
  return orders?.filter(order => order.type === type.label);
};

const getOrderListItemsByType = (type, orders) => {
  const items = getOrderItems(type, orders);
  return (
    items?.map((item, idx) => {
      let itemText = item.text;
      if (type === ORDER_TYPES.LAB) itemText += ` (${item.date})`;
      return <li key={idx}>{itemText}</li>;
    }) || []
  );
};

const OrdersBlock = props => {
  const { heading, intro, orders, type } = props;

  const orderListItems = getOrderListItemsByType(type, orders);

  if (orderListItems.length) {
    return (
      <div>
        <h4>{heading}</h4>
        {intro && <div>{intro}</div>}
        <ul className="bulleted-list" data-testid={kebabCase(type.label)}>
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

export default OrdersBlock;

OrdersBlock.propTypes = {
  heading: PropTypes.string,
  intro: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  orders: PropTypes.array,
  type: PropTypes.object,
};
