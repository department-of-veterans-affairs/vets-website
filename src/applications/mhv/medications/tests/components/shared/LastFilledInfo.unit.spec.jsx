import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import prescriptionsListItemNonVA from '../../fixtures/prescriptionsListItemNonVA.json';
import LastFilledInfo from '../../../components/shared/LastFilledInfo';
import { dateFormat } from '../../../util/helpers';

describe('Medicaitons Medications List Card Last Filled Info', () => {
  const rx = prescriptionsListItemNonVA;
  const setup = () => {
    return renderWithStoreAndRouter(<LastFilledInfo {...rx} />, {
      path: '/',
      state: {},
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays the ordered date for document', () => {
    const screen = setup();

    expect(screen.getByTestId('rx-last-filled-info')).to.have.text(
      `Documented on ${dateFormat(rx.orderedDate, 'MMMM D, YYYY')}`,
    );
  });
});
