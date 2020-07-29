import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import React from 'react';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import { createTestStore } from '../mocks/setup';
import { fetchExpressCareWindows } from '../../actions/expressCare';
import { getNodeText } from '@testing-library/dom';

describe('VAOS <ExpressCareInfoPage>', () => {
  const store = createTestStore({
    expressCare: {
      windowsStatus: 'succeeded',
      allowRequests: true,
      localWindowString: '12:00 a.m. to 11:59 p.m. MDT',
      minStart: {
        utcStart: '2020-07-28T06:00:00Z',
        utcEnd: '2020-07-29T05:59:00Z',
        start: '2020-07-28T00:00:00-06:00',
        end: '2020-07-28T23:59:00-06:00',
        offset: '-06:00',
        timeZone: 'MDT',
        name: 'CHYSHR-Cheyenne VA Medical Center',
        id: '983',
      },
      maxEnd: {
        utcStart: '2020-07-28T06:00:00Z',
        utcEnd: '2020-07-29T05:59:00Z',
        start: '2020-07-28T00:00:00-06:00',
        end: '2020-07-28T23:59:00-06:00',
        offset: '-06:00',
        timeZone: 'MDT',
        name: 'CHYSHR-Cheyenne VA Medical Center',
        id: '983',
      },
    },
  });

  it('should render', () => {
    const { debug, getByText, queryByText } = renderInReduxProvider(
      <ExpressCareInfoPage />,
      { store },
    );

    // debug();
    expect(getByText(/How Express Care Works/i)).to.exist;
  });

  it('should display start and end time for express care request', () => {
    const { debug, getByText, queryByText } = renderInReduxProvider(
      <ExpressCareInfoPage />,
      { store },
    );

    expect(
      getByText(
        /You can request Express Care between 12:00 and 11:59 p.m. MDT./i,
      ),
    ).to.exist;
  });
});
