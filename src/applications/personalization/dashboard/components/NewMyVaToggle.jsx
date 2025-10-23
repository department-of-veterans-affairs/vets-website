import React, { useEffect, useState } from 'react';
import { VaButtonSegmented } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import './NewMyVaToggle.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeatureToggleValue } from 'platform/utilities/feature-toggles';
import { updateMyVaLayoutVersion } from '../actions/preferences';

const LOCAL_STORAGE_KEY = 'myVaLayoutVersion';
const MY_VA_LAYOUT_VERSION_OLD = 'old';
const MY_VA_LAYOUT_VERSION_NEW = 'new';
const BUTTONS = [
  { value: MY_VA_LAYOUT_VERSION_NEW, label: 'New My VA' },
  { value: MY_VA_LAYOUT_VERSION_OLD, label: 'Old My VA' },
];

const NewMyVaToggle = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || MY_VA_LAYOUT_VERSION_OLD;
  });
  const storeVersion = useSelector(
    state => state.myVaPreferences?.layout?.version,
  );

  useEffect(
    () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, selected);
      dispatch(updateMyVaLayoutVersion(selected));
    },
    [selected, dispatch],
  );

  useEffect(
    () => {
      if (storeVersion && storeVersion === selected) {
        const redesignEnabled = storeVersion === MY_VA_LAYOUT_VERSION_NEW;
        dispatch(
          updateFeatureToggleValue({
            // eslint-disable-next-line camelcase
            my_va_auth_exp_redesign_enabled: redesignEnabled,
          }),
        );
      }
    },
    [storeVersion, selected, dispatch],
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
        data-testid="my-va-layout-toggle"
      />
    </div>
  );
};

export default NewMyVaToggle;
