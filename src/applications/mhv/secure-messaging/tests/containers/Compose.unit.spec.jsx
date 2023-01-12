import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import triageTeams from '../fixtures/recipients.json';
import categories from '../fixtures/categories-response.json';
import draftMessage from '../fixtures/message-draft-response.json';
import reducer from '../../reducers';
import Compose from '../../containers/Compose';

describe('Compose message container', () => {
  const initialState = {
    sm: {
      triageTeams: { triageTeams },
      categories: { categories },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });
    expect(screen);
  });

  it('displays an emergency note with crisis line button', () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });
    const note = screen.getByText(
      'If you’re in a mental health crisis or thinking about suicide',
      { exact: false },
    );
    const crisisLineButton = screen.getByRole('link', {
      name: '988lifeline.org',
    });
    expect(note).to.exist;
    expect(crisisLineButton).to.exist;
  });

  it('dispays loading indicator if recipients are not yet loaded', async () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: {
        sm: {
          triageTeams: { triageTeams: undefined },
        },
      },
      reducers: reducer,
      path: `/compose`,
    });

    const loadingIndicator = await screen.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('displays compose heading if path is /compose', async () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });
    const headingText = await screen.getByRole('heading', {
      name: 'Compose message',
    });

    expect(headingText).to.exist;
  });

  it('displays compose fields if path is /compose', async () => {
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });

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
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState,
      reducers: reducer,
      path: `/compose`,
    });

    const sendButton = await screen.getAllByRole('button', {
      name: 'Send',
    });
    const saveDraftButton = await screen.getByTestId('Save-Draft-Button');

    expect(sendButton).to.exist;
    expect(saveDraftButton).to.exist;
  });

  it('displays draft page if path is /draft/:id', async () => {
    const state = {
      sm: {
        triageTeams: { triageTeams },
        categories: { categories },
        draftDetails: { draftMessage },
      },
    };
    const screen = renderWithStoreAndRouter(<Compose />, {
      initialState: state,
      reducers: reducer,
      path: `/draft/7171715`,
    });

    const headingText = await screen.getAllByRole('heading', {
      name: 'Edit draft',
    });
    const draftMessageHeadingText = await screen.getAllByRole('heading', {
      name: 'COVID: Covid-Inquiry',
      level: 3,
    });
    const discardButton = await screen.getAllByRole('button', {
      name: 'Discard draft',
      exact: false,
    });
    expect(headingText).to.exist;
    expect(draftMessageHeadingText).to.exist;
    expect(discardButton).to.exist;
  });
});
