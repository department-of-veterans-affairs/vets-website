import React from 'react';

import { OptOutCheckboxLabel } from '../content/OptOutOfOldAppeals';

const OptOutCheckboxWidget = ({ onChange, value = false }) => (
  <>
    <input
      type="checkbox"
      id="legacyOptInApproved"
      checked={value}
      onChange={({ target }) => {
        onChange(target.checked);
      }}
    />
    <label name="legacyOptInApproved-label" htmlFor="legacyOptInApproved">
      {OptOutCheckboxLabel}
    </label>
  </>
);

export default OptOutCheckboxWidget;
