import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  selectIsCernerPatient,
  selectIsCernerOnlyPatient,
} from 'platform/user/cerner-dsot/selectors';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import EmergencyNote from '../components/EmergencyNote';
import RouterLink from '../components/shared/RouterLink';
import { Paths, PageTitles, ExternalLinks } from '../util/constants';
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

  const renderReasons = () => (
    <ul>
      <li>
        They don’t use messages, <strong>or</strong>
      </li>
      <li>
        They’re part of a different VA health care system
        {(!isCernerOnly || isCerner) && (
          <>
            , <strong>or</strong>
          </>
        )}
      </li>
      {!isCernerOnly && (
        <>
          <li>
            You removed them from your contact list, <strong>or</strong>
          </li>
          <li>
            Your account isn’t connected to them
            {isCerner && (
              <>
                , <strong>or</strong>
              </>
            )}
          </li>
        </>
      )}
      {isCerner && (
        <li>
          Their name may appear different.
          <div className="vads-u-margin-top--0p5">
            <va-link
              href={ExternalLinks.MHV_ON_VAGOV_WHAT_TO_KNOW}
              text="Learn more about this name change"
              data-testid="name-change-link"
            />
          </div>
        </li>
      )}
    </ul>
  );

  const renderContactListSection = () => {
    // VistA or Hybrid users see the contact list link
    if (!isCernerOnly) {
      return (
        <>
          <p>
            You can send messages to new or previously removed care teams by
            adding them to your contact list.
          </p>

          <RouterLink
            href={Paths.CONTACT_LIST}
            text="Update your contact list"
            data-testid="update-contact-list-link"
          />
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
          {isCerner ? (
            <>
              Enter the first few letters of your facility’s location or a type
              of care
            </>
          ) : (
            <>
              Enter the first few letters of your facility’s location, your
              provider’s name, or a type of care
            </>
          )}
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
