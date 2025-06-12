import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropType from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import {
  selectEhrDataByVhaId,
  selectCernerFacilities,
  selectVistaFacilities,
} from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { Paths } from '../util/constants';
import RecipientsSelect from '../components/ComposeForm/RecipientsSelect';
import { setActiveCareTeam, setActiveCareSystem } from '../actions/recipients';

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
  } = useSelector(state => state.sm.recipients);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const cernerFacilities = useSelector(selectCernerFacilities);
  const vistaFacilities = useSelector(selectVistaFacilities);

  const [selectedFacility, setSelectedFacility] = useState('');
  const [careSystemError, setCareSystemError] = useState('');
  const [careTeamError, setCareTeamError] = useState('');
  const [recipientsList, setRecipientsList] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState(null);
  const [isSignatureRequired, setIsSignatureRequired] = useState(null);
  const [checkboxMarked, setCheckboxMarked] = useState(false);
  const [comboBoxInputValue, setComboBoxInputValue] = useState('');
  const [showContactListLink, setShowContactListLink] = useState(false);
  const [showCantFindCareTeam, setShowCantFindCareTeam] = useState(false);
  const [recipientsSelectKey, setRecipientsSelectKey] = useState(0);

  const recipientHandler = useCallback(
    recipient => {
      setSelectedRecipientId(recipient?.id ? recipient.id.toString() : '0');

      if (recipient.id && recipient.id !== '0') {
        // if (recipient.id) {
        setCareTeamError('');
        dispatch(setActiveCareTeam(recipient));
        // }
        // setUnsavedNavigationError();
      }

      if (!recipient.id) {
        dispatch(setActiveCareTeam(null));
        setSelectedRecipientId(null);
      }
    },
    [dispatch, setCareTeamError],
  );

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  const onRadioChangeHandler = e => {
    if (e?.detail?.value) {
      if (e.detail.value !== activeCareSystem?.vhaId) {
        setRecipientsSelectKey(prevKey => prevKey + 1);
        dispatch(setActiveCareTeam(null));
        setSelectedRecipientId(null);
      }
      setSelectedFacility(e?.detail?.value);
      setCareSystemError(null);
      dispatch(
        setActiveCareSystem(
          allRecipients,
          [...cernerFacilities, ...vistaFacilities].find(
            facility => facility.vhaId === e.detail.value,
          ),
        ),
      );
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
        setRecipientsList(
          allowedRecipients.filter(
            recipient => recipient.stationNumber === activeCareSystem.vhaId,
          ),
        );
        setShowCantFindCareTeam(true);
      } else {
        setRecipientsList([]);
        setShowCantFindCareTeam(false);
      }
    },
    [activeCareSystem, allowedRecipients],
  );

  const checkValidity = useCallback(
    () => {
      let selectionsValid = true;
      if (!selectedFacility) {
        setCareSystemError('Select a VA health care system');
        selectionsValid = false;
      }
      if (!selectedRecipientId) {
        setCareTeamError('Select a care team');
        selectionsValid = false;
      }
      return selectionsValid;
    },
    [selectedFacility, selectedRecipientId],
  );

  const handlers = {
    onContinue: () => {
      if (!checkValidity()) return;
      history.push(`${Paths.COMPOSE}${Paths.START_MESSAGE}`);
    },
  };

  return (
    <div className="choose-va-health-care-system">
      <h1 className="vads-u-margin-bottom--2">
        Which VA health care system do you want to send a message to?
      </h1>
      <div>
        <VaRadio
          label="Select a VA health care system"
          error={careSystemError}
          name="va-health-care-system"
          onVaValueChange={onRadioChangeHandler}
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
        <div className="vads-u-margin-top--3">
          {recipientsList &&
            !noAssociations &&
            !allTriageGroupsBlocked && (
              <RecipientsSelect
                key={recipientsSelectKey}
                recipientsList={recipientsList}
                onValueChange={recipientHandler}
                error={careTeamError}
                defaultValue={+selectedRecipientId}
                isSignatureRequired={isSignatureRequired}
                setCheckboxMarked={setCheckboxMarked}
                // setElectronicSignature={setElectronicSignature}
                setComboBoxInputValue={setComboBoxInputValue}
                comboBoxInputValue={comboBoxInputValue}
                setIsSignatureRequired={setIsSignatureRequired}
                checkboxMarked={checkboxMarked}
              />
            )}
        </div>
        {showCantFindCareTeam && (
          <div className="vads-u-margin-top--2">
            <p className="vads-u-margin-bottom--1">
              <Link to="/">What to do if you can’t find your care team</Link>
            </p>
          </div>
        )}
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
            data-testid="continue-go-back-buttons"
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
