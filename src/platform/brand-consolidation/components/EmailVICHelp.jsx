import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function EmailVICHelp({ children }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      send us an email at <a href="mailto:vic@va.gov">VIC@va.gov</a>.
    </span>
  );
}
