import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import InstitutionProfile from '../../../components/profile/InstitutionProfile';
import { MINIMUM_RATING_COUNT } from '../../../constants';

describe('<InstitutionProfile>', () => {
  const defaultProps = {
    institution: {
      type: 'FOR PROFIT',
      vetTecProvider: true,
      city: 'Test',
      state: 'TN',
      country: 'USA',
      ratingCount: MINIMUM_RATING_COUNT,
      ratingAverage: 2.5,
    },
    showModal: () => {},
  };
  it('should render', () => {
    const tree = shallow(<InstitutionProfile {...defaultProps} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should render ratings if rating count >= minimum', () => {
    const tree = shallow(
      <InstitutionProfile {...defaultProps} gibctSchoolRatings />,
    );
    expect(tree.find('#profile-school-ratings').length).to.eq(1);
    tree.unmount();
  });
  // it('should not render ratings if rating count < minimum', () => {
  //   const belowMinimumRatingsProps = {
  //     ...defaultProps,
  //     institution: {
  //       ...defaultProps.institution,
  //       ratingCount: MINIMUM_RATING_COUNT - 1,
  //     },
  //   };

  //   const tree = shallow(
  //     <InstitutionProfile {...belowMinimumRatingsProps} gibctSchoolRatings />,
  //   );
  //   expect(tree.find('#profile-school-ratings').length).to.eq(1);
  //   tree.unmount();
  // });
});
