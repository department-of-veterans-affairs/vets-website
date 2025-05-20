import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import NeedHelp from '../../../components/shared/NeedHelp';
import { dataDogActionNames, pageType } from '../../../util/dataDogConstants';

describe('Need Help shared component', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<NeedHelp page={pageType.REFILL} />, {
      path: '/',
      state: {},
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('has correct DD action names', () => {
    const screen = setup();

    expect(screen.getByTestId('go-to-use-medications-link')).to.have.attribute(
      'data-dd-action-name',
      dataDogActionNames.refillPage.GO_TO_USE_MEDICATIONS_LINK,
    );

    expect(screen.getByTestId('start-a-new-message-link')).to.have.attribute(
      'data-dd-action-name',
      dataDogActionNames.refillPage.COMPOSE_A_MESSAGE_LINK,
    );
  });
});
