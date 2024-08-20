import React from 'react';
import PropTypes from 'prop-types';

const ListWrapper = props => {
  const { children, count, className, testId } = props;
  if (count === 1) {
    return (
      <div className={className} data-testid={testId}>
        {children}
      </div>
    );
  }
  return (
    <ul className={className} data-testid={testId}>
      {children}
    </ul>
  );
};

ListWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

export default ListWrapper;
