import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderWithRouter } from '../../utils';

import ClaimLetterSection from '../../../components/claim-letters/ClaimLetterSection';

const getStore = (cstIncludeDdlBoaLettersEnabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_include_ddl_boa_letters: cstIncludeDdlBoaLettersEnabled,
    },
  }));

describe('<ClaimLetterSection>', () => {
  context('cstIncludeDdlBoaLetters feature toggle false', () => {
    it('should render a ClaimLetterSection section', () => {
      const screen = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimLetterSection />
        </Provider>,
      );

      screen.getByText('Your claim letters');
      screen.getByText('Download your VA claim letters');
      screen.getByText(
        'You can download your decision letters online. You can also get other letters related to your claims.',
      );
    });
  });

  context('cstIncludeDdlBoaLetters feature toggle true', () => {
    it('should render a ClaimLetterSection section', () => {
      const screen = renderWithRouter(
        <Provider store={getStore(true)}>
          <ClaimLetterSection />
        </Provider>,
      );
      screen.getByText('Your claim letters');
      screen.getByText('Download your VA claim letters');
      screen.getByText(
        'You can download your decision letters online. You can also get other letters related to your claims and appeals.',
      );
    });
  });
});
