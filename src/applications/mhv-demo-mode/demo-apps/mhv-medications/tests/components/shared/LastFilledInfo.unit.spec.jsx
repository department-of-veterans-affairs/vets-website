import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import prescriptionsListItemNonVA from '../../fixtures/prescriptionsListItemNonVA.json';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import LastFilledInfo from '../../../components/shared/LastFilledInfo';
import { dateFormat } from '../../../util/helpers';
import { DATETIME_FORMATS } from '../../../util/constants';

describe('Medications Medications List Card Last Filled Info', () => {
  const setup = (rx = prescriptionsListItemNonVA) => {
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
    const rx = prescriptionsListItemNonVA;
    const screen = setup(rx);

    expect(screen.getByTestId('rx-last-filled-info')).to.have.text(
      `Documented on ${dateFormat(
        rx.orderedDate,
        DATETIME_FORMATS.longMonthDate,
      )}`,
    );
  });

  it('does not render last filled date for non-VA prescriptions', () => {
    const screen = setup();
    expect(screen.queryByTestId('rx-last-filled-date')).to.not.exist;
  });

  it('does not render "Not filled yet" for non-VA prescriptions', () => {
    const screen = setup();
    expect(screen.queryByTestId('active-not-filled-rx')).to.not.exist;
  });

  it('displays the last filled date for VA prescriptions', () => {
    const rx = prescriptionsListItem;
    rx.sortedDispensedDate = '2023-02-04T05:00:00.000Z';
    const screen = setup(rx);
    expect(
      screen.getByText(
        `Last filled on ${dateFormat(
          rx.sortedDispensedDate,
          DATETIME_FORMATS.longMonthDate,
        )}`,
      ),
    ).to.exist;
  });

  it('does not the last filled date when vets api sends null as the value for sortedDispensedDate', () => {
    const rx = prescriptionsListItem;
    rx.sortedDispensedDate = null;
    const screen = setup(rx);
    expect(
      screen.queryByText(
        `Last filled on ${dateFormat(
          rx.sortedDispensedDate,
          DATETIME_FORMATS.longMonthDate,
        )}`,
      ),
    ).to.not.exist;
  });

  describe('Cerner pilot enabled', () => {
    const setupWithCernerPilot = (rx = prescriptionsListItem) => {
      return renderWithStoreAndRouterV6(<LastFilledInfo {...rx} />, {
        initialState: {
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_medications_cerner_pilot: true,
          },
        },
        reducers,
      });
    };

    it('does not render "Not filled yet" when Cerner pilot is enabled and no dispense date', () => {
      const rx = { ...prescriptionsListItem, sortedDispensedDate: null };
      const screen = setupWithCernerPilot(rx);
      expect(screen.queryByTestId('active-not-filled-rx')).to.not.exist;
      expect(screen.queryByText('Not filled yet')).to.not.exist;
    });
  });
});
