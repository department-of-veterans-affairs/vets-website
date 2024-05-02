import {
  VaButton,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useMemo } from 'react';
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

  const [showPowerTools, setShowPowerTools] = useLocalStorage(
    'va-power-tools-display',
    false,
  );

  const loading = useSelector(state => state?.featureToggles?.loading);

  const toggles = useSelector(state => state?.featureToggles);
  const dispatch = useDispatch();

  const localTogglesAreEmpty = useMemo(() => isEqual(localToggles, {}), [
    localToggles,
  ]);
  const customLocalToggles =
    !localTogglesAreEmpty && !isEqual(localToggles, toggles);

  useEffect(
    () => {
      if (localTogglesAreEmpty) {
        setLocalToggles(toggles);
      }
    },
    [localTogglesAreEmpty, toggles, setLocalToggles],
  );

  useEffect(
    () => {
      if (customLocalToggles) {
        dispatch(setPowerToolsToggles(localToggles));
      }
    },
    [customLocalToggles, localToggles, dispatch],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showPowerTools ? (
        <div id="va-power-tools">
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
                  }}
                />
              </span>
            );
          })}

          <LoadingButton />
          <button
            onClick={() => setShowPowerTools(false)}
            className="power-tools-show-hide"
            type="button"
          >
            <va-icon icon="build" size={3} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowPowerTools(true)}
          className="power-tools-show-hide"
          type="button"
        >
          <va-icon icon="build" size={3} />
        </button>
      )}
    </>
  );
};
