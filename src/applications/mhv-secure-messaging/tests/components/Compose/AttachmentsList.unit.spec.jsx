import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import { Paths, Alerts } from '../../../util/constants';
import noBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-mock.json';
import AttachmentsList from '../../../components/AttachmentsList';

describe('Attachments List component', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
      recipients: {
        allRecipients: noBlockedRecipients.mockAllRecipients,
        allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
      },
    },
  };

  const setup = (customState, path, props) => {
    return renderWithStoreAndRouter(
      <ComposeForm
        recipients={initialState.sm.recipients}
        categories={categories}
        {...props}
      />,
      {
        initialState: customState,
        reducers: reducer,
        path,
      },
    );
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    expect(screen);
  });

  it('renders attachment when editing disabled', async () => {
    const customProps = {
      attachments: [
        {
          id: 2664842,
          messageId: 2664846,
          name: 'BIRD 1.gif',
          attachmentSize: 31127,
          download:
            'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664842',
        },
      ],
      attachmentScanError: false,
      editingEnabled: false,
    };
    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );
    expect(document.querySelector('.message-body-attachments-label')).to.exist;
    expect(screen.getByTestId('attachments-count').textContent).to.equal(
      ' (1)',
    );
    expect(screen.getAllByRole('listitem')).to.have.length(1);
    const attachmentLink = screen.getByTestId(
      `attachment-link-metadata-${customProps.attachments[0].id}`,
    );
    expect(attachmentLink).to.have.attribute(
      'href',
      customProps.attachments[0].download,
    );
    expect(attachmentLink).to.have.attribute('target', '_blank');
    expect(attachmentLink).to.have.attribute('tabindex', '0');
  });

  it('displays file-attached alert only after file successfully attached', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    const file = new File(['(⌐□_□)'], 'test1.png', { type: 'image/png' });
    const uploader = screen.getByTestId('attach-file-input');

    const attachFileButton = screen.getByTestId('attach-file-button');
    expect(attachFileButton).to.have.attribute('text', 'Attach file');

    expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(screen.findByTestId('file-attached-success-alert')).to.exist;
    expect(screen.findByTestId('close-success-alert-button')).to.exist;

    waitFor(() => {
      fireEvent.click(screen.getByTestId('close-success-alert-button'));
    });

    expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;
  });

  it('removes file-attached alert when REMOVE button is clicked', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    const file = new File(['(⌐□_□)'], 'test1.png', {
      type: 'image/png',
      lastModified: 1683649850648,
    });
    const uploader = screen.getByTestId('attach-file-input');

    expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(screen.findByTestId('file-attached-success-alert')).to.exist;

    waitFor(() => {
      fireEvent.click(
        screen.getByTestId(`remove-attachment-button-${file.lastModified}`),
      );
    });

    waitFor(() => {
      fireEvent.click(screen.getByTestId('cancel-remove-attachment-button'));
    });

    waitFor(() => {
      fireEvent.click(
        screen.getByTestId(`remove-attachment-button-${file.lastModified}`),
      );
    });

    waitFor(() => {
      fireEvent.click(screen.getByTestId('confirm-remove-attachment-button'));
    });

    waitFor(() => {
      expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;
    });
  });

  it('removes file-attached alert when attach-additional-file button is clicked', async () => {
    const screen = setup(initialState, Paths.COMPOSE);
    const file = new File(['(⌐□_□)'], 'test2.png', { type: 'image/png' });
    const uploader = screen.getByTestId('attach-file-input');

    expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;

    await waitFor(() =>
      fireEvent.change(uploader, {
        target: { files: [file] },
      }),
    );

    expect(screen.findByTestId('file-attached-success-alert')).to.exist;

    const attachFileButton = await screen.getByTestId('attach-file-button');

    expect(attachFileButton).to.have.attribute(
      'text',
      'Attach additional file',
    );

    await waitFor(() => {
      fireEvent.click(attachFileButton);
    });

    waitFor(() => {
      expect(screen.queryByTestId('file-attached-success-alert')).to.not.exist;
    });
  });

  it('renders error message when attachment contains a virus', async () => {
    const customProps = {
      attachments: [
        {
          id: 2664842,
          messageId: 2664846,
          name: 'BIRD 1.gif',
          attachmentSize: 31127,
          download:
            'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664842',
        },
      ],
      attachmentScanError: true,
      editingEnabled: true,
    };
    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    expect(screen.findByTestId('attachment-virus-alert')).to.exist;
    expect(screen.getByText(Alerts.Message.ATTACHMENT_SCAN_FAIL)).to.exist;
  });

  it('renders error message when multiple attachments receive failed scan response', async () => {
    const customProps = {
      attachments: [
        {
          id: 2664842,
          messageId: 2664846,
          name: 'BIRD 1.gif',
          attachmentSize: 31127,
          download:
            'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664842',
        },
        {
          id: 2664843,
          messageId: 2664846,
          name: 'BIRD 2.gif',
          attachmentSize: 31138,
          download:
            'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664843',
        },
      ],
      attachmentScanError: true,
      editingEnabled: true,
    };
    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    expect(screen.findByTestId('attachment-virus-alert')).to.exist;
    expect(screen.getByText(Alerts.Message.MULTIPLE_ATTACHMENTS_SCAN_FAIL)).to
      .exist;

    const removeAllAttachments = await screen.findByTestId(
      'remove-all-attachments-button',
    );
    expect(removeAllAttachments).to.exist;
  });
});

