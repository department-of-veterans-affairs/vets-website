// libs
import React from 'react';

function Row(props) {
  const { children, classNames = '' } = props;

  return <div className={`row ${classNames}`}>{children}</div>;
}

export default Row;
