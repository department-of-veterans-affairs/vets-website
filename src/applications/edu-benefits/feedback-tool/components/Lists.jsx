import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';

const Lists = ({ items, className }) => {
  return (
    <ul className={className?.ul}>
      {items.map((item, index) => {
        return <ListItem key={index} item={item} className={className} />;
      })}
    </ul>
  );
};
Lists.propTypes = {
  items: PropTypes.array,
};
export default Lists;