describe('useLargeAttachments logic', () => {
  let stub = null;

  beforeEach(() => {
    stub = null;
  });

  afterEach(() => {
    if (stub) {
      stub.restore();
    }
    cleanup();
  });

  const stubUseFeatureToggles = value => {
    const useFeatureToggles = require('../../../hooks/useFeatureToggles');
    stub = sinon.stub(useFeatureToggles, 'default').returns(value);
    return stub;
  };

  it('passes useLargeAttachments=true to HowToAttachFiles when largeAttachmentsEnabled is true', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: true,
      cernerPilotSmFeatureFlag: false,
    });

    const customProps = {
      attachments: [],
      attachmentScanError: false,
      editingEnabled: true,
      isOhTriageGroup: false,
      setAttachFileError: () => {},
      setAttachFileSuccess: () => {},
      setAttachments: () => {},
      setNavigationError: () => {},
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    waitFor(() => {
      screen.getByText('You can attach up to 10 files to each message');
      screen.getByText('The maximum size for each file is 25 MB');
    });

    useFeatureTogglesStub.restore();
  });

  it('passes useLargeAttachments=true to HowToAttachFiles when cernerPilotSmFeatureFlag=true and isOhTriageGroup=true', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
      cernerPilotSmFeatureFlag: true,
    });

    const customProps = {
      attachments: [],
      attachmentScanError: false,
      editingEnabled: true,
      isOhTriageGroup: true,
      setAttachFileError: () => {},
      setAttachFileSuccess: () => {},
      setAttachments: () => {},
      setNavigationError: () => {},
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    waitFor(() => {
      screen.getByText('You can attach up to 10 files to each message');
      screen.getByText('The maximum size for each file is 25 MB');
    });

    useFeatureTogglesStub.restore();
  });

  it('passes useLargeAttachments=false to HowToAttachFiles when neither condition is met', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
      cernerPilotSmFeatureFlag: false,
    });

    const customProps = {
      attachments: [],
      attachmentScanError: false,
      editingEnabled: true,
      isOhTriageGroup: false,
      setAttachFileError: () => {},
      setAttachFileSuccess: () => {},
      setAttachments: () => {},
      setNavigationError: () => {},
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    waitFor(() => {
      screen.getByText('You can attach up to 10 files to each message');
      screen.getByText('The maximum size for each file is 25 MB');
    });

    useFeatureTogglesStub.restore();
  });

  it('passes useLargeAttachments=false to HowToAttachFiles when cernerPilotSmFeatureFlag=true but isOhTriageGroup=false', () => {
    const useFeatureTogglesStub = stubUseFeatureToggles({
      largeAttachmentsEnabled: false,
      cernerPilotSmFeatureFlag: true,
    });

    const customProps = {
      attachments: [],
      attachmentScanError: false,
      editingEnabled: true,
      isOhTriageGroup: false,
      setAttachFileError: () => {},
      setAttachFileSuccess: () => {},
      setAttachments: () => {},
      setNavigationError: () => {},
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    waitFor(() => {
      screen.getByText('You can attach up to 4 files to each message');
      screen.getByText('The maximum size for each file is 6 MB');
    });

    useFeatureTogglesStub.restore();
  });

  it('should call removeAttachment when remove button is clicked', () => {
    const mockSetAttachments = sinon.spy();
    const mockSetAttachFileSuccess = sinon.spy();
    const mockSetAttachFileError = sinon.spy();

    const customProps = {
      attachments: [
        { name: 'test1.png', size: 1000, lastModified: 1234567890 },
        { name: 'test2.png', size: 2000, lastModified: 1234567891 },
      ],
      attachmentScanError: false,
      editingEnabled: true,
      compose: true,
      setAttachFileError: mockSetAttachFileError,
      setAttachFileSuccess: mockSetAttachFileSuccess,
      setAttachments: mockSetAttachments,
      setNavigationError: () => {},
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    // Find and click the first remove button
    const removeButtons = screen.getAllByTestId('remove-attachment-button');
    fireEvent.click(removeButtons[0]);
    // Verify the modal opens (this indicates removeAttachment setup was called)
    expect(screen.getByTestId('remove-attachment-modal')).to.have.attribute(
      'visible',
      'true',
    );
    const confirmButton = screen.getByTestId(
      'confirm-remove-attachment-button',
    );
    fireEvent.click(confirmButton);

    // Verify setAttachments was called to remove the attachment
    expect(mockSetAttachments.calledOnce).to.be.true;
    expect(
      mockSetAttachments.calledWith([
        { name: 'test2.png', size: 2000, lastModified: 1234567891 },
      ]),
    ).to.be.true;
  });

  it('should call handleRemoveAllAttachments when remove all button is clicked', async () => {
    const mockSetAttachments = sinon.spy();
    const mockSetAttachFileError = sinon.spy();

    const customProps = {
      attachments: [
        { name: 'test1.png', size: 1000 },
        { name: 'test2.png', size: 2000 },
        { name: 'test3.png', size: 3000 },
      ],
      attachmentScanError: true,
      editingEnabled: true,
      setAttachFileError: mockSetAttachFileError,
      setAttachments: mockSetAttachments,
    };

    const screen = renderWithStoreAndRouter(
      <AttachmentsList {...customProps} />,
      {
        initialState: {},
        reducers: reducer,
        path: Paths.MESSAGE_THREAD,
      },
    );

    // Find and click the "Remove all attachments" button
    const removeAllButton = screen.getByTestId('remove-all-attachments-button');
    fireEvent.click(removeAllButton);

    // Verify setAttachments was called with empty array
    expect(mockSetAttachments.calledOnce).to.be.true;
    expect(mockSetAttachments.calledWith([])).to.be.true;

    // Verify setAttachFileError was called with null (after the dispatch resolves)
    await waitFor(() => {
      expect(mockSetAttachFileError.calledOnce).to.be.true;
      expect(mockSetAttachFileError.calledWith(null)).to.be.true;
    });
  });

  describe('Datadog RUM action names', () => {
    it('should have data-dd-action-name on attachment list item', () => {
      const customProps = {
        attachments: [
          {
            id: 2664842,
            messageId: 2664846,
            name: 'test-file.pdf',
            attachmentSize: 31127,
            download:
              'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664842',
          },
        ],
        attachmentScanError: false,
        editingEnabled: true,
      };

      const screen = renderWithStoreAndRouter(
        <AttachmentsList {...customProps} />,
        {
          initialState: {},
          reducers: reducer,
          path: Paths.COMPOSE,
        },
      );

      const attachmentsList = screen.container.querySelector(
        '.attachments-list',
      );
      const attachmentListItems = attachmentsList.querySelectorAll('li');
      expect(attachmentListItems).to.have.length(1);
      expect(
        attachmentListItems[0].getAttribute('data-dd-action-name'),
      ).to.equal('Attachment Item');
    });

    it('should have data-dd-action-name on all attachment list items when multiple attachments exist', () => {
      const customProps = {
        attachments: [
          {
            id: 2664842,
            messageId: 2664846,
            name: 'test-file-1.pdf',
            attachmentSize: 31127,
            download:
              'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664842',
          },
          {
            id: 2664843,
            messageId: 2664846,
            name: 'test-file-2.jpg',
            attachmentSize: 45200,
            download:
              'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664843',
          },
          {
            id: 2664844,
            messageId: 2664846,
            name: 'test-file-3.docx',
            attachmentSize: 128000,
            download:
              'http://127.0.0.1:3000/my_health/v1/messaging/messages/2664846/attachments/2664844',
          },
        ],
        attachmentScanError: false,
        editingEnabled: false,
      };

      const screen = renderWithStoreAndRouter(
        <AttachmentsList {...customProps} />,
        {
          initialState: {},
          reducers: reducer,
          path: Paths.MESSAGE_THREAD,
        },
      );

      const attachmentsList = screen.container.querySelector(
        '.attachments-list',
      );
      const attachmentListItems = attachmentsList.querySelectorAll('li');
      expect(attachmentListItems).to.have.length(3);

      attachmentListItems.forEach(item => {
        expect(item.getAttribute('data-dd-action-name')).to.equal(
          'Attachment Item',
        );
      });
    });
  });
});
