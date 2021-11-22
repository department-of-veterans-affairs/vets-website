import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { MINIMUM_RATING_COUNT } from '../../../constants';
import HeadingSummary from '../../../components/profile/HeadingSummary';

const defaultProps = {
  institution: {
    name: 'TEST INSTITUTION',
    type: 'FOR PROFIT',
    vetTecProvider: true,
    city: 'Test',
    state: 'TN',
    country: 'USA',
    ratingCount: MINIMUM_RATING_COUNT,
    ratingAverage: 2.5,
    cautionFlags: [],
  },
  onLearnMore: () => {},
  onViewWarnings: () => {},
};
describe('<HeadingSummary>', () => {
  it('should render', () => {
    const tree = shallow(<HeadingSummary {...defaultProps} />);
    expect(tree.find('h1').length).to.eq(1);
    expect(tree.html()).to.contain(defaultProps.institution.name);
    tree.unmount();
  });
  it('should not render ratings without gibctSchoolRatings flag', () => {
    const tree = shallow(<HeadingSummary {...defaultProps} />);
    expect(tree.find('.rating-stars').length).to.eq(0);
    tree.unmount();
  });
  it('should render ratings if rating count >= minimum', () => {
    const tree = shallow(
      <HeadingSummary {...defaultProps} gibctSchoolRatings />,
    );
    expect(tree.find('.rating-stars').length).to.eq(1);
    tree.unmount();
  });
  it('should not render ratings if rating count < minimum', () => {
    const belowMinimumRatingProps = {
      ...defaultProps,
      institution: {
        ...defaultProps.institution,
        ratingCount: MINIMUM_RATING_COUNT - 1,
      },
    };
    const tree = shallow(
      <HeadingSummary {...belowMinimumRatingProps} gibctSchoolRatings />,
    );
    expect(tree.find('.rating-stars').length).to.eq(0);
    tree.unmount();
  });
});
