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

  const isHybrid = isCerner && !isCernerOnly;
  const isVistaOnly = !isCerner;

  const renderReasons = () => (
    <ul>
      <li>
        They don’t use messages, <strong>or</strong>
      </li>
      <li>
        They’re part of a different VA health care system, <strong>or</strong>
      </li>
      {!isCernerOnly && (
        <>
          <li>
            You removed them from your contact list, <strong>or</strong>
          </li>
          <li>
            Your account isn’t connected to them, <strong>or</strong>
          </li>
        </>
      )}
      <li>
        Their name may appear different.
        <div style={{ marginTop: '8px' }}>
          <a href="https://www.va.gov/resources/my-healthevet-on-vagov-what-to-know/">
            Learn more about this name change
          </a>
        </div>
      </li>
    </ul>
  );

  const renderContactListSection = () => {
    // Hybrid users see their VistA facility list and a contact list link
    if (isHybrid) {
      return (
        <>
          <h2>Update your contact list</h2>

          <p>
            Update your contact list if you can’t find your care team from these
            systems:
          </p>
          <ul>
            {vistaFacilities?.map(facility => {
              const id = facility.facilityId ?? facility;
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
        </>
      );
    }

    // VistA-only users see a simpler contact list link
    if (isVistaOnly) {
      return (
        <>
          <p>
            You can send messages to new or previously removed care teams by
            adding them to your contact list.
          </p>

          <Link to={Paths.CONTACT_LIST}>
            <strong>Update your contact list</strong>
          </Link>
        </>
      );
    }

    // Oracle-only users don't see a contact list section
    return null;
  };

  const renderContent = () => (
    <div>
      <h1 className="vads-u-margin-bottom--2">Can’t find your care team?</h1>
      <EmergencyNote dropDownFlag />

      <p>You may not find your care team for these reasons:</p>

      {renderReasons()}

      <p>If you can’t find your care team, try these other options:</p>

      <ul>
        <li>
          Select a different VA health care system, <strong>or</strong>
        </li>
        <li>
          Enter the first few letters of your facility’s location or a type of
          care
        </li>
      </ul>

      {renderContactListSection()}

      <p>
        If you need more help, call us at{' '}
        <VaTelephone contact={CONTACTS.MY_HEALTHEVET} /> (
        <VaTelephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>

      <va-button back full-width onClick={() => history.goBack()} text="Back" />
    </div>
  );

  return (
    <div className="vads-l-grid-container care-team-help-container">
      {renderContent()}
    </div>
  );
};

export default CareTeamHelp;
