import React, { useEffect, useState } from 'react';
import { VaButtonSegmented } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import './NewMyVaToggle.scss';

const LOCAL_STORAGE_KEY = 'myVaVersion';
const BUTTONS = [
  { value: 'new', label: 'New My VA' },
  { value: 'old', label: 'Old My VA' },
];

const NewMyVaToggle = () => {
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || 'old';
  });

  useEffect(
    () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, selected);
    },
    [selected],
  );

  const handleClick = event => {
    setSelected(event.detail.value);
  };

  const getSelectedIndex = () => {
    return BUTTONS.findIndex(button => button.value === selected);
  };

  return (
    <div className="vads-u-margin-y--4 my-va-toggle">
      <VaButtonSegmented
        buttons={BUTTONS}
        label="Select a My VA version"
        onVaButtonClick={handleClick}
        selected={getSelectedIndex()}
      />
    </div>
  );
};

export default NewMyVaToggle;
