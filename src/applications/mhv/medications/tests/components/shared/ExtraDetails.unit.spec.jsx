import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import ExtraDetails from '../../../components/shared/ExtraDetails';
import { dateFormat } from '../../../util/helpers';

describe('Medications List Card Extra Details', () => {
  const rx = prescriptionsListItem;
  const setup = () => {
    return renderWithStoreAndRouter(<ExtraDetails {...rx} />, {
      path: '/',
      state: {},
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays the refillinprocess information', () => {
    const screen = setup();

    const rxName = screen.findByText(
      'If you need it sooner. Or call your VA pharmacy at',
    );

    expect(screen.getByTestId('rx-refillinprocess-info')).to.have.text(
      `We expect to fill it on ${dateFormat(rx.refillDate, 'MMMM D, YYYY')}.`,
    );
    expect(rxName).to.exist;
  });
});
