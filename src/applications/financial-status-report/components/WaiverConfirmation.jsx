import React, { useState, useEffect } from 'react';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const WaiverConfirmation = () => {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(
    () => {
      setError(!checked);
    },
    [checked],
  );

  return (
    <div className="eduWaiverCheckbox">
      <Checkbox
        checked={checked}
        onValueChange={value => setChecked(value)}
        label="By checking this box, I’m agreeing that I understand how a debt 
        waiver may affect my VA education benefits. If VA grants me a waiver, 
        this will reduce any remaining education benefit entitlement I may have."
        errorMessage={error && 'Must acknowledge by checking box'}
        required
      />
      <p>
        Note: If you have questions about this, call us at 800-827-0648 (or
        1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30
        a.m. to 7:00 p.m. ET.
      </p>
    </div>
  );
};

// export default {
//   required: true,
//   CustomComponent: WaiverConfirmation,
// };

export default WaiverConfirmation;
