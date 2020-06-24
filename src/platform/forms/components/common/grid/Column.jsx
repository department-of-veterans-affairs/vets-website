// libs
import React from 'react';

function Column(props) {
  const { children, classNames = '' } = props;

  return <div className={`${classNames} columns`}>{children}</div>;
}

export default React.memo(Column);
