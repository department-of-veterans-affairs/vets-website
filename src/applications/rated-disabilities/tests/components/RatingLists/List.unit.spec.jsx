import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { List } from '../../../components/RatingLists';

describe('<List />', () => {
  context('when there are no ratings', () => {
    it('should display an alert indicating that there are no ratings', () => {
      const screen = render(<List ratings={rating} />);

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
        const screen = render(<List ratings={ratings} />);

        expect(screen.getByText(serviceConnectedSectionTitle)).to.exist;
        expect(screen.getByText(nonServiceConnectedSectionTitle)).to.exist;
      });
    },
  );

  context('when there are only service-connected ratings', () => {
    it('should only display the service-connected ratings section', () => {
      const screen = render(<List ratings={ratings} />);

      expect(screen.getByText(serviceConnectedSectionTitle)).to.exist;
      expect(screen.queryByText(nonServiceConnectedSectionTitle)).not.to.exist;
    });
  });

  context('when there are only non-service-connected ratings', () => {
    it('should only display the non-service-connected ratings section', () => {
      const screen = render(<List ratings={ratings} />);

      expect(screen.queryByText(serviceConnectedSectionTitle)).not.to.exist;
      expect(screen.getByText(nonServiceConnectedSectionTitle)).to.exist;
    });
  });
});
