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

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllMessages } from '../actions';
import { getTriageTeams } from '../actions/triageTeams';
import { retrieveFolder } from '../actions/folders';
import { getCategories } from '../actions/categories';
import { DefaultFolders as Folder } from '../util/constants';
import FolderListView from './FolderListView';
import { getMessages } from '../actions/messages';

const LandingPageAuth = () => {
  const dispatch = useDispatch();

  // fire api call to retreive messages
  useEffect(
    () => {
      dispatch(getAllMessages());
      dispatch(getTriageTeams());
      dispatch(getCategories());
      // landing page retrieves only Inbox messages.
      dispatch(retrieveFolder(Folder.INBOX.id));
      dispatch(getMessages(Folder.INBOX.id));
    },
    [dispatch],
  );

  return <FolderListView />;
};

export default LandingPageAuth;
