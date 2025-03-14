import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelIntro from '.';

describe('travel-claim', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  const store = {
    formPages: ['travel-info', 'travel-mileage'],
  };
  describe('Intro page', () => {
    it('links to next page', () => {
      const push = sinon.spy();
      const component = render(
        <CheckInProvider
          store={store}
          router={{
            push,
            currentPage: '/travel-info',
            params: {},
          }}
        >
          <TravelIntro />
        </CheckInProvider>,
      );
      const link = component.getByTestId('file-claim-link');
      fireEvent.click(link);
      expect(push.calledWith('travel-mileage')).to.be.true;
    });
    it('renders OMB information', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <TravelIntro />
        </CheckInProvider>,
      );
      expect(getByTestId('travel-pay-omb')).to.exist;
    });
  });
});
