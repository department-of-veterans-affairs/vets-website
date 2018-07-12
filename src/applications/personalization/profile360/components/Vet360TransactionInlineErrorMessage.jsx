import React from 'react';

import {
  hasUserIsDeceasedError
} from '../util/transactions';

export default function Vet360TransactionInlineErrorMessage({ title: fieldTitle, transaction }) {
  let content = null;
  switch (true) {
    case hasUserIsDeceasedError(transaction):
      content = <span>We can’t make this update because our records show the Veteran is deceased. If this isn’t true, please contact your nearest VA medical center. <a href="/facilities/">Find your nearest VA medical center</a>.</span>;
      break;

    default:
      content = <span>We couldn’t save your recent {fieldTitle.toLowerCase()} update. Please try again later.</span>;
  }

  return <div className="usa-input-error-message">{content}</div>;
}
