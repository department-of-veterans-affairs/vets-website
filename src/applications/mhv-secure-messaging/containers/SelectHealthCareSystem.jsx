import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropType from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { Paths } from '../util/constants';

const SelectHealthCareSystem = () => {
  const history = useHistory();
  const allFacilities = useSelector(state => state.sm.recipients.allFacilities);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const [selectedFacility, setSelectedFacility] = useState('');
  const [showError, setShowError] = useState('');

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const onChangeHandler = e => {
    setSelectedFacility(e?.detail?.value);
    if (e?.detail?.value) setShowError(null);
  };

  const handlers = {
    onContinue: () => {
      if (!selectedFacility) {
        setShowError('Select a VA health care system');
      } else {
        setShowError(null);
        history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}`);
      }
    },
  };

  useEffect(() => {
    const handleButtonGroupDirection = () => {
      const vaButtonPair = document.querySelector('.continue-go-back');
      const shadowRoot = vaButtonPair?.shadowRoot;
      const buttonGroup = shadowRoot?.querySelector('.usa-button-group');

      if (buttonGroup) {
        if (window.innerWidth < 480) {
          buttonGroup.style.flexDirection = 'column-reverse';
        } else {
          buttonGroup.style.flexDirection = '';
        }
      }
    };

    handleButtonGroupDirection();
    window.addEventListener('resize', handleButtonGroupDirection);

    return () => {
      window.removeEventListener('resize', handleButtonGroupDirection);
    };
  }, []);

  return (
    <div className="choose-va-health-care-system">
      <h1 className="vads-u-margin-bottom--2">
        Which VA health care system do you want to send a message to?
      </h1>
      <div>
        <VaRadio
          label="Select the VA health care system your care team is a part of to send them a message"
          error={showError}
          name="va-health-care-system"
          onVaValueChange={onChangeHandler}
          required
        >
          {allFacilities.map((facility, i) => (
            <>
              <VaRadioOption
                data-testid={`facility-${facility}`}
                id={facility}
                key={i}
                label={
                  getVamcSystemNameFromVhaId(ehrDataByVhaId, facility) ||
                  facility
                }
                name="va-health-care-system"
                tile
                value={facility}
                radioOptionSelected={selectedFacility}
              />
            </>
          ))}
        </VaRadio>
        <VaButtonPair
          continue
          left-button-text="Go back"
          class="continue-go-back vads-u-padding-y--1p5 vads-u-margin-top--0 vads-u-margin-bottom--3"
          data-testid="continue-go-back-buttons"
          data-dd-action-name="Continue button on Choose a VA Healthcare System Page"
          onPrimaryClick={e => handlers.onContinue(e)}
          text={null}
        />
      </div>
    </div>
  );
};

SelectHealthCareSystem.propTypes = {
  acknowledge: PropType.func,
  type: PropType.string,
};

export default SelectHealthCareSystem;
