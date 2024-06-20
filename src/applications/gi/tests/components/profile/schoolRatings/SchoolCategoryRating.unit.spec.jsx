import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SchoolCategoryRating from '../../../../components/profile/schoolRatings/SchoolCategoryRating';

describe('<SchoolCategoryRating />', () => {
  let wrapper;
  const mockTitleObj = {
    heading: 'Mathematics',
    rating: 4,
  };
  const mockQuestionsObj = {
    q1: 'What is the curriculum like?',
    q2: 'How qualified are the teachers?',
  };

  beforeEach(() => {
    wrapper = shallow(
      <SchoolCategoryRating
        titleObj={mockTitleObj}
        questionsObj={mockQuestionsObj}
      />,
    );
  });

  it('renders without crashing', () => {
    expect(wrapper).to.be.ok;
  });

  it('passes the correct title to the RatingsAccordion component', () => {
    const accordion = wrapper.find('RatingsAccordion');
    expect(accordion.prop('title')).to.equal(mockTitleObj.heading);
  });

  it('toggles the category on click', () => {
    const accordion = wrapper.find('RatingsAccordion');
    expect(accordion.prop('open')).to.equal(false);
    accordion.prop('openHandler')();
    wrapper.update();
    const updatedAccordion = wrapper.find('RatingsAccordion');
    expect(updatedAccordion.prop('open')).to.equal(true);

    updatedAccordion.prop('openHandler')();
    wrapper.update();
    const closedAccordion = wrapper.find('RatingsAccordion');
    expect(closedAccordion.prop('open')).to.equal(false);
  });

  it('renders the RatingsAccordion component', () => {
    expect(wrapper.find('RatingsAccordion').exists()).to.be.true;
  });
});
