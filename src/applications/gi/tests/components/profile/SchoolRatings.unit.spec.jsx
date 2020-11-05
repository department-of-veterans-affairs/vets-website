import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SchoolRatings from '../../../components/profile/SchoolRatings';

describe('<SchoolRatings>', () => {
  const validInstitutionCategoryRatings = [
    {
      categoryName: 'overall_experience',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'quality_of_classes',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'online_instruction',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'job_preparation',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'gi_bill_support',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'veteran_community',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
    {
      categoryName: 'marketing_practices',
      averageRating: 3,
      totalCount: 5,
      rated5Count: 0,
      rated4Count: 0,
      rated3Count: 2,
      rated2Count: 0,
      rated1Count: 0,
      naCount: 0,
    },
  ];

  it('should render', () => {
    const wrapper = shallow(
      <SchoolRatings ratingAverage={3} ratingCount={6} />,
    );
    expect(wrapper.find('.school-ratings').length).to.eq(1);
    expect(wrapper.find('i').length).to.eq(5);
    expect(wrapper.find('SchoolCategoryRating').length).to.eq(0);
    wrapper.unmount();
  });
  it('should render all valid category ratings', () => {
    const wrapper = shallow(
      <SchoolRatings
        ratingAverage={3}
        ratingCount={6}
        institutionCategoryRatings={[
          ...validInstitutionCategoryRatings,
          {
            categoryName: 'skateboard_knowledge',
            averageRating: 3,
            totalCount: 5,
            rated5Count: 0,
            rated4Count: 0,
            rated3Count: 2,
            rated2Count: 0,
            rated1Count: 0,
            naCount: 0,
          },
        ]}
      />,
    );
    expect(wrapper.find('SchoolCategoryRating').length).to.eq(7);
    wrapper.unmount();
  });
  it('should default all SchoolCategoryRating to be closed', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={3}
        ratingCount={6}
        institutionCategoryRatings={validInstitutionCategoryRatings}
      />,
    );
    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(7);
    expect(wrapper.find('button[aria-expanded=true]').length).to.eq(0);

    wrapper.unmount();
  });

  it('should handle SchoolCategoryRating open', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={3}
        ratingCount={6}
        institutionCategoryRatings={validInstitutionCategoryRatings}
      />,
    );

    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(7);

    wrapper
      .find('button')
      .first()
      .simulate('click');

    expect(wrapper.find('button[aria-expanded=true]').length).to.eq(1);
    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(6);

    wrapper.unmount();
  });

  it('should handle SchoolCategoryRating close', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={3}
        ratingCount={6}
        institutionCategoryRatings={validInstitutionCategoryRatings}
      />,
    );

    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(7);

    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(7);

    wrapper.unmount();
  });

  it('should only allow 1 open SchoolCategoryRating per group', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={3}
        ratingCount={6}
        institutionCategoryRatings={validInstitutionCategoryRatings}
      />,
    );

    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(7);

    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    wrapper
      .find('button')
      .at(1)
      .simulate('click');
    wrapper
      .find('button')
      .at(4)
      .simulate('click');
    wrapper
      .find('button')
      .at(5)
      .simulate('click');

    expect(wrapper.find('button[aria-expanded=true]').length).to.eq(2);
    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(5);

    wrapper.unmount();
  });
});
