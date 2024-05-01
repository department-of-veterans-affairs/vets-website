import {
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { setPowerToolsToggles } from './powertools.state';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { LoadingButton } from '../../LoadingButton/LoadingButton';

export const PowerTools = () => {
  const [localToggles, setLocalToggles, clearLocalToggles] = useLocalStorage(
    'va-power-tools',
    {},
  );
  const loading = useSelector(state => state?.featureToggles?.loading);

  const toggles = useSelector(state => state?.featureToggles);
  const dispatch = useDispatch();

  const localTogglesAreEmpty = isEqual(localToggles, {});
  const customLocalToggles =
    !localTogglesAreEmpty && !isEqual(localToggles, toggles);

  useEffect(
    () => {
      if (localTogglesAreEmpty) {
        setLocalToggles(toggles);
      } else if (customLocalToggles) {
        dispatch(setPowerToolsToggles(localToggles));
      }
    },
    [
      localToggles,
      localTogglesAreEmpty,
      customLocalToggles,
      toggles,
      dispatch,
      setLocalToggles,
    ],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  // list all toggles as checkboxes
  return (
    <div id="va-power-tools" className="vads-u-padding--0p5">
      {customLocalToggles && <p>Custom Toggles Detected</p>}

      <VaButton
        onClick={() => {
          clearLocalToggles();
          window.location.reload();
        }}
        text="Reset Toggles"
        secondary
      />

      {Object.keys(toggles).map(toggle => {
        if (toggle === 'loading') {
          return null;
        }
        return (
          <span key={toggle}>
            <VaCheckbox
              label={toggle}
              checked={!!toggles[toggle]}
              enable-analytics={false}
              onVaChange={e => {
                const updatedToggles = {
                  ...toggles,
                  [toggle]: e.target.checked,
                };
                setLocalToggles(updatedToggles);
                dispatch(setPowerToolsToggles(updatedToggles));
              }}
            />
          </span>
        );
      })}

      <LoadingButton />
    </div>
  );
};
