import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelIntro from '.';
import { multiFacility, singleFacility } from './testAppointments';

describe('travel-claim', () => {
  const store = {
    formPages: ['travel-info', 'select-appointment', 'travel-mileage'],
  };
  describe('Intro page', () => {
    it('links to select page if multiple facilites in payload', () => {
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
          <TravelIntro appointments={multiFacility} />
        </CheckInProvider>,
      );
      const link = component.getByTestId('file-claim-link');
      fireEvent.click(link);
      expect(push.calledWith({ pathname: 'select-appointment' })).to.be.true;
    });
    it('links to single page if one facility in payload', () => {
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
          <TravelIntro appointments={singleFacility} />
        </CheckInProvider>,
      );
      const link = component.getByTestId('file-claim-link');
      fireEvent.click(link);
      expect(push.calledWith({ pathname: 'travel-mileage' })).to.be.true;
    });
  });
});
