import React from 'react';
import { renderWithProfileReducers as render } from '../profile/tests/unit-test-helpers';
import { expect } from 'chai';

import NameTag from './NameTag';

const getInitialState = () => ({
  vaProfile: {
    hero: {
      userFullName: {
        first: 'Johnnie',
        middle: 'Leonard',
        last: 'Weaver',
      },
    },
    militaryInformation: {
      serviceHistory: {
        serviceHistory: [
          {
            branchOfService: 'Army',
            beginDate: '2004-02-01',
            endDate: '2007-02-01',
          },
          {
            branchOfService: 'Coast Guard',
            beginDate: '2009-02-01',
            endDate: '2019-02-01',
          },
          {
            branchOfService: 'Navy',
            beginDate: '2007-02-01',
            endDate: '2009-02-01',
          },
        ],
      },
    },
  },
});

describe('<NameTag>', () => {
  context(
    'when name is set and there are multiple service history entries',
    () => {
      let view;
      beforeEach(() => {
        view = render(<NameTag />, {
          initialState: getInitialState(),
        });
      });
      it("should render the Veteran's name", () => {
        view.getByText('Johnnie Leonard Weaver');
      });
      it('should render the most recent branch of service', () => {
        view.getByText('United States Coast Guard');
        view.getByRole('img', { alt: /coast guard seal/ });
      });
    },
  );
  context(
    'when `showUpdatedNameTag` flag is `true` and `totalDisabilityRating` is set',
    () => {
      it('should render the disability rating', () => {
        const initialState = getInitialState();
        const view = render(
          <NameTag showUpdatedNameTag totalDisabilityRating={70} />,
          { initialState },
        );
        view.getByText(/your disability rating:/i);
        view.getByRole('link', {
          name: /view your disability rating/i,
          text: /70% service connected/i,
          href: /disability\/view-disability-rating\/rating/i,
        });
      });
    },
  );
  context(
    'when `showUpdatedNameTag` flag is `true` and `totalDisabilityRating` is not set',
    () => {
      it('should not render the disability rating', () => {
        const initialState = getInitialState();
        const view = render(
          <NameTag showUpdatedNameTag totalDisabilityRating={null} />,
          { initialState },
        );
        expect(view.queryByText(/your disability rating:/i)).to.not.exist;
        expect(
          view.queryByRole('link', {
            name: /view your disability rating/i,
            href: /disability\/view-disability-rating\/rating/i,
          }),
        ).to.not.exist;
      });
    },
  );
  context(
    'when `showUpdatedNameTag` flag is `true` and `totalDisabilityRatingError` is `true`',
    () => {
      it('should render a fallback link', () => {
        const initialState = getInitialState();
        const view = render(
          <NameTag showUpdatedNameTag totalDisabilityRatingError />,
          { initialState },
        );
        expect(view.queryByText(/your disability rating:/i)).to.not.exist;
        view.getByRole('link', {
          name: /view your disability rating/i,
          text: /view disability rating/i,
          href: /disability\/view-disability-rating\/rating/i,
        });
      });
    },
  );
});
