import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { folderList } from '../fixtures/folder-response.json';
import { PageTitles } from '../../util/constants';
import reducer from '../../reducers';
import Folders from '../../containers/Folders';

describe('Folders Landing Page', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Folders />, {
      initialState: state,
      reducers: reducer,
      path: `/folders`,
    });
  };

  let screen = null;
  beforeEach(() => {
    screen = setup();
  });

  it(`verifies page title tag for 'My folders' page`, async () => {
    await waitFor(() => {
      expect(global.document.title).to.equal(
        PageTitles.MY_FOLDERS_PAGE_TITLE_TAG,
      );
    });
  });

  it('renders without errors', () => {
    expect(screen.findByText('My folders')).to.exist;
  });
});
