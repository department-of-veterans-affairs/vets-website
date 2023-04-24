import React from 'react';
import Checkbox from './Checkbox';

export default function CompareCheckbox({
  institution,
  compareChecked,
  handleCompareUpdate,
  cityState,
}) {
  const name = `${institution} ${cityState}`;
  return (
    <div className="vads-u-padding--0 vads-u-margin-top--neg2 vads-u-margin-bottom--0p5">
      <Checkbox
        label="Compare"
        checked={compareChecked}
        onChange={handleCompareUpdate}
        name={name}
        showArialLabelledBy={false}
        screenReaderOnly={name}
        ariaLabel={name}
      />
    </div>
  );
}
