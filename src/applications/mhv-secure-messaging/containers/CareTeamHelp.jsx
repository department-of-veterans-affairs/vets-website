import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  selectPatientFacilities,
  selectIsCernerPatient,
  selectIsCernerOnlyPatient,
} from 'platform/user/cerner-dsot/selectors';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import EmergencyNote from '../components/EmergencyNote';
import { Paths, PageTitles } from '../util/constants';
import { populatedDraft } from '../selectors';

const CareTeamHelp = () => {
  const isCerner = useSelector(selectIsCernerPatient);
  const isCernerOnly = useSelector(selectIsCernerOnlyPatient);
  const history = useHistory();
  const { acceptInterstitial } = useSelector(state => state.sm.threadDetails);
  const validDraft = useSelector(populatedDraft);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const vistaFacilities = useSelector(state =>
    (selectPatientFacilities(state) || []).filter(f => !f.isCerner),
  );

  useEffect(
    () => {
      if (!acceptInterstitial && !validDraft) history.push(Paths.COMPOSE);
    },
    [acceptInterstitial, validDraft, history],
  );

  // Set page title
  useEffect(() => {
    document.title = PageTitles.CARE_TEAM_HELP_TITLE_TAG;
  }, []);

  const renderContent = () => {
    // Hybrid user - has both Oracle Health and VistA systems
    if (isCerner && !isCernerOnly) {
      return (
        <div>
          <h1 className="vads-u-margin-bottom--2">
            Can’t find your care team?
          </h1>
          <EmergencyNote dropDownFlag />

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>
              They don’t use messages, <strong>or</strong>
            </li>
            <li>They’re part of a different VA health care system</li>
          </ul>

          <p>If you can’t find your care team, try these other options:</p>

          <ul>
            <li>
              Select a different VA health care system, <strong>or</strong>
            </li>
            <li>
              Enter the first few letters of your facility’s location, your
              provider’s name, or a type of care
            </li>
          </ul>

          <h2>Update your contact list</h2>

          <p>
            Update your contact list if you can’t find your care team from these
            systems:
          </p>
          <ul>
            {vistaFacilities?.map(facility => {
              const id = facility.facilityId ?? facility; // supports object or string
              const name = getVamcSystemNameFromVhaId(ehrDataByVhaId, id) || id;

              return <li key={id}>{name}</li>;
            })}
          </ul>

          <p>
            If you still can’t find your care team, your account might not be
            connected to them. You can send messages to new or previously
            removed care teams by adding them to your contact list.
          </p>

          <Link to={Paths.CONTACT_LIST}>
            <strong>Update your contact list</strong>
          </Link>

          <p>
            If you need more help, call us at{' '}
            <VaTelephone contact={CONTACTS.MY_HEALTHEVET} /> (
            <VaTelephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>

          <va-button
            back
            full-width
            onClick={() => history.goBack()}
            text="Back"
          />
        </div>
      );
    }

    // User ONLY has Oracle Health systems
    if (isCerner && isCernerOnly) {
      return (
        <div>
          <h1 className="vads-u-margin-bottom--2">
            Can’t find your care team?
          </h1>
          <EmergencyNote dropDownFlag />

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>
              They don’t use messages,
              <strong>or</strong>
            </li>
            <li>They’re part of a different VA health care system</li>
          </ul>

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>
              Select a different VA health care system, <strong>or</strong>
            </li>
            <li>
              Enter the first few letters of your facility’s location, your
              provider’s name, or a type of care
            </li>
          </ul>

          <p>
            If you need more help, call us at{' '}
            <VaTelephone contact={CONTACTS.MY_HEALTHEVET} /> (
            <VaTelephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>

          <va-button
            back
            full-width
            onClick={() => history.goBack()}
            text="Back"
          />
        </div>
      );
    }

    // User ONLY has VistA systems (default case)
    return (
      <div>
        <h1 className="vads-u-margin-bottom--2">Can’t find your care team?</h1>
        <EmergencyNote dropDownFlag />

        <p>You may not find your care team for these reasons:</p>

        <ul>
          <li>
            They don’t use messages, <strong>or</strong>
          </li>
          <li>
            They’re part of a different VA health care system,{' '}
            <strong>or</strong>
          </li>
          <li>
            You removed them from your contact list, <strong>or</strong>
          </li>
          <li>Your account isn’t connected to them</li>
        </ul>

        <p>If you can’t find your care team, try these other options:</p>

        <ul>
          <li>
            Select a different VA health care system, <strong>or</strong>
          </li>
          <li>
            Enter the first few letters of your facility’s location, your
            provider’s name, or a type of care
          </li>
        </ul>

        <p>
          You can send messages to new or previously removed care teams by
          adding them to your contact list.
        </p>

        <Link to={Paths.CONTACT_LIST}>
          <strong>Update your contact list</strong>
        </Link>

        <p>
          If you need more help, call us at{' '}
          <VaTelephone contact={CONTACTS.MY_HEALTHEVET} /> (
          <VaTelephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>

        <va-button
          back
          full-width
          onClick={() => history.goBack()}
          text="Back"
        />
      </div>
    );
  };

  return (
    <div className="vads-l-grid-container care-team-help-container">
      {renderContent()}
    </div>
  );
};

export default CareTeamHelp;
