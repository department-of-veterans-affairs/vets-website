import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import { Paths } from '../../../util/constants';
import noBlockedRecipients from '../../fixtures/json-triage-mocks/triage-teams-mock.json';

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
      <ComposeForm recipients={initialState.sm.recipients} {...props} />,
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
});
