import React from 'react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import IntroductionPage from '../../../../components/submit-flow/pages/IntroductionPage';
import reducer from '../../../../redux/reducer';

describe('Introduction page', () => {
  const props = {
    onStart: () => {},
  };

  it('should render with link to file a claim', () => {
    const screen = renderWithStoreAndRouter(<IntroductionPage {...props} />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: true,
            error: null,
            data: null,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
    expect(screen.getByTestId('travel-pay-loading-indicator')).to.exist;
    expect($('va-link-action[text="File a mileage only claim"]')).to.exist;
  });
});
