import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SchoolRatings from '../../../components/profile/schoolRatings/SchoolRatings';

describe('<SchoolRatings>', () => {
  const headers = {
    h1: 'Learning Experience',
    h2: 'GI Bill Support',
    h3: 'Veteran Community',
    h4: 'Overall Experience',
  };

  const questions = {
    q1: 'Instructor knowledge',
    q2: 'Instructor engagement',
    q3: 'Course material support',
    q4: 'Successful learning experience',
    q5: 'Contribution career learning experience',
    q6: 'Support of school officials',
    q7: 'Availability of school officials',
    q8: 'Timely completion of VA documents',
    q9: 'Helpfulness of school',
    q10: 'Extent support school',
    q11: 'Extent support others',
    q12: 'Overall learning experience',
    q13: 'Overall school experience',
  };

  const institutionRating = {
    id: 21,
    institutionId: 381725,
    institutionRatingCount: 6,
    m1Avg: '2.9',
    m2Avg: '2.4',
    m3Avg: '3.3',
    m4Avg: '1.2',
    overallAvg: '2.6',
    q1Avg: '3.5',
    q1Count: 6,
    q2Avg: '2.7',
    q2Count: 6,
    q3Avg: '2.8',
    q3Count: 6,
    q4Avg: '2.8',
    q4Count: 6,
    q5Avg: '2.8',
    q5Count: 6,
    q7Avg: '0.0',
    q7Count: 0,
    q8Avg: '0.0',
    q8Count: 0,
    q9Avg: '2.8',
    q9Count: 6,
    q10Avg: '2.0',
    q10Count: 6,
    q11Avg: '2.8',
    q11Count: 6,
    q12Avg: '3.7',
    q12Count: 6,
    q13Avg: '1.2',
    q13Count: 6,
    q14Avg: '1.2',
    q14Count: 6,
  };

  it('should render', () => {
    const wrapper = shallow(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it(`Should contain 4 accordion components with the headers
    Learning Experience, GI Bill Support, Veteran Community, and Overall Experience`, () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    const text = wrapper.text();
    expect(text).to.include(headers.h1);
    expect(text).to.include(headers.h2);
    expect(text).to.include(headers.h3);
    expect(text).to.include(headers.h4);
    wrapper.unmount();
  });

  it('Should contain all 13 questions within accordion components', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    const text = wrapper.text();
    expect(text).to.include(questions.q1);
    expect(text).to.include(questions.q2);
    expect(text).to.include(questions.q3);
    expect(text).to.include(questions.q4);
    expect(text).to.include(questions.q5);
    expect(text).to.include(questions.q6);
    expect(text).to.include(questions.q7);
    expect(text).to.include(questions.q8);
    expect(text).to.include(questions.q9);
    expect(text).to.include(questions.q10);
    expect(text).to.include(questions.q11);
    expect(text).to.include(questions.q12);
    expect(text).to.include(questions.q13);
    wrapper.unmount();
  });

  it('Should display overall averge and count for institution', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    const text = wrapper.text();
    expect(text).to.include(institutionRating.institutionRatingCount);
    expect(text).to.include(institutionRating.overallAvg);
    wrapper.unmount();
  });

  it('Should display average rating for each header', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    const text = wrapper.text();
    expect(text).to.include(institutionRating.m1Avg);
    expect(text).to.include(institutionRating.m2Avg);
    expect(text).to.include(institutionRating.m3Avg);
    expect(text).to.include(institutionRating.m4Avg);
    wrapper.unmount();
  });

  it('Should display average rating for each question', () => {
    const wrapper = mount(
      <SchoolRatings
        ratingAverage={institutionRating.overallAvg}
        ratingCount={institutionRating.institutionRatingCount}
        institutionCategoryRatings={institutionRating}
      />,
    );
    const text = wrapper.text();
    expect(text).to.include(`${institutionRating.q1Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q2Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q3Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q4Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q5Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q7Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q8Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q9Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q10Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q11Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q12Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q13Avg} / 4.0`);
    expect(text).to.include(`${institutionRating.q14Avg} / 4.0`);
    wrapper.unmount();
  });
});
