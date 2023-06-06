import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { beforeEach } from 'mocha';
import DeleteDraft from '../../components/Draft/DeleteDraft';
import { drafts } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Prompts } from '../../util/constants';
import * as mockProps from '../fixtures/delete-draft-mock-prop.json';

describe('Delete Draft component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: drafts,
      },
    },
  };
  let screen = null;
  beforeEach(() => {
    screen = renderInReduxProvider(<DeleteDraft draft={mockProps} />, {
      initialState,
      reducers: reducer,
    });
  });

  it('renders without errors', () => {
    expect(screen.getByTestId('delete-draft-button')).to.exist;
  });

  it('opens modal on delete button click', () => {
    fireEvent.click(screen.getByTestId('delete-draft-button'));
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
    expect(screen.getByTestId('delete-draft-modal')).to.be.visible;
  });
});
