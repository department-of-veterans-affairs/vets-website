import React from 'react';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

export default function FacilityField({ value, onChange, ...props }) {
  return (
    <>
      <h4>Hey there</h4>
      <TextWidget value={value} onChange={onChange} type="text" {...props} />
    </>
  );
}
