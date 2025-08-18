import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import RouteLeavingGuard from '../../../components/shared/RouteLeavingGuard';
import { ErrorMessages } from '../../../util/constants';
import reducer from '../../../reducers';
import Navigation from '../../../components/Navigation';
import inbox from '../../fixtures/folder-inbox-metadata.json';

describe('RouteLeavingGuard component', () => {
  let saveDraftHandlerSpy;

  beforeEach(() => {
    saveDraftHandlerSpy = sinon.spy();
  });

  const getInitialState = (draftInProgress = {}) => ({
    sm: {
      folders: {
        folder: inbox,
      },
      threadDetails: {
        draftInProgress,
      },
    },
  });

  const setup = (props = {}, state = {}, path = '/compose') => {
    return renderWithStoreAndRouter(
      <>
        <Navigation />
        <RouteLeavingGuard
          saveDraftHandler={saveDraftHandlerSpy}
          type="compose"
          {...props}
        />
      </>,
      {
        initialState: getInitialState(state),
        reducers: reducer,
        path,
      },
    );
  };

  describe('when no navigation or save errors exist', () => {
    it('renders without modal visible', () => {
      const screen = setup();
      const modal = screen.getByTestId('navigation-warning-modal');
      expect(modal.getAttribute('visible')).to.equal('false');
    });

    it('does not block navigation when no errors', () => {
      const screen = setup();
      expect(
        screen.container.querySelector(
          '[data-testid="navigation-warning-modal"][visible="true"]',
        ),
      ).to.not.exist;
    });
  });

  describe('when navigation error exists', () => {
    const navigationError = {
      title: 'Unsaved changes',
      p1: 'You have unsaved changes.',
      p2: 'Do you want to continue?',
      cancelButtonText: 'Stay on page',
      confirmButtonText: 'Leave page',
    };

    it('displays modal when navigationError and modal is visible', () => {
      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      expect(screen.getByTestId('navigation-warning-modal')).to.exist;
      const modal = screen.getByTestId('navigation-warning-modal');
      expect(modal.getAttribute('modal-title')).to.equal('Unsaved changes');
      expect(screen.getByText('You have unsaved changes.')).to.exist;
      expect(screen.getByText('Do you want to continue?')).to.exist;
    });

    it('handles confirm navigation click without save', async () => {
      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const confirmButton = screen.container.querySelector(
        'va-button[text="Leave page"]',
      );
      fireEvent.click(confirmButton);

      expect(saveDraftHandlerSpy.called).to.be.false;
    });

    it('handles cancel navigation click', async () => {
      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const cancelButton = screen.container.querySelector(
        'va-button[text="Stay on page"]',
      );
      fireEvent.click(cancelButton);

      // Modal should still exist but we can check if the spy functions were called correctly
      expect(screen.getByTestId('navigation-warning-modal')).to.exist;
    });
  });

  describe('when save error exists with saved draft', () => {
    const saveError = {
      title: ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title,
      p1: ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.p1,
      cancelButtonText:
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
          .cancelButtonText,
      confirmButtonText:
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
          .confirmButtonText,
    };

    it('displays modal when saveError and savedDraft are true', () => {
      const screen = setup({}, { saveError, savedDraft: true });

      expect(screen.getByTestId('navigation-warning-modal')).to.exist;
      const modal = screen.getByTestId('navigation-warning-modal');
      expect(modal.getAttribute('modal-title')).to.equal(
        ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title,
      );
    });

    it('calls saveDraftHandler when confirm button contains "Save"', async () => {
      const screen = setup({}, { saveError, savedDraft: true });

      const confirmButton = screen.container.querySelector(
        `va-button[text="${
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .confirmButtonText
        }"]`,
      );
      fireEvent.click(confirmButton);

      expect(saveDraftHandlerSpy.calledWith('auto')).to.be.true;
    });

    it('does not call saveDraftHandler when confirm button does not contain "Save"', async () => {
      const customSaveError = {
        ...saveError,
        confirmButtonText: 'Delete draft',
      };

      const screen = setup(
        {},
        { saveError: customSaveError, savedDraft: true },
      );

      const confirmButton = screen.container.querySelector(
        'va-button[text="Delete draft"]',
      );
      fireEvent.click(confirmButton);

      expect(saveDraftHandlerSpy.called).to.be.false;
    });
  });

  describe('cancel button behavior with draft saving', () => {
    it('calls saveDraftHandler with manual when cancel button matches CONT_SAVING_DRAFT', async () => {
      const navigationError = {
        title: ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.title,
        cancelButtonText:
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.cancelButtonText,
        confirmButtonText:
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.confirmButtonText,
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const cancelButton = screen.container.querySelector(
        `va-button[text="${
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT.cancelButtonText
        }"]`,
      );
      fireEvent.click(cancelButton);

      expect(saveDraftHandlerSpy.calledWith('manual')).to.be.true;
    });

    it('calls saveDraftHandler with manual when cancel button matches CONT_SAVING_DRAFT_CHANGES', async () => {
      const navigationError = {
        title: ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.title,
        cancelButtonText:
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.cancelButtonText,
        confirmButtonText:
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.confirmButtonText,
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const cancelButton = screen.container.querySelector(
        `va-button[text="${
          ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES.cancelButtonText
        }"]`,
      );
      fireEvent.click(cancelButton);

      expect(saveDraftHandlerSpy.calledWith('manual')).to.be.true;
    });

    it('does not call saveDraftHandler when cancel button text does not match draft save patterns', async () => {
      const navigationError = {
        title: 'Unsaved changes',
        cancelButtonText: 'Stay on page',
        confirmButtonText: 'Leave page',
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const cancelButton = screen.container.querySelector(
        'va-button[text="Stay on page"]',
      );
      fireEvent.click(cancelButton);

      expect(saveDraftHandlerSpy.called).to.be.false;
    });
  });

  describe('modal visibility and text rendering', () => {
    it('does not render p1 text when cancelButtonText matches UNABLE_TO_SAVE_DRAFT_ATTACHMENT confirmButtonText', () => {
      const saveError = {
        title: "We can't save attachments in a draft message",
        p1: 'This text should not be displayed',
        cancelButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .confirmButtonText,
        confirmButtonText: 'Save draft without attachments',
      };

      const screen = setup({}, { saveError, savedDraft: true });

      expect(screen.queryByText('This text should not be displayed')).to.not
        .exist;
    });

    it('renders p1 text when cancelButtonText does not match UNABLE_TO_SAVE_DRAFT_ATTACHMENT confirmButtonText', () => {
      const saveError = {
        title: "We can't save attachments in a draft message",
        p1: 'This text should be displayed',
        cancelButtonText: 'Edit draft',
        confirmButtonText: 'Save draft without attachments',
      };

      const screen = setup({}, { saveError, savedDraft: true });

      expect(screen.getByText('This text should be displayed')).to.exist;
    });

    it('renders p2 text when provided', () => {
      const navigationError = {
        title: 'Test title',
        p1: 'First paragraph',
        p2: 'Second paragraph should be displayed',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      expect(screen.getByText('Second paragraph should be displayed')).to.exist;
    });

    it('does not render p2 text when not provided', () => {
      const navigationError = {
        title: 'Test title',
        p1: 'First paragraph',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      // Check that there's no empty p tag or second paragraph
      const paragraphs = screen.container.querySelectorAll('p');
      expect(paragraphs).to.have.length(1);
    });
  });

  describe('component props and types', () => {
    it('renders with compose type', () => {
      const screen = setup({ type: 'compose' });
      expect(screen.container).to.exist;
    });

    it('renders with reply type', () => {
      const screen = setup({ type: 'reply' });
      expect(screen.container).to.exist;
    });

    it('renders without crashing when saveDraftHandler is provided', () => {
      const customHandler = sinon.spy();
      const screen = setup({ saveDraftHandler: customHandler });
      expect(screen.container).to.exist;
    });
  });

  describe('datadog action names', () => {
    it('sets correct data-dd-action-name for confirm button when save error exists', () => {
      const saveError = {
        title: ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title,
        cancelButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .cancelButtonText,
        confirmButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .confirmButtonText,
      };

      const screen = setup({}, { saveError, savedDraft: true });

      const confirmButton = screen.container.querySelector(
        `va-button[text="${
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .confirmButtonText
        }"]`,
      );
      expect(confirmButton.getAttribute('data-dd-action-name')).to.equal(
        "Save draft without attachments button - Can't save with attachments modal",
      );
    });

    it('sets correct data-dd-action-name for confirm button when navigation error exists', () => {
      const navigationError = {
        title: 'Unsaved changes',
        cancelButtonText: 'Stay on page',
        confirmButtonText: 'Leave page',
      };

      const screen = setup(
        {},
        { navigationError, navigationErrorModalVisible: true },
      );

      const confirmButton = screen.container.querySelector(
        'va-button[text="Leave page"]',
      );
      expect(confirmButton.getAttribute('data-dd-action-name')).to.equal(
        'Confirm Navigation Leaving Button',
      );
    });

    it('sets correct data-dd-action-name for cancel button when save error exists', () => {
      const saveError = {
        title: ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.title,
        cancelButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .cancelButtonText,
        confirmButtonText:
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .confirmButtonText,
      };

      const screen = setup({}, { saveError, savedDraft: true });

      const cancelButton = screen.container.querySelector(
        `va-button[text="${
          ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT
            .cancelButtonText
        }"]`,
      );
      expect(cancelButton.getAttribute('data-dd-action-name')).to.equal(
        "Edit draft button - Can't save with attachments modal",
      );
    });
  });
});
