import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import prescriptionsListItemNonVA from '../../fixtures/prescriptionsListItemNonVA.json';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import LastFilledInfo from '../../../components/shared/LastFilledInfo';
import { dateFormat } from '../../../util/helpers';

describe('Medications Medications List Card Last Filled Info', () => {
  const rx = prescriptionsListItemNonVA;
  const setup = () => {
    return renderWithStoreAndRouterV6(<LastFilledInfo {...rx} />, {
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

  it('displays the last filled date for VA prescriptions', () => {
    const vaRx = prescriptionsListItem;
    vaRx.sortedDispensedDate = '2023-02-04T05:00:00.000Z';
    const screen = renderWithStoreAndRouterV6(<LastFilledInfo {...vaRx} />, {
      state: {},
      reducers,
    });
    expect(
      screen.getByText(
        `Last filled on ${dateFormat(
          vaRx.sortedDispensedDate,
          'MMMM D, YYYY',
        )}`,
      ),
    ).to.exist;
  });

  it('does not the last filled date when vets api sends null as the value for sortedDispensedDate', () => {
    const vaRx = prescriptionsListItem;
    vaRx.sortedDispensedDate = null;
    const screen = renderWithStoreAndRouterV6(<LastFilledInfo {...vaRx} />, {
      state: {},
      reducers,
    });
    expect(
      screen.queryByText(
        `Last filled on ${dateFormat(
          vaRx.sortedDispensedDate,
          'MMMM D, YYYY',
        )}`,
      ),
    ).to.not.exist;
  });
});
