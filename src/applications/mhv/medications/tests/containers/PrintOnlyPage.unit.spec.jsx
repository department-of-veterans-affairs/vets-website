import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import PrintOnlyPage from '../../containers/PrintOnlyPage';

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouter(
      <PrintOnlyPage>
        <span>This is the page content.</span>
      </PrintOnlyPage>,
      {
        initialState: {},
        reducers,
        path: '/1',
        ...params,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders content as body of table', () => {
    setup();
    const text = document.querySelector('span').textContent;
    expect(text).to.contain('This is the page content.');
  });
});
