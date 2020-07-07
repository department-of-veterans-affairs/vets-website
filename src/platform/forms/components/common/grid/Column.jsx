// libs
import React from 'react';

// TODO: for JSDocs
function Column(props) {
  const { children, classNames = '' } = props;

  return <div className={`${classNames} columns`}>{children}</div>;
}

export default Column;
