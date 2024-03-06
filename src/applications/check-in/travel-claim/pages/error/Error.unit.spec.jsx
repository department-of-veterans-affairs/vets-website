import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import Error from './index';

const appointments = [
  {
    startTime: '2024-01-01T12:30:00.000-05:00',
  },
];

describe('check-in', () => {
  describe('travel-claim', () => {
    describe('Error component', () => {
      it('renders the correct error on max-validation', () => {
        const component = render(
          <CheckInProvider store={{ error: 'max-validation' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('max-validation')).to.exist;
        expect(component.getByTestId('no-matching-information-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on uuid-not-found', () => {
        const component = render(
          <CheckInProvider store={{ error: 'uuid-not-found' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('uuid-not-found')).to.exist;
        expect(component.getByTestId('expired-link-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on completing-travel-submission', () => {
        const component = render(
          <CheckInProvider store={{ error: 'completing-travel-submission' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('completing-travel-submission')).to.exist;
        expect(component.getByTestId('something-went-wrong-alert')).to.exist;
        expect(component.getByTestId('something-went-wrong-sub-heading')).to
          .exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on cant-file-claim-type', () => {
        const component = render(
          <CheckInProvider store={{ error: 'cant-file-claim-type' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('cant-file-claim-type')).to.exist;
        expect(component.getByTestId('cant-file-claim-type-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on already-filed-claim', () => {
        const component = render(
          <CheckInProvider
            store={{ error: 'already-filed-claim', appointments }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('already-filed-claim')).to.exist;
        expect(component.getByTestId('already-filed-claim-alert')).to.exist;
        expect(component.getByTestId('were-sorry-you-already-filed-a-claim')).to
          .exist;
        expect(component.getByTestId('sign-in-btsss-link')).to.exist;
        expect(
          component.getByTestId('already-filed-claim-alert'),
        ).to.contain.text('January 01, 2024');
      });
      it('renders the correct error on no-token', () => {
        const component = render(
          <CheckInProvider store={{ error: 'no-token' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('no-token')).to.exist;
        expect(component.getByTestId('we-cant-file-a-claim-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on btsss-service-down', () => {
        const component = render(
          <CheckInProvider store={{ error: 'btsss-service-down' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('btsss-service-down')).to.exist;
        expect(component.getByTestId('we-cant-file-a-claim-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
      it('renders the correct error on some-error', () => {
        const component = render(
          <CheckInProvider store={{ error: 'some-error' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('some-error')).to.exist;
        expect(component.getByTestId('we-cant-file-a-claim-alert')).to.exist;
        expect(component.getByTestId('find-out-link')).to.exist;
      });
    });
  });
});
