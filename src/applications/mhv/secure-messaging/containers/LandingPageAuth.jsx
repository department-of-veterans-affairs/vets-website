/*
The main application container. Responsibilities:
- Gating the application behind a login prompt (<RequiredLoginView />)
- Rendering various application states based on api call status

Assumptions that may need to be addressed:
- Assumes the only service required is MHV_AC
- Currently doesn't include a DowntimeNotification, but may want to given its external dependencies.
- Assumes the api call invoked by props.getAllMessages returns ALL messages. If pagination is handled by the server,
then additional functionality will need to be added to account for this.
*/

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { retrieveFolder } from '../actions/folders';
import { DefaultFolders as Folder, PageTitles } from '../util/constants';
import { updatePageTitle } from '../util/helpers';
import DashboardUnreadMessages from '../components/Dashboard/DashboardUnreadMessages';
import WelcomeMessage from '../components/Dashboard/WelcomeMessage';
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import CernerTransitioningFacilityAlert from '../components/Alerts/CernerTransitioningFacilityAlert';

const LandingPageAuth = () => {
  const dispatch = useDispatch();
  const fullState = useSelector(state => state);
  const inbox = useSelector(state => state.sm.folders?.folder);
  const [prefLink, setPrefLink] = useState('');
  const [isLandingPage, setIsLandingPage] = useState(false);

  useEffect(() => {
    setPrefLink(mhvUrl(isAuthenticatedWithSSOe(fullState), 'preferences'));
  }, [fullState]);

  useEffect(() => {
    dispatch(retrieveFolder(Folder.INBOX.id));
  }, [dispatch]);

  useEffect(() => {
    focusElement(document.querySelector('h1'));
    updatePageTitle(PageTitles.DEFAULT_PAGE_TITLE_TAG);
  }, []);

  useEffect(() => {
    const h1Content = document.querySelector('h1').textContent;
    if (h1Content === 'Messages') {
      setIsLandingPage(true);
    }
  }, []);

  return (
    <div className="dashboard">
      <AlertBackgroundBox isLandingPage={isLandingPage} />
      <h1>Messages</h1>

      <CernerTransitioningFacilityAlert />

      <p className="va-introtext">
        Communicate privately and securely with your VA health care team online.
      </p>
      <DashboardUnreadMessages inbox={inbox} />
      <WelcomeMessage />
      <FrequentlyAskedQuestions prefLink={prefLink} />
    </div>
  );
};

export default LandingPageAuth;
