import React from 'react';
import PropTypes from 'prop-types';

const ItemList = props => {
  const { list } = props;
  if (typeof list === 'string')
    return (
      <span
        data-dd-privacy="mask"
        data-dd-action-name="[list item]"
        data-testid="item-list-string"
      >
        {list}
      </span>
    );
  if (list?.length > 1) {
    return (
      <ul className="vads-u-margin-top--0 item-list">
        {list.map((item, idx) => {
          return (
            <li
              key={idx}
              className="vads-u-margin-bottom--0"
              data-dd-privacy="mask"
              data-dd-action-name="[list item]"
              data-testid="list-item-multiple"
            >
              {item}
            </li>
          );
        })}
      </ul>
    );
  }
  if (list?.length === 1) {
    return (
      <span
        data-testid="list-item-single"
        data-dd-privacy="mask"
        data-dd-action-name="[list item]"
        style={{ whiteSpace: 'pre-line' }}
      >
        {list[0]}
      </span>
    );
  }
  return <p className="vads-u-margin-top--0">None recorded</p>;
};

export default ItemList;

ItemList.propTypes = {
  list: PropTypes.any,
};
