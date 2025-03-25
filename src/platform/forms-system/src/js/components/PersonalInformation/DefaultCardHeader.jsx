import React from 'react';

export const DefaultCardHeader = ({ level = '3' }) => {
  return (
    <h4 className={`vads-u-margin-top--0 vads-u-font-size--h${level}`}>
      Personal information
    </h4>
  );
};
