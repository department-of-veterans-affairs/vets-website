import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import CustomPageReviewField from '../../components/CustomPageReviewField';

describe('CustomPageReviewField Component', () => {
  it('should render the correct header and description for selectCategory', () => {
    const name = 'selectCategory';
    const data = {
      selectCategory: 'Health',
    };
    const wrapper = mount(<CustomPageReviewField name={name} data={data} />);

    expect(wrapper.find('h5').text()).to.equal('Category and topic');
    expect(wrapper.find('dt').text()).to.equal('Category');
    expect(wrapper.find('dd').text()).to.equal('Health');

    wrapper.unmount();
  });

  it('should render the correct title and description for whoIsYourQuestionAbout', () => {
    const name = 'whoIsYourQuestionAbout';
    const data = {
      whoIsYourQuestionAbout: 'Myself',
    };
    const wrapper = mount(<CustomPageReviewField name={name} data={data} />);

    expect(wrapper.find('h5').text()).to.equal('Who your question is about');
    expect(wrapper.find('dt').text()).to.equal('Who is your question about?');
    expect(wrapper.find('dd').text()).to.equal('Myself');

    wrapper.unmount();
  });

  it('should handle boolean values and render "Yes" or "No"', () => {
    const name = 'relationshipToVeteran';
    const data = {
      relationshipToVeteran: true,
    };
    const wrapper = mount(<CustomPageReviewField name={name} data={data} />);

    expect(wrapper.find('dt').text()).to.equal(
      'Your relationship to the Veteran',
    );
    expect(wrapper.find('dd').text()).to.equal('Yes');

    wrapper.unmount();
  });

  it('should return null if description is undefined', () => {
    const name = 'selectCategory';
    const data = {};
    const wrapper = mount(<CustomPageReviewField name={name} data={data} />);

    expect(wrapper.html()).to.equal(null);

    wrapper.unmount();
  });

  it('should display "MISSING TITLE" if title is not found', () => {
    const name = 'unknownField';
    const data = {
      unknownField: 'Some value',
    };
    const wrapper = mount(<CustomPageReviewField name={name} data={data} />);

    expect(wrapper.find('dt').text()).to.equal('MISSING TITLE');
    expect(wrapper.find('dd').text()).to.equal('Some value');

    wrapper.unmount();
  });
});
