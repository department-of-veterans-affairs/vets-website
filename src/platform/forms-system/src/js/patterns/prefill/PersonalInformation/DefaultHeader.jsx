import React from 'react';
import { isMinimalHeaderPath } from 'platform/forms-system/src/js/patterns/minimal-header';

export const DefaultHeader = () => {
  const isMinimalHeader = isMinimalHeaderPath();
  const HeaderTag = isMinimalHeader ? 'h1' : 'h3';
  const headerClass = isMinimalHeader
    ? 'vads-u-margin-bottom--3 vads-u-font-size--h2'
    : 'vads-u-margin-bottom--3';

  return (
    <HeaderTag className={headerClass}>
      Confirm the personal information we have on file for you
    </HeaderTag>
  );
};
