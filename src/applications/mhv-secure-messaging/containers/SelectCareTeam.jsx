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
import { ErrorMessages, Paths } from '../util/constants';
import RecipientsSelect from '../components/ComposeForm/RecipientsSelect';
import EmergencyNote from '../components/EmergencyNote';
import { updateDraftInProgress } from '../actions/threadDetails';
import RouteLeavingGuard from '../components/shared/RouteLeavingGuard';
import { saveDraft } from '../actions/draftDetails';

const SelectCareTeam = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    allFacilities,
    noAssociations,
    allTriageGroupsBlocked,
    allowedRecipients,
  } = useSelector(state => state.sm.recipients);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const { draftInProgress } = useSelector(state => state.sm.threadDetails);

  const [careTeamError, setCareTeamError] = useState('');
  const [careTeamsList, setCareTeamsList] = useState([]);
  const [selectedCareTeamId, setSelectedCareTeamId] = useState(
    draftInProgress?.recipientId || null,
  );
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [careTeamComboInputValue, setCareTeamComboInputValue] = useState('');
  const [showContactListLink, setShowContactListLink] = useState(false);
  const [recipientsSelectKey, setRecipientsSelectKey] = useState(0); // controls resetting the careTeam combo box when the careSystem changes

  const MAX_RADIO_OPTIONS = 6;

  // On initial load, always clear the active care system
  // This ensures that if the user navigates back to this page, they will see
  // all care teams without being filtered by the active care system
  // If they have an active care team, we set that as the selected care team
  useEffect(() => {
    if (draftInProgress?.recipientId) {
      setSelectedCareTeamId(draftInProgress.recipientId);
    }
  }, []);

  const careTeamHandler = useCallback(
    recipient => {
      const newId = recipient?.id ? recipient.id.toString() : null;

      // Only update if the value actually changes
      if (String(selectedCareTeamId) !== String(newId)) {
        setSelectedCareTeamId(newId);

        if (recipient.id && recipient.id !== '0') {
          setCareTeamError('');
          dispatch(
            updateDraftInProgress({
              recipientId: recipient.id,
              recipientName: recipient.suggestedNameDisplay || recipient.name,
            }),
          );
          if (
            draftInProgress?.body &&
            draftInProgress?.subject &&
            draftInProgress?.category
          ) {
            dispatch(
              updateDraftInProgress({
                navigationError:
                  ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES,
              }),
            );
          } else {
            dispatch(
              updateDraftInProgress({
                navigationError: ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
              }),
            );
          }
        } else if (!recipient.id) {
          dispatch(
            updateDraftInProgress({
              recipientId: null,
              recipientName: null,
            }),
          );
          setSelectedCareTeamId(null);
        }
      }
      // Do nothing if the id hasn't changed
    },
    [
      dispatch,
      selectedCareTeamId,
      draftInProgress?.body,
      draftInProgress?.subject,
      draftInProgress?.category,
    ],
  );

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const onRadioChangeHandler = e => {
    if (e?.detail?.value) {
      const careSystem = ehrDataByVhaId[e.detail.value];
      if (e.detail.value !== draftInProgress?.careSystemVhaId) {
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(
          updateDraftInProgress({
            careSystemVhaId: careSystem?.vhaId,
            careSystemName: careSystem?.vamcSystemName,
            recipientId: null,
            recipientName: null,
          }),
        );
        setSelectedCareTeamId(null);
      }
      dispatch(
        updateDraftInProgress({
          careSystemVhaId: careSystem?.vhaId,
          careSystemName: careSystem?.vamcSystemName,
        }),
      );
    }
  };

  const handleCareSystemSelect = useCallback(
    e => {
      const { value } = e.detail;
      if (!+value) {
        dispatch(
          updateDraftInProgress({
            careSystemVhaId: null,
            careSystemName: null,
            recipientId: null,
            recipientName: null,
          }),
        );
        setRecipientsSelectKey(prevKey => prevKey + 1);
        setSelectedCareTeamId('0');
        return;
      }

      if (e.detail.value !== draftInProgress?.careSystemVhaId) {
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(
          updateDraftInProgress({
            recipientId: null,
            recipientName: null,
          }),
        );
        setSelectedCareTeamId(null);
      }

      const careSystem = ehrDataByVhaId[value];
      dispatch(
        updateDraftInProgress({
          careSystemVhaId: careSystem?.vhaId,
          careSystemName: careSystem?.vamcSystemName,
        }),
      );
    },
    [draftInProgress, dispatch, ehrDataByVhaId],
  );

  useEffect(
    () => {
      if (allFacilities.length > 0 && ehrDataByVhaId) {
        allFacilities.forEach(facility => {
          if (ehrDataByVhaId[facility]?.ehr !== 'cerner')
            setShowContactListLink(true);
        });
      }
    },
    [allFacilities, ehrDataByVhaId],
  );

  // updates the available teams in the Care Team combo box
  // if a care system is selected, filter for only that care system
  // if no care system is selected, show all allowed teams
  useEffect(
    () => {
      if (draftInProgress?.careSystemVhaId) {
        setCareTeamsList(
          allowedRecipients?.filter(
            recipient =>
              recipient.stationNumber === draftInProgress.careSystemVhaId,
          ) || allowedRecipients,
        );
      } else {
        setCareTeamsList(allowedRecipients);
      }
    },
    [draftInProgress.careSystemVhaId, allowedRecipients],
  );

  // if there is only one care system, set it as the draftInProgress care system
  // this is to prevent the user from having to select a care system
  useEffect(
    () => {
      if (
        allFacilities.length === 1 &&
        allFacilities[0] &&
        (!draftInProgress.careSystemVhaId ||
          draftInProgress.careSystemVhaId !== allFacilities[0])
      ) {
        const careSystem = ehrDataByVhaId[allFacilities[0]] || null;
        dispatch(
          updateDraftInProgress({
            careSystemVhaId: careSystem?.vhaId,
            careSystemName: careSystem?.vamcSystemName,
          }),
        );
      }
    },
    [draftInProgress.careSystemVhaId, allFacilities, dispatch, ehrDataByVhaId],
  );

  const checkValidity = useCallback(
    () => {
      let selectionsValid = true;
      if (!selectedCareTeamId || !draftInProgress.recipientId) {
        setCareTeamError('Select a care team');
        selectionsValid = false;
      }
      return selectionsValid;
    },
    [draftInProgress.recipientId, selectedCareTeamId],
  );

  const handlers = {
    onContinue: () => {
      if (!checkValidity()) return;

      const selectedRecipientStationNumber = allowedRecipients.find(
        recipient => recipient.id === +selectedCareTeamId,
      ).stationNumber;

      if (
        !draftInProgress.careSystemVhaId ||
        draftInProgress.careSystemVhaId !== selectedRecipientStationNumber
      ) {
        dispatch(
          updateDraftInProgress({
            careSystemVhaId: selectedRecipientStationNumber,
            careSystemName:
              ehrDataByVhaId[selectedRecipientStationNumber]?.vamcSystemName,
          }),
        );
      }
      if (draftInProgress.messageId) {
        history.push(`${Paths.MESSAGE_THREAD}${draftInProgress.messageId}`);
      } else {
        history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}`);
      }
    },
  };

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
          {item?.vamcSystemName}
        </option>
      ));
    },
    [allFacilities, ehrDataByVhaId],
  );

  const saveDraftHandler = useCallback(
    () => {
      dispatch(
        saveDraft(draftInProgress, 'manual', draftInProgress?.messageId),
      );
    },
    [dispatch, draftInProgress],
  );

  const renderCareSystems = () => {
    if (
      allFacilities?.length > 1 &&
      allFacilities?.length < MAX_RADIO_OPTIONS
    ) {
      return (
        <VaRadio
          label="Select a VA health care system"
          name="va-health-care-system"
          onVaValueChange={onRadioChangeHandler}
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
                radioOptionSelected={draftInProgress?.careSystemVhaId || ''}
              />
            </>
          ))}
        </VaRadio>
      );
    }

    if (allFacilities?.length >= MAX_RADIO_OPTIONS) {
      return (
        <VaSelect
          enable-analytics
          id="care-system-dropdown"
          label="Select a VA health care system"
          name="to-care-system"
          value={draftInProgress?.careSystemVhaId || ''}
          onVaSelect={handleCareSystemSelect}
          class="composeSelect"
          data-testid="care-system-select"
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
      <h1 className="vads-u-margin-bottom--2">Select care team</h1>
      <EmergencyNote dropDownFlag />
      <RouteLeavingGuard saveDraftHandler={saveDraftHandler} type="compose" />
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
            <Link to={Paths.CONTACT_LIST}>Update your contact list</Link>
          </div>
        )}
        <div>
          <VaButton
            continue
            class="vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-with--100"
            data-testid="continue-button"
            data-dd-action-name="Continue button on Select care team page"
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
