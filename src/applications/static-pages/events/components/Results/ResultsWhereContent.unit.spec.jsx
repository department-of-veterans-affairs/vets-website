import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ResultsWhereContent from './ResultsWhereContent';

describe('ResultsWhereContent', () => {
  describe('when it is an online event', () => {
    it('should render the component as expected', () => {
      const event = {
        fieldLocationType: 'online',
      };

      const screen = render(<ResultsWhereContent event={event} />);

      expect(screen.getByTestId('events-where-content').textContent).to.equal(
        'This is an online event.',
      );
    });
  });

  describe('when a field facility location is not provided', () => {
    it('should render the component as expected', () => {
      const event = {
        fieldLocationType: 'VA',
      };

      const screen = render(<ResultsWhereContent event={event} />);

      expect(
        screen.getByTestId('events-where-content').textContent,
      ).to.deep.equal('');
    });
  });

  describe('when all the relevant data is provided', () => {
    it('should render the component as expected', () => {
      const event = {
        fieldLocationHumanreadable: 'Recreation Center',
        fieldFacilityLocation: {
          entity: {
            title: 'Test title',
            entityUrl: {
              path: '/something',
            },
            fieldAddress: {
              addressLine1: '7400 Merton Minter Boulevard',
              administrativeArea: 'TX',
              locality: 'San Antonio',
            },
          },
        },
        fieldLocationType: 'facility',
      };

      const screen = render(<ResultsWhereContent event={event} />);

      expect(
        screen.getByTestId('event-fieldLocationTitle').textContent,
      ).to.equal('Test title');
      expect(
        screen.getByTestId('event-fieldLocationHumanReadable').textContent,
      ).to.equal('Recreation Center');
      expect(
        screen.getAllByTestId('event-location').at(0).textContent,
      ).to.equal('7400 Merton Minter Boulevard');
      expect(
        screen.getAllByTestId('event-location').at(1).textContent,
      ).to.equal('San Antonio, TX');
      expect(
        screen.getByTestId('event-sr-fieldLocationHumanReadable').textContent,
      ).to.equal('to Recreation Center');
    });
  });
});
