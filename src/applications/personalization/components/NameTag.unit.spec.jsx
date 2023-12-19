import React from 'react';
import { expect } from 'chai';
import { renderWithProfileReducers as render } from '../profile/tests/unit-test-helpers';

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
  context('when `totalDisabilityRating` is set', () => {
    it('should render the disability rating', () => {
      const initialState = getInitialState();
      const view = render(<NameTag totalDisabilityRating={70} />, {
        initialState,
      });
      view.getByText(/your disability rating:/i);
      view.getByRole('link', {
        name: /View your 70% service connected disability rating/i,
        text: /70% service connected/i,
        href: /disability\/view-disability-rating\/rating/i,
      });
    });
  });
  context(
    "when `totalDisabilityRating` is not set and there isn't a server error",
    () => {
      it('should not render the disability rating or a fallback link', () => {
        const initialState = getInitialState();
        const view = render(<NameTag totalDisabilityRating={null} />, {
          initialState,
        });
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
    'when `totalDisabilityRating` is not set and there is a server error',
    () => {
      it('should render a fallback link', () => {
        const initialState = getInitialState();
        const view = render(
          <NameTag
            totalDisabilityRating={null}
            totalDisabilityRatingServerError
          />,
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

  context('when user has middle initials', () => {
    const initialState = getInitialState();
    initialState.vaProfile.hero.userFullName = {
      first: 'Max',
      middle: 'H g',
      last: 'Miller',
    };
    let view;
    beforeEach(() => {
      view = render(<NameTag />, {
        initialState,
      });
    });

    it('should capitalize middle initials', () => {
      view.getAllByText('Max H G Miller');
    });
  });

  context('when user has middle initials with punctuation', () => {
    const initialState = getInitialState();
    initialState.vaProfile.hero.userFullName = {
      first: 'Max',
      middle: 'h. G.',
      last: 'Miller',
    };
    let view;
    beforeEach(() => {
      view = render(<NameTag />, {
        initialState,
      });
    });

    it('should capitalize middle initials with punctuation', () => {
      view.getAllByText('Max H. G. Miller');
    });
  });

  context(
    'when user has middle name(s) that start with lowercase letter',
    () => {
      const initialState = getInitialState();
      initialState.vaProfile.hero.userFullName = {
        first: 'Max',
        middle: 'de Rosa',
        last: 'Miller',
      };
      let view;
      beforeEach(() => {
        view = render(<NameTag />, {
          initialState,
        });
      });

      it('should not capitalize full middle names', () => {
        view.getAllByText('Max de Rosa Miller');
      });
    },
  );
});
