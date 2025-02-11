import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../reducers';
import folders from '../fixtures/folder-inbox-response.json';
import folderList from '../fixtures/folder-response.json';

import { Paths, smFooter } from '../../util/constants';
import Footer from '../../components/Footer';

describe('SM Footer component', () => {
  const folder = folders.inbox;

  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
    });
    expect(screen).to.exist;
  });

  it('renders Footer content', () => {
    const screen = renderWithStoreAndRouter(<Footer />, {
      initialState,
      reducers: reducer,
      path: Paths.INBOX,
    });
    expect(screen.getByText(smFooter.needHelp)).to.exist;
    expect(screen.getByText(smFooter.haveQuestions)).to.exist;
    expect(screen.getByText(smFooter.learnMore)).to.exist;
    expect(screen.getByText(smFooter.contactFacility)).to.exist;
    expect(screen.getByText(smFooter.findFacility)).to.exist;
  });
});
