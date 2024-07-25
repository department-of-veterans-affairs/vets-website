import React, { useEffect } from 'react';

import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// import { focusElement } from 'platform/utilities/ui';

function TestCheckBox() {
  useEffect(() => {
    // focusElement('.checkbox-test');
  }, []);

  return (
    <div>
      <VaCheckboxGroup label="VA Checkbox Grouping" uswds>
        <va-checkbox
          data-testid="checkbox-component"
          class="checkbox-test"
          name="checkbox"
          label="VA Checkbox"
          checked={false}
          uswds
        />
      </VaCheckboxGroup>
    </div>
  );
}

export default TestCheckBox;
