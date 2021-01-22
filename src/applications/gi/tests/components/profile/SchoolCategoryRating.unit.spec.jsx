import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SchoolCategoryRating from '../../../components/profile/SchoolCategoryRating';
import sinon from 'sinon';

describe('<SchoolCategoryRating>', () => {
  const categoryRating = {
    categoryName: 'overall_experience',
    averageRating: 2.75,
    totalCount: 8,
    rated5Count: 0,
    rated4Count: 2,
    rated3Count: 2,
    rated2Count: 4,
    rated1Count: 0,
    naCount: 0,
  };
  it('should render', () => {
    const wrapper = shallow(
      <SchoolCategoryRating categoryRating={categoryRating} open={false} />,
    );
    expect(wrapper.find('.category-rating').length).to.eq(1);
    expect(wrapper.find('button[aria-expanded=false]').length).to.eq(1);
    expect(wrapper.find('.na-count-display').length).to.eq(0);
    wrapper.unmount();
  });
  it('should render correctly when open', () => {
    const wrapper = shallow(
      <SchoolCategoryRating
        categoryRating={categoryRating}
        open
        description={'Test description'}
      />,
    );
    expect(wrapper.find('button[aria-expanded=true]').length).to.eq(1);
    expect(wrapper.find('.category-rating-count').length).to.eq(5);
    expect(wrapper.html().includes('Test description')).to.eq(true);
    wrapper.unmount();
  });
  it('should render correctly without rating', () => {
    const wrapper = shallow(
      <SchoolCategoryRating
        categoryRating={{ ...categoryRating, averageRating: null }}
        open
        description={'Test description'}
      />,
    );
    expect(wrapper.find('button[aria-expanded=true]').length).to.eq(1);
    expect(wrapper.find('.category-rating-count').length).to.eq(5);
    expect(wrapper.html().includes('Not yet rated')).to.eq(true);
    wrapper.unmount();
  });
  it('should render counts correctly', () => {
    const wrapper = shallow(
      <SchoolCategoryRating
        categoryRating={{ ...categoryRating, naCount: 3 }}
        open
        description={'Test description'}
      />,
    );
    expect(
      wrapper
        .find('.category-rating-count .count-value')
        .at(0)
        .text(),
    ).to.eq('(0 users)');
    expect(
      wrapper
        .find('.category-rating-count .count-value')
        .at(1)
        .text(),
    ).to.eq('(2 users)');
    expect(
      wrapper
        .find('.category-rating-count .count-value')
        .at(2)
        .text(),
    ).to.eq('(2 users)');
    expect(
      wrapper
        .find('.category-rating-count .count-value')
        .at(3)
        .text(),
    ).to.eq('(4 users)');
    expect(
      wrapper
        .find('.category-rating-count .count-value')
        .at(4)
        .text(),
    ).to.eq('(0 users)');
    expect(wrapper.find('.na-count-display').length).to.eq(1);
    expect(wrapper.find('.na-count-display').text()).to.eq(
      '3 users didn’t rate this category',
    );
    wrapper.unmount();
  });
  it('passes categoryName to openHandler', () => {
    const openHandler = sinon.spy();
    const wrapper = shallow(
      <SchoolCategoryRating
        categoryRating={categoryRating}
        openHandler={openHandler}
        open
        description={'Test description'}
      />,
    );
    wrapper
      .find('button')
      .first()
      .simulate('click');
    expect(openHandler.calledWith('overall_experience')).to.be.true;
    wrapper.unmount();
  });
});
