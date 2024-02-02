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
    const text = document.querySelector('tbody').textContent;
    expect(text).to.contain('This is the page content.');
  });

  it('Medications | Veterans Affairs', () => {
    const screen = setup();
    const rxName = screen.findByText('Medications | Veterans Affairs');
    expect(rxName).to.exist;
  });

  it('display user name and dob', () => {
    const screen = setup();
    const name = 'Doe, John R., Jr.';
    const dob = 'March 15, 1982';
    expect(screen.findByText(name)).to.exist;
    expect(screen.findByText(`Date of birth: ${dob}`)).to.exist;
  });
});
