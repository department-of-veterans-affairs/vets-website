import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { datadogRum } from '@datadog/browser-rum';
import { scrollToFirstError } from 'platform/utilities/scroll';

import { populatedDraft } from '../selectors';
import {
  ErrorMessages,
  Paths,
  PageTitles,
  SelectCareTeamPage,
  BlockedTriageAlertStyles,
  ParentComponent,
} from '../util/constants';
import RecipientsSelect from '../components/ComposeForm/RecipientsSelect';
import EmergencyNote from '../components/EmergencyNote';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';
import { updateDraftInProgress } from '../actions/threadDetails';
import RouteLeavingGuard from '../components/shared/RouteLeavingGuard';
import { saveDraft } from '../actions/draftDetails';
import manifest from '../manifest.json';
import featureToggles from '../hooks/useFeatureToggles';
import { draftIsClean } from '../util/helpers';

const SelectCareTeam = () => {
  const { mhvSecureMessagingCuratedListFlow } = featureToggles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    allFacilities,
    noAssociations,
    allTriageGroupsBlocked,
    blockedFacilities,
    blockedRecipients,
    allowedRecipients,
    vistaFacilities,
    error: recipientsError,
  } = useSelector(state => state.sm.recipients);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const { draftInProgress, acceptInterstitial } = useSelector(
    state => state.sm.threadDetails,
  );
  const validDraft = useSelector(populatedDraft);

  const [careTeamError, setCareTeamError] = useState('');
  const [careTeamsList, setCareTeamsList] = useState([]);
  const [selectedCareTeamId, setSelectedCareTeamId] = useState(
    draftInProgress?.recipientId || null,
  );
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [careTeamComboInputValue, setCareTeamComboInputValue] = useState('');
  const [showContactListLink, setShowContactListLink] = useState(false);
  const [recipientsSelectKey, setRecipientsSelectKey] = useState(0); // controls resetting the careTeam combo box when the careSystem changes
  const careSystemSwitchCountRef = useRef(0);

  const MAX_RADIO_OPTIONS = 6;

  const h1Ref = useRef(null);

  useEffect(
    () => {
      if (recipientsError || noAssociations) {
        history.push(Paths.INBOX);
      }
    },
    [recipientsError, noAssociations, history],
  );

  useEffect(
    () => {
      if (!acceptInterstitial && !validDraft) {
        history.push(Paths.COMPOSE);
      }
    },
    [acceptInterstitial, validDraft, history],
  );

  // On initial load, always clear the active care system
  // This ensures that if the user navigates back to this page, they will see
  // all care teams without being filtered by the active care system
  // If they have an active care team, we set that as the selected care team
  useEffect(
    () => {
      if (draftInProgress?.recipientId) {
        setSelectedCareTeamId(draftInProgress.recipientId);
      }
    },
    [draftInProgress.recipientId],
  );

  useEffect(
    () => {
      if (
        !draftInProgress?.messageId &&
        !!draftInProgress?.recipientId &&
        draftInProgress?.navigationError?.title ===
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE.title &&
        draftIsClean(draftInProgress)
      ) {
        dispatch(
          updateDraftInProgress({
            navigationError: null,
          }),
        );
      }
    },
    [draftInProgress, dispatch],
  );

  useEffect(
    () => {
      if (careTeamError) {
        scrollToFirstError();
      }
    },
    [careTeamError],
  );

  const careTeamHandler = useCallback(
    recipient => {
      const newId = recipient?.id ? recipient.id.toString() : null;

      // Only update if the value actually changes
      if (String(selectedCareTeamId) !== String(newId)) {
        setSelectedCareTeamId(newId);

        if (newId && newId !== '0') {
          setCareTeamError('');
          dispatch(
            updateDraftInProgress({
              careSystemVhaId: recipient.stationNumber,
              careSystemName:
                ehrDataByVhaId[recipient.stationNumber]?.vamcSystemName,
              recipientId: recipient.id,
              recipientName: recipient.suggestedNameDisplay || recipient.name,
              ohTriageGroup: recipient.ohTriageGroup,
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
        } else if (!newId || newId === '0') {
          dispatch(
            updateDraftInProgress({
              recipientId: null,
              recipientName: null,
              ohTriageGroup: null,
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
      draftInProgress?.careSystemVhaId,
    ],
  );

  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.focus();
    }
  }, []);

  useEffect(
    () => {
      document.title = `Select Care Team - Start Message${
        PageTitles.DEFAULT_PAGE_TITLE_TAG
      }`;
    },
    [allowedRecipients],
  );

  // Send DataDog RUM action on component unmount with the count of care system switches
  // Should call addAction even if the count is zero
  useEffect(() => {
    return () => {
      datadogRum.addAction('Care System Radio Switch Count', {
        switchCount: careSystemSwitchCountRef.current,
      });
    };
  }, []);

  const onRadioChangeHandler = e => {
    if (e?.detail?.value) {
      const careSystem = ehrDataByVhaId[e.detail.value];
      if (e.detail.value !== draftInProgress?.careSystemVhaId) {
        careSystemSwitchCountRef.current += 1;
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(
          updateDraftInProgress({
            careSystemVhaId: careSystem?.vhaId,
            careSystemName: careSystem?.vamcSystemName,
            recipientId: null,
            recipientName: null,
            ohTriageGroup: null,
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
            ohTriageGroup: null,
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
            ohTriageGroup: null,
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
      const hasVistaFacility = vistaFacilities?.length > 0;
      setShowContactListLink(hasVistaFacility);
    },
    [vistaFacilities],
  );

  // Track when VA Health Systems are displayed
  useEffect(
    () => {
      if (allFacilities?.length > 1) {
        recordEvent({
          event: 'api_call',
          'api-name': 'SM VA Health Systems Displayed',
          'api-status': 'successful',
          'health-systems-count': allFacilities.length,
          version:
            allFacilities.length < MAX_RADIO_OPTIONS ? 'radio' : 'dropdown',
        });
        datadogRum.addAction('SM VA Health Systems Displayed', {
          status: 'successful',
          healthSystemsCount: allFacilities.length,
          version:
            allFacilities.length < MAX_RADIO_OPTIONS ? 'radio' : 'dropdown',
        });
      } else if (allFacilities?.length === 0) {
        recordEvent({
          event: 'api_call',
          'api-name': 'SM VA Health Systems Displayed',
          'api-status': 'fail',
          'health-systems-count': 0,
          'error-key': 'no-health-systems',
        });
        datadogRum.addAction('SM VA Health Systems Displayed', {
          status: 'fail',
          healthSystemsCount: 0,
          errorKey: 'no-health-systems',
        });
      }
    },
    [allFacilities],
  );

  // Track when user types in the care team search box (debounced)
  useEffect(
    () => {
      if (careTeamComboInputValue?.length > 0) {
        const debounceTimer = setTimeout(() => {
          recordEvent({
            event: 'int-text-input-search',
            'text-input-label': 'Select a care team',
          });
          datadogRum.addAction('Care Team Search Input', {
            inputLabel: 'Select a care team',
          });
        }, 500);
        return () => clearTimeout(debounceTimer);
      }
      return undefined;
    },
    [careTeamComboInputValue],
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

  const getDestinationPath = useCallback(
    (includeRootUrl = false) => {
      const inProgressPath = `${Paths.MESSAGE_THREAD}${
        draftInProgress.messageId
      }`;
      const startPath = `${Paths.COMPOSE}${Paths.START_MESSAGE}`;
      const path = draftInProgress.messageId ? inProgressPath : startPath;
      return includeRootUrl ? `${manifest.rootUrl}${path}` : path;
    },
    [draftInProgress],
  );

  const getDestinationLabel = useCallback(
    () => {
      return draftInProgress.messageId
        ? 'Continue to draft'
        : 'Continue to start message';
    },
    [draftInProgress],
  );

  const handlers = {
    onContinue: event => {
      event?.preventDefault();
      if (!checkValidity()) return;

      const selectedRecipientStationNumber = allowedRecipients.find(
        recipient => recipient.id === +selectedCareTeamId,
      )?.stationNumber;

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
      history.push(getDestinationPath());
    },
  };

  const careSystemsOptionsValues = useMemo(
    () => {
      const careSystemsSorted = allFacilities
        .filter(careSystem => !blockedFacilities?.includes(careSystem))
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
    [allFacilities, blockedFacilities, ehrDataByVhaId],
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
    const allowedFacilities = allFacilities?.filter(
      facility => !blockedFacilities?.includes(facility),
    );

    if (
      allowedFacilities?.length > 1 &&
      allowedFacilities?.length < MAX_RADIO_OPTIONS
    ) {
      return (
        <VaRadio
          enableAnalytics
          label="Select a VA health care system"
          name="va-health-care-system"
          onVaValueChange={onRadioChangeHandler}
          data-dd-privacy="mask"
          data-dd-action-name="Care System Radio button"
        >
          {allowedFacilities.map(facility => (
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
                checked={draftInProgress?.careSystemVhaId === facility}
                radioOptionSelected={draftInProgress?.careSystemVhaId || ''}
              />
            </>
          ))}
        </VaRadio>
      );
    }

    if (allowedFacilities?.length >= MAX_RADIO_OPTIONS) {
      return (
        <VaSelect
          enableAnalytics
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

  if (allTriageGroupsBlocked) {
    return (
      <div className="choose-va-health-care-system">
        <h1 className="vads-u-margin-bottom--2" tabIndex="-1" ref={h1Ref}>
          Select care team
        </h1>
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.FOLDER_HEADER}
        />
      </div>
    );
  }

  const showSingleFacilityBlockedAlert =
    blockedFacilities?.length === 1 && !allTriageGroupsBlocked;

  const showIndividualTeamsBlockedAlert =
    blockedRecipients?.length > 0 &&
    !blockedFacilities?.length &&
    !allTriageGroupsBlocked;

  const showBlockedAlert =
    showSingleFacilityBlockedAlert || showIndividualTeamsBlockedAlert;

  return (
    <div className="choose-va-health-care-system">
      <h1 className="vads-u-margin-bottom--2" tabIndex="-1" ref={h1Ref}>
        Select care team
      </h1>
      {showBlockedAlert && (
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.INFO}
          parentComponent={ParentComponent.FOLDER_HEADER}
        />
      )}
      <EmergencyNote dropDownFlag />
      <RouteLeavingGuard
        saveDraftHandler={saveDraftHandler}
        type="compose"
        persistDraftPaths={[Paths.CONTACT_LIST, Paths.CARE_TEAM_HELP]}
      />
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
            <Link to={Paths.CARE_TEAM_HELP}>
              {SelectCareTeamPage.CANT_FIND_CARE_TEAM_LINK}
            </Link>
          </p>
        </div>
        {showContactListLink && (
          <div className="vads-u-margin-top--2">
            <p className="vads-u-margin-bottom--1">
              <strong>Note:</strong>{' '}
              {SelectCareTeamPage.CANT_FIND_CARE_TEAM_NOTE}
            </p>
            <Link to={Paths.CONTACT_LIST}>Update your contact list</Link>
          </div>
        )}
        <div>
          {mhvSecureMessagingCuratedListFlow ? (
            <va-link-action
              href={getDestinationPath(true)}
              text={getDestinationLabel()}
              data-testid="continue-button"
              data-dd-action-name="Continue button on Select care team page"
              onClick={e => handlers.onContinue(e)}
              class="vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-with--100"
              type="primary"
            />
          ) : (
            <VaButton
              continue
              class="vads-u-margin-top--4 vads-u-margin-bottom--3 vads-u-with--100"
              data-testid="continue-button"
              data-dd-action-name="Continue button on Select care team page"
              onClick={e => handlers.onContinue(e)}
              text={null}
            />
          )}
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
