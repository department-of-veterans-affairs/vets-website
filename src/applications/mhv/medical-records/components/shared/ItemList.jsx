import React from 'react';
import PropTypes from 'prop-types';

const ItemList = props => {
  const { list } = props;
  if (typeof list === 'string') return list;
  if (list?.length > 1) {
    return (
      <ul className="vads-u-margin-top--0 item-list">
        {list.map((item, idx) => {
          return (
            <li key={idx} className="vads-u-margin-bottom--0">
              {item}
            </li>
          );
        })}
      </ul>
    );
  }
  if (list?.length === 1) {
    return list[0];
  }
  return <p className="vads-u-margin-top--0">None noted</p>;
};

export default ItemList;

ItemList.propTypes = {
  list: PropTypes.any,
};
