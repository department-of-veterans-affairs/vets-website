import React from 'react';
import { dateFormat } from '../util/helpers';

const PrintBottom = () => {
  return (
    <div className="print-only print-bottom vads-u-padding-bottom--0">
      <span>{window.location.href}</span>
      <span>{dateFormat(Date.now())}</span>
    </div>
  );
};

export default PrintBottom;
