import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPowerToolsToggles } from './powertools.state';

export const PowerTools = () => {
  const loading = useSelector(state => state?.featureToggles?.loading);

  const toggles = useSelector(state => state?.featureToggles);
  const dispatch = useDispatch();

  if (loading) {
    return <div>Loading...</div>;
  }

  // list all toggles as checkboxes
  return (
    <div id="va-power-tools" className="vads-u-padding--0p5">
      {Object.keys(toggles).map(toggle => (
        <span key={toggle}>
          <VaCheckbox
            label={toggle}
            checked={!!toggles[toggle]}
            enable-analytics={false}
            onVaChange={e => {
              const updatedToggles = { ...toggles, [toggle]: e.target.checked };
              dispatch(setPowerToolsToggles(updatedToggles));
            }}
          />
        </span>
      ))}
    </div>
  );
};
