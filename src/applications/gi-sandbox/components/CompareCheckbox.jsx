import React from 'react';
import Checkbox from './Checkbox';

export default function CompareCheckbox({
  institution,
  compareChecked,
  handleCompareUpdate,
  facilityCode,
}) {
  const name = `Compare ${institution} ${facilityCode}`;
  return (
    <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
      <Checkbox
        label="Compare"
        checked={compareChecked}
        onChange={handleCompareUpdate}
        name={name}
        screenReaderOnly={name}
      />
    </div>
  );
}
