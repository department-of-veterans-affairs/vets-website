import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import EditContentListOrSignatureModal from '../../../components/Modals/EditContentListOrSignatureModal';
import { Paths, Prompts } from '../../../util/constants';

describe('Edit Content List or Signature Modal component', () => {
  const initialState = {
    sm: {
      categories: { categories },
    },
  };
  it('should render without errors', async () => {
    const screen = renderWithStoreAndRouter(
      <EditContentListOrSignatureModal visible />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const modal = screen.getByTestId('edit-list');
    expect(modal).to.exist;

    expect(modal).to.have.attribute(
      'modal-title',
      Prompts.Compose.EDIT_LIST_TITLE,
    );
    expect(modal).to.have.attribute('status', 'warning');
    expect(screen.getByText(Prompts.Compose.EDIT_LIST_CONTENT));

    const editPreferencesDeepLink = screen.getByTestId('edit-preferences-link');
    expect(editPreferencesDeepLink).to.have.attribute(
      'href',
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/preferences',
    );

    const linkText = editPreferencesDeepLink.textContent;
    expect(linkText).to.equal(Prompts.Compose.EDIT_LIST_LINK);
  });
});
