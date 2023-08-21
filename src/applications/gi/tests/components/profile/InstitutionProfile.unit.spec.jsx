import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import InstitutionProfile from '../../../components/profile/InstitutionProfile';
import { MINIMUM_RATING_COUNT } from '../../../constants';

describe('<InstitutionProfile>', () => {
  it('should render ratings if rating count >= minimum', () => {
    const tree = shallow(
      <InstitutionProfile
        institution={{
          institutionRating: {
            institutionRatingCount: MINIMUM_RATING_COUNT,
            overallAvg: 2.5,
          },
        }}
      />,
    );
    expect(tree.find('#veteran-ratings').length).to.eq(1);
    tree.unmount();
  });
  it('should not render ratings if rating count < minimum', () => {
    const tree = shallow(
      <InstitutionProfile
        institution={{
          institutionRating: {
            institutionRatingCount: MINIMUM_RATING_COUNT - 1,
            overallAvg: 2.5,
          },
        }}
      />,
    );
    expect(tree.find('#veteran-ratings').length).to.eq(0);
    tree.unmount();
  });
});
