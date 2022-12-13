import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import triageTeams from '../../fixtures/recipients.json';
import categories from '../../fixtures/categories-response.json';
import draftMessage from '../../fixtures/message-draft-response.json';
import reducer from '../../../reducers';
import ComposeForm from '../../../components/ComposeForm/ComposeForm';

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
        path: `/compose`,
      },
    );
    expect(screen);
  });

  it('displays compose fields if path is /compose', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: `/compose`,
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

  it('displays compose action buttons if path is /compose', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: `/compose`,
      },
    );

    const sendButton = await screen.getAllByRole('button', {
      name: 'Send',
    });
    const saveDraftButton = await screen.getByRole('button', {
      name: 'Save draft',
    });

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays error states on empty fields when send button is clicked', async () => {
    const screen = renderWithStoreAndRouter(
      <ComposeForm recipients={triageTeams} />,
      {
        initialState,
        reducers: reducer,
        path: `/compose`,
      },
    );

    const sendButton = screen.getAllByRole('button', {
      name: 'Send',
    })[1];

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
        path: `/draft/7171715`,
      },
    );

    const draftMessageHeadingText = await screen.getAllByRole('heading', {
      name: 'COVID: Covid-Inquiry',
      level: 3,
    });
    const discardButton = await screen.getAllByRole('button', {
      name: 'Discard',
      exact: false,
    });

    expect(draftMessageHeadingText).to.exist;
    expect(discardButton).to.exist;
  });
});
