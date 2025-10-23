import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { ListItem } from '../../../components/RatingLists';

describe('<ListItem>', () => {
  context('Service-connected rating', () => {
    const rating = {
      decision: 'Not Service Connected',
      diagnosticText: 'Diabetes Mellitus',
      diagnosticTypeName: 'Diabetes mellitus0',
      effectiveDate: '2023-11-20',
      ratingPercentage: 20,
    };

    it('should render the rating name w. a percentage', () => {
      const screen = render(<ListItem rating={rating} />);

      expect(screen.getByText('20% rating for Diabetes Mellitus')).to.exist;
    });

    it('should display the effective date of the rating', () => {
      const screen = render(<ListItem rating={rating} />);

      expect(screen.getByText('November 20, 2023')).to.exist;
    });
  });

  context('Non-service-connected rating', () => {
    const rating = {
      decision: 'Not Service Connected',
      diagnosticText: 'Tinnitus',
      diagnosticTypeName: 'tinnitus',
      effectiveDate: null,
      ratingPercentage: null,
    };

    it('should render the rating name w/o a percentage', () => {
      const screen = render(<ListItem rating={rating} />);

      expect(screen.getByText('Tinnitus')).to.exist;
    });

    it('should not display the effective date field', () => {
      const screen = render(<ListItem rating={rating} />);

      expect(screen.queryByText('Effective date:')).not.to.exist;
    });
  });
});
