import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
  selectIsCernerPatient,
  selectIsCernerOnlyPatient,
} from 'platform/user/cerner-dsot/selectors';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { Paths, PageTitles } from '../util/constants';
import { populatedDraft } from '../selectors';

const CareTeamHelp = () => {
  const isCerner = useSelector(selectIsCernerPatient);
  const isCernerOnly = useSelector(selectIsCernerOnlyPatient);
  const history = useHistory();
  const { acceptInterstitial } = useSelector(state => state.sm.threadDetails);
  const validDraft = useSelector(populatedDraft);

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
          <h1>Can’t find your care team?</h1>

          <va-alert status="info" visible class="vads-u-margin-y--2">
            <p className="vads-u-margin-y--0">
              Only use messages for non-urgent needs.
            </p>
          </va-alert>

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>
              They don’t use messages, <strong>or</strong>
            </li>
            <li>
              They’re part of a different VA health care system,{' '}
              <strong>or</strong>
            </li>
            <li>Your account isn’t connected to them</li>
          </ul>

          <p>If you can’t find your care team, try these other options:</p>

          <ul>
            <li>
              <Link to={Paths.CONTACT_LIST}>
                <strong>Update your contact list</strong>
              </Link>
            </li>
          </ul>

          <p>
            If you still can’t find your care team, your account might not be
            connected to them. You can find messages to new or previously
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
          <h1>Can’t find your care team?</h1>

          <va-alert status="info" visible class="vads-u-margin-y--2">
            <p className="vads-u-margin-y--0">
              Only use messages for non-urgent needs.
            </p>
          </va-alert>

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>
              They’re part of a different VA health care system,{' '}
              <strong>or</strong>
            </li>
            <li>Your account isn’t connected to them</li>
          </ul>

          <p>You may not find your care team for these reasons:</p>

          <ul>
            <li>You removed them from your contact list</li>
          </ul>

          <p>If you can’t find your care team, try these other options:</p>

          <ul>
            <li>
              Select a different VA health care system, <strong>or</strong>
            </li>
            <li>Your account isn’t connected to them</li>
          </ul>

          <p>
            If you still can’t find your care team, your account might not be
            connected to them. You can find messages to new or previously
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

    // User ONLY has VistA systems (default case)
    return (
      <div>
        <h1>Can’t find your care team?</h1>

        <va-alert status="info" visible class="vads-u-margin-y--2">
          <p className="vads-u-margin-y--0">
            Only use messages for non-urgent needs.
          </p>
        </va-alert>

        <p>You may not find your care team for these reasons:</p>

        <ul>
          <li>
            They don’t use messages, <strong>or</strong>
          </li>
          <li>
            They’re part of a different VA health care system,{' '}
            <strong>or</strong>
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
          If you still can’t find your care team, your account might not be
          connected to them. You can find messages to new or previously removed
          care teams by adding them to your contact list.
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
