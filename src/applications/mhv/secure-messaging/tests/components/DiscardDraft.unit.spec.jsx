import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { beforeEach } from 'mocha';
import DiscardDraft from '../../components/Draft/DiscardDraft';
import { drafts } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import { Prompts } from '../../util/constants';
import * as mockProps from '../fixtures/discard-draft-mock-prop.json';

describe('Discard Draft component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: drafts,
      },
    },
  };
  let screen = null;
  beforeEach(() => {
    screen = renderInReduxProvider(<DiscardDraft draft={mockProps} />, {
      initialState,
      reducers: reducer,
    });
  });

  it('renders without errors', () => {
    expect(screen.getByTestId('discard-draft-button')).to.exist;
  });

  it('opens modal on Discard button click', () => {
    fireEvent.click(screen.getByTestId('discard-draft-button'));
    expect(
      screen.findByText(Prompts.Draft.DISCARD_DRAFT_CONFIRM, {
        exact: true,
      }),
    );
    expect(
      screen.findByText(Prompts.Draft.DISCARD_DRAFT_CONFIRM_NOTE, {
        exact: true,
      }),
    );
    expect(screen.getByTestId('discard-draft-modal')).to.be.visible;
  });
});
