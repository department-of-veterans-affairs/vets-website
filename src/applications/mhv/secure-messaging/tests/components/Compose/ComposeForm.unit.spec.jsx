import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import draftMessage from '../../fixtures/message-draft-response.json';
import reducer from '../../../reducers';
import signatureReducers from '../../fixtures/signature-reducers.json';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';
import { Paths, Prompts } from '../../../util/constants';
import { messageSignatureFormatter } from '../../../util/helpers';

describe('Compose form component', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
    },
  };

  const getProps = element => {
    let prop;
    Object.keys(element).forEach(key => {
      if (key.match(/^__react[^$]*(\$.+)$/)) {
        prop = key;
      }
    });
    return prop;
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    expect(screen);
  });

  it('displays compose fields if path is /new-message', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const recipient = await screen.getByTestId('compose-recipient-select');
    const categoryRadioButtons = await screen.getAllByTestId(
      'compose-category-radio-button',
    );
    const subject = await screen.getByTestId('message-subject-field');
    const body = await screen.getByTestId('message-body-field');

    expect(recipient).to.exist;
    expect(categoryRadioButtons.length).to.equal(6);
    expect(subject).to.exist;
    expect(body).to.exist;
  });

  it('displays Edit List modal if path is /new-message', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const editListLink = await screen.getByTestId('Edit-List-Button', {
      selector: 'va-button',
      exact: true,
    });
    expect(
      document.querySelector('#edit-list').getAttribute('visible'),
    ).to.equal('false');

    fireEvent.click(editListLink);
    const modalContent = await screen.getByText(
      Prompts.Compose.EDIT_LIST_CONTENT,
    );

    expect(
      document.querySelector('#edit-list').getAttribute('visible'),
    ).to.equal('true');
    expect(
      document.querySelector('.vads-c-action-link--green').getAttribute('href'),
    ).to.equal('https://mhv-syst.myhealth.va.gov/mhv-portal-web/preferences');
    expect(modalContent).to.exist;
  });

  it('displays compose action buttons if path is /new-message', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const sendButton = await screen.getByTestId('Send-Button');
    const saveDraftButton = await screen.getByTestId('Save-Draft-Button');

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays error states on empty fields when send button is clicked', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const sendButton = screen.getByTestId('Send-Button');

    fireEvent.click(sendButton);

    const recipientInput = await screen.getByTestId('compose-recipient-select');

    const subjectInput = await screen.getByTestId('message-subject-field');
    const subjectInputError = subjectInput[getProps(subjectInput)].error;

    const messageInput = await screen.getByTestId('message-body-field');
    const messageInputError = messageInput[getProps(messageInput)].error;

    expect(recipientInput.error).to.equal('Please select a recipient.');
    expect(subjectInputError).to.equal('Subject cannot be blank.');
    expect(messageInputError).to.equal('Message body cannot be blank.');
  });

  it('displays draft page if path is /draft/:id', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage },
      },
    };
    const screen = renderWithStoreAndRouter(
      <ComposeForm draft={draftMessage} recipients={triageTeams} />,
      {
        initialState: state,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const draftMessageHeadingText = await screen.getAllByRole('heading', {
      name: 'COVID: Covid-Inquiry',
      level: 2,
    });
    const deleteButton = await screen.getByTestId('delete-draft-button');

    expect(draftMessageHeadingText).to.exist;
    expect(deleteButton).to.exist;
  });

  it('displays user signature on /new-message when signature is enabled', async () => {
    const customState = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {},
        preferences: signatureReducers.signatureEnabled,
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} draft={{}} />,
      {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput)
      .to.have.attribute('value')
      .equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });

  it('does not display user signature on /new-message when signature is disabled', async () => {
    const customState = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: {},
        preferences: signatureReducers.signatureDisabled,
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} draft={{}} />,
      {
        initialState: customState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput).to.not.have.attribute('value');
  });

  it('does not append an existing draft message body with enabled signature', async () => {
    const customState = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage },
        preferences: signatureReducers.signatureEnabled,
      },
    };

    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} draft={draftMessage} />,
      {
        initialState: customState,
        reducers: reducer,
        path: `/draft/${draftMessage.id}`,
      },
    );

    const messageInput = await screen.getByTestId('message-body-field');

    expect(messageInput)
      .to.have.attribute('value')
      .not.equal(
        messageSignatureFormatter(signatureReducers.signatureEnabled.signature),
      );
  });
});
