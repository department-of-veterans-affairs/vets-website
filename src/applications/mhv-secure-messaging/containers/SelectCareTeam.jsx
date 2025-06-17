import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { Paths } from '../util/constants';
import RecipientsSelect from '../components/ComposeForm/RecipientsSelect';
import { setActiveCareTeam, setActiveCareSystem } from '../actions/recipients';
import EmergencyNote from '../components/EmergencyNote';

const SelectCareTeam = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    allFacilities,
    noAssociations,
    allTriageGroupsBlocked,
    allRecipients,
    allowedRecipients,
    activeCareSystem,
    activeCareTeam,
    activeDraftId,
  } = useSelector(state => state.sm.recipients);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const [careSystemError, setCareSystemError] = useState('');
  const [careTeamError, setCareTeamError] = useState('');
  const [careTeamsList, setCareTeamsList] = useState([]);
  const [selectedCareTeamId, setSelectedCareTeamId] = useState(null);
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [careTeamComboInputValue, setCareTeamComboInputValue] = useState('');
  const [showContactListLink, setShowContactListLink] = useState(false);
  const [recipientsSelectKey, setRecipientsSelectKey] = useState(0); // controls resetting the careTeam combo box when the careSystem changes

  const maxRadioOptions = 6;

  // On initial load, always clear the active care system
  // This ensures that if the user navigates back to this page, they start fresh
  // If they have an active care team, we set that as the selected care team
  useEffect(
    () => {
      dispatch(setActiveCareSystem(null));
      if (activeCareTeam) {
        setSelectedCareTeamId(activeCareTeam.id.toString());
      }
    },
    [dispatch],
  );

  const careTeamHandler = useCallback(
    recipient => {
      const newId = recipient?.id ? recipient.id.toString() : null;

      // Only update if the value actually changes
      if (selectedCareTeamId !== newId) {
        setSelectedCareTeamId(newId);

        if (recipient.id && recipient.id !== '0') {
          setCareTeamError('');
          dispatch(setActiveCareTeam(recipient));
        } else if (!recipient.id) {
          dispatch(setActiveCareTeam(null));
          setSelectedCareTeamId(null);
        }
      }
      // Do nothing if the id hasn't changed
    },
    [dispatch, selectedCareTeamId],
  );

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const onRadioChangeHandler = e => {
    if (e?.detail?.value) {
      if (e.detail.value !== activeCareSystem?.vhaId) {
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(setActiveCareTeam(null));
        setSelectedCareTeamId(null);
      }
      setCareSystemError(null);
      dispatch(setActiveCareSystem(ehrDataByVhaId[e.detail.value] || null));
    }
  };

  useEffect(
    () => {
      if (allFacilities.length > 0 && ehrDataByVhaId) {
        allFacilities.forEach(facility => {
          if (ehrDataByVhaId[facility]?.ehr === 'vista')
            setShowContactListLink(true);
        });
      }
    },
    [allFacilities, ehrDataByVhaId],
  );

  useEffect(
    () => {
      if (activeCareSystem) {
        setCareTeamsList(
          allowedRecipients?.filter(
            recipient => recipient.stationNumber === activeCareSystem?.vhaId,
          ) || allowedRecipients,
        );
      } else {
        setCareTeamsList(allowedRecipients);
      }
    },
    [activeCareSystem, allowedRecipients],
  );

  useEffect(
    () => {
      if (
        allFacilities.length === 1 &&
        allFacilities[0] &&
        (!activeCareSystem || activeCareSystem.vhaId !== allFacilities[0])
      ) {
        const careSystem = ehrDataByVhaId[allFacilities[0]] || null;
        dispatch(setActiveCareSystem(careSystem));
      }
    },
    [activeCareSystem, allFacilities, allRecipients, dispatch, ehrDataByVhaId],
  );

  const checkValidity = useCallback(
    () => {
      let selectionsValid = true;
      if (!selectedCareTeamId || !activeCareTeam) {
        setCareTeamError('Select a care team');
        selectionsValid = false;
      }
      return selectionsValid;
    },
    [activeCareTeam, selectedCareTeamId],
  );

  const handlers = {
    onContinue: () => {
      if (!checkValidity()) return;
      if (
        !activeCareSystem ||
        activeCareSystem.vhaId !== activeCareTeam.stationNumber
      ) {
        dispatch(
          setActiveCareSystem(ehrDataByVhaId[(activeCareTeam?.stationNumber)]),
        );
      }
      if (activeDraftId) {
        history.push(`${Paths.MESSAGE_THREAD}/${activeDraftId}`);
      } else {
        history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}`);
      }
    },
  };

  const handleCareSystemSelect = useCallback(
    e => {
      const { value } = e.detail;
      if (!+value) {
        dispatch(setActiveCareSystem(null));
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(setActiveCareTeam(null));
        setSelectedCareTeamId('0');
        return;
      }

      if (e.detail.value !== activeCareSystem?.vhaId) {
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(setActiveCareTeam(null));
        setSelectedCareTeamId(null);
      }

      setCareSystemError(null);
      dispatch(setActiveCareSystem(ehrDataByVhaId[value] || null));
    },
    [activeCareSystem, dispatch, ehrDataByVhaId],
  );

  const careSystemsOptionsValues = useMemo(
    () => {
      const careSystemsSorted = allFacilities
        .map(careSystem => {
          return ehrDataByVhaId[careSystem];
        })
        .sort((a, b) => {
          const aName = a?.vamcSystemName;
          const bName = b?.vamcSystemName;

          return aName.localeCompare(bName);
        });
      return careSystemsSorted.map(item => (
        <option key={item?.vhaId} value={item?.vhaId}>
          {item.vamcSystemName}
        </option>
      ));
    },
    [allFacilities, ehrDataByVhaId],
  );

  const renderCareSystems = () => {
    if (allFacilities.length > 1 && allFacilities.length < maxRadioOptions) {
      return (
        <VaRadio
          label="Select a VA health care system"
          error={careSystemError}
          name="va-health-care-system"
          onVaValueChange={onRadioChangeHandler}
          required
        >
          {allFacilities.map(facility => (
            <>
              <VaRadioOption
                data-testid={`care-system-${facility}`}
                id={facility}
                key={facility}
                label={
                  getVamcSystemNameFromVhaId(ehrDataByVhaId, facility) ||
                  facility
                }
                name="va-health-care-system"
                tile
                value={facility}
                radioOptionSelected={activeCareSystem?.vhaId || ''}
              />
            </>
          ))}
        </VaRadio>
      );
    }

    if (allFacilities.length >= maxRadioOptions) {
      return (
        <VaSelect
          required
          enable-analytics
          id="care-system-dropdown"
          label="Select a VA health care system"
          name="to-care-system"
          value={activeCareSystem?.vhaId || ''}
          onVaSelect={handleCareSystemSelect}
          class="composeSelect"
          data-testid="care-system-select"
          error={careSystemError}
          data-dd-privacy="mask"
          data-dd-action-name="Care System Dropdown List"
        >
          {careSystemsOptionsValues}
        </VaSelect>
      );
    }

    return null;
  };

  return (
    <div className="choose-va-health-care-system">
      <h1 className="vads-u-margin-bottom--2">
        {allFacilities.length === 1
          ? 'Select a care team'
          : 'Which VA health care system do you want to send a message to?'}
      </h1>
      <EmergencyNote dropDownFlag />
      <div>
        {renderCareSystems()}

        <div className="vads-u-margin-top--3">
          {careTeamsList &&
            !noAssociations &&
            !allTriageGroupsBlocked && (
              <RecipientsSelect
                key={recipientsSelectKey}
                recipientsList={careTeamsList}
                onValueChange={careTeamHandler}
                error={careTeamError}
                defaultValue={+selectedCareTeamId}
                isSignatureRequired={isSignatureRequired}
                setComboBoxInputValue={setCareTeamComboInputValue}
                comboBoxInputValue={careTeamComboInputValue}
                setIsSignatureRequired={setIsSignatureRequired}
              />
            )}
        </div>
        <div className="vads-u-margin-top--2">
          <p className="vads-u-margin-bottom--1">
            <Link to="/">What to do if you can’t find your care team</Link>
          </p>
        </div>
        {showContactListLink && (
          <div className="vads-u-margin-top--2">
            <p className="vads-u-margin-bottom--1">
              <strong>Note:</strong> You can add more care teams to select from
              by updating your contact list.
            </p>
            <Link to="/">Update your contact list</Link>
          </div>
        )}
        <div>
          <VaButton
            continue
            class="continue-go-back vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-with--100"
            data-testid="continue-button"
            data-dd-action-name="Continue button on Choose a VA Healthcare System Page"
            onClick={e => handlers.onContinue(e)}
            text={null}
          />
        </div>
      </div>
    </div>
  );
};

SelectCareTeam.propTypes = {
  acknowledge: PropType.func,
  type: PropType.string,
};

export default SelectCareTeam;
