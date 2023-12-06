import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import DeleteDraft from '../../components/Draft/DeleteDraft';
import { drafts, inbox, sent } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Prompts } from '../../util/constants';
import * as mockProps from '../fixtures/delete-draft-mock-prop.json';

describe('Delete Draft component', () => {
  it('renders without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
      },
    };
    let screen = null;
    let setNavigationErrorSpy = null;
    setNavigationErrorSpy = sinon.spy();
    screen = renderInReduxProvider(
      <DeleteDraft
        draftId={mockProps.draft.messageId}
        setNavigationError={setNavigationErrorSpy}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it('opens modal on delete button click', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
      },
    };
    let screen = null;
    let setNavigationErrorSpy = null;
    setNavigationErrorSpy = sinon.spy();
    screen = renderInReduxProvider(
      <DeleteDraft
        draftId={mockProps.draft.messageId}
        setNavigationError={setNavigationErrorSpy}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('delete-draft-button'));
    expect(screen.getByTestId('delete-draft-modal')).to.be.visible;
    expect(
      screen.findByText(Prompts.Draft.DELETE_DRAFT_CONFIRM, {
        exact: true,
      }),
    );
    expect(
      screen.findByText(Prompts.Draft.DELETE_DRAFT_CONFIRM_NOTE, {
        exact: true,
      }),
    );
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );

    fireEvent.click(document.querySelector('va-button[text="Cancel"]'));
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('on delete draft confirmation, calls deleteDraft action on saved draft', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: drafts,
        },
      },
    };
    let screen = null;
    let setNavigationErrorSpy = null;
    setNavigationErrorSpy = sinon.spy();
    screen = renderInReduxProvider(
      <DeleteDraft
        draftId={mockProps.draft.messageId}
        setNavigationError={setNavigationErrorSpy}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('delete-draft-button'));

    fireEvent.click(document.querySelector('va-button[text="Delete draft"]'));
    expect(setNavigationErrorSpy.called).to.be.true;
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('on delete draft confirmation, deletes unsaved new draft', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: sent,
        },
      },
    };
    let screen = null;

    screen = renderInReduxProvider(
      <DeleteDraft draftId={undefined} messageBody="Unsaved message text" />,
      {
        initialState,
        reducers: reducer,
      },
    );
    fireEvent.click(screen.getByTestId('delete-draft-button'));

    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'true',
    );
    fireEvent.click(
      document.querySelector('va-button[text="Yes, delete this draft"]'),
    );
    expect(screen.getByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('renders blank compose draft without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: inbox,
        },
      },
    };
    let screen = null;

    screen = renderInReduxProvider(
      <DeleteDraft
        draftId={undefined}
        navigationError={null}
        formPopulated={false}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

    expect(screen.getByTestId('delete-draft-button')).to.exist;
    const deleteButton = screen.getByTestId('delete-draft-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });

  it('renders blank reply draft without errors', async () => {
    const initialState = {
      sm: {
        folders: {
          folder: sent,
        },
      },
    };
    let screen = null;

    screen = renderInReduxProvider(
      <DeleteDraft
        draftId={null}
        navigationError={undefined}
        formPopulated={undefined}
        messageBody=""
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

    expect(screen.getByTestId('delete-draft-button')).to.exist;
    const deleteButton = screen.queryByTestId('delete-draft-button');
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId('delete-draft-modal')).to.have.attribute(
      'visible',
      'false',
    );
  });
});
