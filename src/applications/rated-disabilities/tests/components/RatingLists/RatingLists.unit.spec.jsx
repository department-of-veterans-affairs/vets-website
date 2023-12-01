import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import RatingLists from '../../../components/RatingLists';

const nonServiceConnectedSectionTitle =
  'Conditions VA determined aren’t service-connected';
const serviceConnectedSectionTitle = 'Service-connected ratings';

const ratings = [
  {
    decision: 'Service Connected',
    diagnosticText: 'Hearing Loss',
    diagnosticTypeName: '6100-Hearing loss',
    effectiveDate: '2005-01-01',
    ratingPercentage: 100,
  },
  {
    decision: 'Service Connected',
    diagnosticText: 'Allergies due to Hearing Loss',
    diagnosticTypeName: 'Limitation of flexion, knee',
    effectiveDate: '2012-05-01',
    ratingPercentage: 10,
  },
  {
    decision: 'Service Connected',
    diagnosticText: 'Sarcoma Soft-Tissue',
    diagnosticTypeName: 'Soft tissue sarcoma (neurogenic origin)',
    effectiveDate: '2018-08-01',
    ratingPercentage: 0,
  },
  {
    decision: 'Not Service Connected',
    diagnosticText: 'Tinnitus',
    diagnosticTypeName: 'Tinnitus',
    effectiveDate: null,
    ratingPercentage: null,
  },
  {
    decision: 'Not Service Connected',
    diagnosticText: 'Diabetes',
    diagnosticTypeName: 'Diabetes mellitus',
    effectiveDate: null,
    ratingPercentage: null,
  },
];

describe('<RatingLists />', () => {
  context('when there are no ratings', () => {
    it('should display an alert indicating that there are no ratings', () => {
      const screen = render(<RatingLists ratings={[]} />);

      expect(
        screen.getByText(
          'We don’t have any rated disabilities on file for you',
        ),
      ).to.exist;
    });
  });

  context(
    'when there are a mix of service-connected and non-service-connected ratings',
    () => {
      it('should display both sections', () => {
        const screen = render(<RatingLists ratings={ratings} />);

        expect(screen.getByText(serviceConnectedSectionTitle)).to.exist;
        expect(screen.getByText(nonServiceConnectedSectionTitle)).to.exist;
      });

      it('should display a total of five ratings', () => {
        const screen = render(<RatingLists ratings={ratings} />);
  
        const cards = screen.getAllByRole('heading', { level: 4 });
        expect(cards.length).to.equal(5);
      });
    },
  );

  context('when there are only service-connected ratings', () => {
    it('should only display the service-connected ratings section', () => {
      const screen = render(<RatingLists ratings={ratings.slice(0, 3)} />);

      expect(screen.getByText(serviceConnectedSectionTitle)).to.exist;
      expect(screen.queryByText(nonServiceConnectedSectionTitle)).not.to.exist;
    });

    it('should display a total of three ratings', () => {
      const screen = render(<RatingLists ratings={ratings.slice(0, 3)} />);

      const cards = screen.getAllByRole('heading', { level: 4 });
      expect(cards.length).to.equal(3);
    });
  });

  context('when there are only non-service-connected ratings', () => {
    it('should only display the non-service-connected ratings section', () => {
      const screen = render(<RatingLists ratings={ratings.slice(3)} />);

      expect(screen.queryByText(serviceConnectedSectionTitle)).not.to.exist;
      expect(screen.getByText(nonServiceConnectedSectionTitle)).to.exist;
    });

    it('should display a total of two ratings', () => {
      const screen = render(<RatingLists ratings={ratings.slice(3)} />);

      const cards = screen.getAllByRole('heading', { level: 4 });
      expect(cards.length).to.equal(2);
    });
  });
});
