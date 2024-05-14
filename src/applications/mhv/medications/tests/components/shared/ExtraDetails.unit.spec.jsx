import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import ExtraDetails from '../../../components/shared/ExtraDetails';
import { dateFormat } from '../../../util/helpers';
import { dispStatusObj } from '../../../util/constants';

describe('Medications List Card Extra Details', () => {
  const prescription = prescriptionsListItem;
  const setup = (rx = prescription) => {
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

  it('when dispStatus is discontinued, dispalys matching element', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: dispStatusObj.discontinued,
    });
    expect(screen.findByTestId('discontinued'));
  });

  it('when dispStatus is transferred, dispalys matching element', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: dispStatusObj.transferred,
    });
    expect(screen.findByTestId('transferred'));
  });

  it('when dispStatus is onHold, dispalys matching element', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: dispStatusObj.onHold,
    });
    expect(screen.findByTestId('active-onHold'));
  });

  it('when dispStatus is submitted, dispalys matching element', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: dispStatusObj.submitted,
    });
    expect(screen.findByTestId('submitted-refill-request'));
  });

  it('when dispStatus is expired, dispalys matching element', () => {
    const screen = setup({
      ...prescriptionsListItem,
      dispStatus: dispStatusObj.expired,
    });
    expect(screen.findByTestId('expired'));
  });

  it('displays the refillinprocess information', () => {
    const screen = setup();

    const rxName = screen.findByText(
      'If you need it sooner. Or call your VA pharmacy at',
    );

    expect(screen.getByTestId('rx-refillinprocess-info')).to.have.text(
      `We expect to fill it on ${dateFormat(
        prescription.refillDate,
        'MMMM D, YYYY',
      )}.`,
    );
    expect(rxName).to.exist;
  });
});
