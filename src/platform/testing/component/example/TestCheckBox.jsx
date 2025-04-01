import React, { useEffect } from 'react';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

function TestCheckBox() {
  useEffect(() => {
    focusElement('.va-checkbox');
  }, []);

  return (
    <div>
      <h1>Checkbox Test Component</h1>
      <va-checkbox
        class="va-checkbox"
        name="checkbox"
        label="VA Checkbox"
        checked={false}
        uswds
      />
    </div>
  );
}

export default TestCheckBox;
