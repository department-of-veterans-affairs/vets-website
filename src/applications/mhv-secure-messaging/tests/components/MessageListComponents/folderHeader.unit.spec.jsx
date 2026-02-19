import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { cleanup } from '@testing-library/react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import FolderHeader from '../../../components/MessageList/FolderHeader';
import { folderList } from '../../fixtures/folder-response.json';
import messageResponse from '../../fixtures/message-response.json';
import noAssociationsAtAll from '../../fixtures/json-triage-mocks/triage-teams-no-associations-at-all-mock.json';
import allAssociationsBlocked from '../../fixtures/json-triage-mocks/triage-teams-all-blocked-mock.json';

import {
  inbox,
  drafts,
  sent,
  customFolder,
} from '../../fixtures/folder-inbox-response.json';
import threadList from '../../fixtures/thread-list-response.json';
import reducer from '../../../reducers';
import {
  DefaultFolders,
  DefaultFolders as Folders,
  Paths,
  filterDescription,
} from '../../../util/constants';
import { drupalStaticData } from '../../fixtures/cerner-facility-mock-data.json';

const searchProps = { searchResults: [], awaitingResults: false };

describe('Folder Header component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: customFolder,
        folderList,
      },
      messageDetails: { message: messageResponse },
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
  };
  const initialPath = `/folders/${customFolder.folderId}`;
  const initialThreadCount = threadList.length;
  const setup = (
    state = initialState,
    path = initialPath,
    threadCount = initialThreadCount,
    folder = customFolder,
  ) => {
    return renderWithStoreAndRouter(
      <FolderHeader
        folder={folder}
        threadCount={threadCount}
        searchProps={{ ...searchProps }}
      />,
      {
        initialState: state,
        reducers: reducer,
        path,
      },
    );
  };

  describe('displays empty custom folder view', () => {
    const emptyFolder = {
      folderId: 9044447,
      name: 'Empty Folder',
      count: 0,
      unreadCount: 0,
      systemFolder: false,
    };

    const emptyFolderState = {
      sm: {
        folders: {
          folder: emptyFolder,
          folderList,
        },
      },
    };

    let screen = null;
    beforeEach(() => {
      screen = setup(emptyFolderState, `/folders/9044447`, 0, emptyFolder);
    });

    it('must display valid FOLDER name: EMPTY FOLDER', () => {
      expect(
        screen.getByText(`Messages: ${emptyFolder.name}`, {
          selector: 'h1',
        }),
      ).to.exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc, { selector: 'p' }))
        .to.exist;
    });

    it('must display `Edit Folder Name` and `Remove Folder` buttons', () => {
      expect(screen.getByTestId('edit-folder-button')).to.exist;
      expect(screen.getByTestId('remove-folder-button')).to.exist;
    });

    it('displays `Remove this folder?` modal if threadCount is zero.', async () => {
      fireEvent.click(screen.getByTestId('remove-folder-button'));
      expect(screen.getByTestId('remove-this-folder')).to.exist;
      expect(screen.getByText(`If you remove a folder, you can't get it back.`))
        .to.exist;
    });
  });

  describe('Folder Header component displays CUSTOM folder and children components', () => {
    it('must display valid CUSTOM FOLDER name and description: DEMO FOLDER 1', async () => {
      const screen = setup();
      expect(screen.getByText(`Messages: ${customFolder.name}`)).to.exist;
      expect(screen.getByText(Folders.CUSTOM_FOLDER.desc, { selector: 'p' })).to
        .exist;
    });

    it('renders FilterBox with `threadCount` in CUSTOM FOLDER', () => {
      const screen = setup();
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${customFolder.name}`,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        filterDescription.withMsgId,
      );
    });

    it('does not render FilterBox w/o `threadCount` on CUSTOM FOLDER', () => {
      const screen = setup(initialState, initialPath, null);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component displays INBOX folder and children components', () => {
    const initialInboxState = {
      sm: {
        folders: {
          folder: inbox,
          folderList,
        },
      },
      drupalStaticData,
      user: {
        profile: {
          facilities: [],
        },
      },
    };

    afterEach(() => {
      cleanup();
    });

    it('must display valid FOLDER name: INBOX', async () => {
      const screen = setup(
        initialState,
        Paths.INBOX,
        initialThreadCount,
        inbox,
      );
      expect(screen.getByText(`Messages: ${inbox.name}`, { selector: 'h1' })).to
        .exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;

      const inboxTab = screen.getByTestId('inbox-inner-nav');
      expect(inboxTab).to.have.attribute('activetab', 'active-innerNav-link');
      const foldersTab = screen.getByTestId('folders-inner-nav');
      expect(foldersTab).to.have.attribute('activetab', '');
    });

    it('renders FilterBox with `threadCount` in INBOX FOLDER', () => {
      const screen = setup(
        initialInboxState,
        Paths.INBOX,
        initialThreadCount,
        inbox,
      );
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${inbox.name.toLowerCase()}`,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        filterDescription.withMsgId,
      );
    });

    it('does not render FilterBox w/o `threadCount` on INBOX FOLDER', () => {
      const screen = setup(initialInboxState, Paths.INBOX, null, inbox);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });

    it('renders BlockedTriageGroupAlert if no associations at all', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: noAssociationsAtAll.mockAllowedRecipients,
            blockedRecipients: noAssociationsAtAll.mockBlockedRecipients,
            associatedTriageGroupsQty:
              noAssociationsAtAll.associatedTriageGroupsQty,
            associatedBlockedTriageGroupsQty:
              noAssociationsAtAll.associatedBlockedTriageGroupsQty,
            noAssociations: noAssociationsAtAll.noAssociations,
            allTriageGroupsBlocked: noAssociationsAtAll.allTriageGroupsBlocked,
          },
        },
        featureToggles: {},
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(screen.queryByTestId('compose-message-link')).to.not.exist;
      const blockedTriageGroupAlert = await screen.findByTestId(
        'blocked-triage-group-alert',
      );
      expect(blockedTriageGroupAlert).to.exist;
      expect(blockedTriageGroupAlert.firstChild.textContent).to.equal(
        "You're not connected to any care teams in this messaging tool",
      );
    });

    it('renders BlockedTriageGroupAlert if all associations blocked', async () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: allAssociationsBlocked.mockAllowedRecipients,
            blockedRecipients: allAssociationsBlocked.mockBlockedRecipients,
            associatedTriageGroupsQty:
              allAssociationsBlocked.associatedTriageGroupsQty,
            associatedBlockedTriageGroupsQty:
              allAssociationsBlocked.associatedBlockedTriageGroupsQty,
            noAssociations: allAssociationsBlocked.noAssociations,
            allTriageGroupsBlocked:
              allAssociationsBlocked.allTriageGroupsBlocked,
          },
        },
        featureToggles: {},
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(
        screen.findByText(
          "You can't send messages to your care teams right now",
        ),
      ).to.exist;
    });

    it('renders RecipientListErrorAlert when recipientsError is true', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: [],
            blockedRecipients: [],
            noAssociations: false,
            allTriageGroupsBlocked: false,
            error: true,
          },
        },
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      const alert = screen.container.querySelector(
        'va-alert[status="warning"]',
      );
      expect(alert).to.exist;

      // Check content within the alert component
      const headline = alert.querySelector('h2[slot="headline"]');
      expect(headline).to.exist;
      expect(headline.textContent).to.contain('load your care team list');

      const paragraph = alert.querySelector('p');
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.contain(
        'Something went wrong on our end',
      );
    });

    it('does not render ComposeMessageButton when recipientsError is true', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: [],
            blockedRecipients: [],
            noAssociations: false,
            allTriageGroupsBlocked: false,
            error: true,
          },
        },
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(screen.queryByTestId('compose-message-link')).to.not.exist;
    });

    it('does not render ComposeMessageButton when noAssociations is true', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: noAssociationsAtAll.mockAllowedRecipients,
            blockedRecipients: noAssociationsAtAll.mockBlockedRecipients,
            noAssociations: true,
            allTriageGroupsBlocked: false,
            error: false,
          },
        },
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(screen.queryByTestId('compose-message-link')).to.not.exist;
    });

    it('does not render ComposeMessageButton when allTriageGroupsBlocked is true', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: allAssociationsBlocked.mockAllowedRecipients,
            blockedRecipients: allAssociationsBlocked.mockBlockedRecipients,
            noAssociations: false,
            allTriageGroupsBlocked: true,
            error: false,
          },
        },
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(screen.queryByTestId('compose-message-link')).to.not.exist;
    });

    it('renders ComposeMessageButton when no recipient errors exist', () => {
      const customState = {
        ...initialState,
        sm: {
          ...initialState.sm,
          recipients: {
            allowedRecipients: [],
            blockedRecipients: [],
            noAssociations: false,
            allTriageGroupsBlocked: false,
            error: false,
          },
        },
      };

      const screen = setup(customState, Paths.INBOX, initialThreadCount, inbox);
      expect(screen.queryByTestId('compose-message-link')).to.exist;
    });
  });

  describe('Folder Header component displays DRAFTS folder and children components', () => {
    const initialDraftsState = {
      sm: {
        folders: {
          folder: drafts,
          folderList,
        },
      },
    };

    it('must display valid FOLDER name: DRAFTS', async () => {
      const screen = setup(
        initialDraftsState,
        Paths.DRAFTS,
        threadList,
        drafts,
      );
      expect(screen.getByText(`Messages: ${drafts.name}`, { selector: 'h1' }))
        .to.exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` in DRAFTS FOLDER', () => {
      const screen = setup(
        initialDraftsState,
        Paths.DRAFTS,
        initialThreadCount,
        drafts,
      );
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${drafts.name.toLowerCase()}`,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        'Enter information from one of these fields: to, from, or subject',
      );
    });

    it('does not render FilterBox w/o `threadCount` on DRAFTS FOLDER', () => {
      const screen = setup(initialDraftsState, Paths.DRAFTS, null, drafts);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component displays SENT folder and children components', () => {
    const initialSentState = {
      sm: {
        folders: {
          folder: sent,
          folderList,
        },
      },
    };

    it('must display valid FOLDER name: SENT', async () => {
      const screen = setup(initialSentState, Paths.SENT, threadList, sent);
      expect(screen.getByText(`Messages: ${sent.name}`, { selector: 'h1' })).to
        .exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` in SENT FOLDER', () => {
      const screen = setup(
        initialSentState,
        Paths.SENT,
        initialThreadCount,
        sent,
      );
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${sent.name.toLowerCase()}`,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        filterDescription.withMsgId,
      );
    });

    it('does not render FilterBox w/o `threadCount` on SENT FOLDER page', () => {
      const screen = setup(initialSentState, Paths.SENT, null, sent);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('Folder Header component displays TRASH folder and children components', () => {
    const trash = {
      folderId: -3,
      name: DefaultFolders.DELETED.header,
      count: 55,
      unreadCount: 41,
      systemFolder: true,
    };
    const initialTrashState = {
      sm: {
        folders: {
          folder: trash,
          folderList,
        },
      },
    };

    it('must display valid FOLDER name: TRASH ', async () => {
      const screen = setup(
        initialTrashState,
        Paths.DELETED,
        initialThreadCount,
        trash,
      );
      expect(screen.getByText(`Messages: ${trash.name}`, { selector: 'h1' })).to
        .exist;
      expect(screen.queryByText(Folders.CUSTOM_FOLDER.desc)).to.not.exist;
    });

    it('renders FilterBox with `threadCount` in TRASH FOLDER', () => {
      const screen = setup(
        initialTrashState,
        Paths.DELETED,
        initialThreadCount,
        trash,
      );
      const filterBox = screen.getByTestId('search-form');
      expect(filterBox).to.exist;

      const filterHeader = filterBox.querySelector('h2');
      expect(filterHeader.textContent).to.equal(
        `Filter messages in ${trash.name.toLowerCase()}`,
      );

      const filterInputElement = screen.queryByTestId('keyword-search-input');
      expect(filterInputElement.getAttribute('label')).to.equal(
        filterDescription.withMsgId,
      );
    });

    it('does not render FilterBox w/o `threadCount` on TRASH FOLDER', () => {
      const screen = setup(initialTrashState, Paths.DELETED, null, trash);
      expect(screen.queryByTestId('search-form')).to.not.exist;
    });
  });

  describe('OracleHealthMessagingAlert', () => {
    it('renders OracleHealthMessagingIssuesAlert when cernerPilotSmFeatureFlag is true', () => {
      const stateWithFeatureFlag = {
        ...initialState,
        sm: {
          ...initialState.sm,
          folders: {
            folder: inbox,
            folderList,
          },
        },
        featureToggles: {
          loading: false,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilotSystemMaintenanceBanner]: true,
        },
        user: {
          profile: {
            facilities: [],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithFeatureFlag, Paths.INBOX, 1, inbox);

      const alert = screen.container.querySelector(
        'va-alert[status="warning"]',
      );
      expect(alert).to.exist;
      const headline = alert.querySelector('[slot="headline"]');
      expect(headline.textContent).to.contain(
        `We’re working on messages right now`,
      );
    });

    it('does not render OracleHealthMessagingIssuesAlert when mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag is false', () => {
      const stateWithFeatureFlag = {
        ...initialState,
        sm: {
          ...initialState.sm,
          folders: {
            folder: inbox,
            folderList,
          },
        },
        featureToggles: {
          loading: false,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: true,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilotSystemMaintenanceBanner]: false,
        },
        user: {
          profile: {
            facilities: [],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const { queryByText } = setup(
        stateWithFeatureFlag,
        Paths.INBOX,
        1,
        inbox,
      );

      expect(queryByText('We’re working on messages right now')).to.be.null;
    });

    it('renders CernerFacilityAlert when user has Cerner facilities and feature flag is false', () => {
      const stateWithCernerFacilities = {
        ...initialState,
        sm: {
          ...initialState.sm,
          folders: {
            folder: inbox,
            folderList,
          },
        },
        featureToggles: {
          loading: false,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: false,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '668',
                isCerner: true,
              },
            ],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithCernerFacilities, Paths.INBOX, 1, inbox);

      expect(
        screen.getByText(
          'To send a secure message to a provider at this facility, go to My VA Health',
        ),
      ).to.exist;
    });

    it('does not render any alert when feature flag is false and no Cerner facilities', () => {
      const stateWithoutCerner = {
        ...initialState,
        sm: {
          ...initialState.sm,
          folders: {
            folder: inbox,
            folderList,
          },
        },
        featureToggles: {
          loading: false,
          [FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot]: false,
        },
        user: {
          profile: {
            facilities: [],
            userAtPretransitionedOhFacility: false,
            userFacilityReadyForInfoAlert: false,
            userFacilityMigratingToOh: false,
            migrationSchedules: [],
          },
        },
      };

      const screen = setup(stateWithoutCerner, Paths.INBOX, 1, inbox);

      expect(screen.queryByText("We're working on messages right now")).to.not
        .exist;
      expect(
        screen.queryByText(
          'To send a secure message to a provider at this facility, go to My VA Health',
        ),
      ).to.not.exist;
    });
  });
});
