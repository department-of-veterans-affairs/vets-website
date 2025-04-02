import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import CustomPersonalInformationReviewField from '../../components/CustomPersonalInformationReviewField';

describe('CustomPersonalInformationReviewField Component', () => {
  it('should render the correct header for aboutYourself', () => {
    const name = 'aboutYourself';
    const data = {
      aboutYourself: 'John Doe',
    };
    const wrapper = mount(
      <CustomPersonalInformationReviewField name={name} data={data} />,
    );

    expect(wrapper.find('h5').text()).to.equal('Your personal information');
    expect(wrapper.find('dt').text()).to.equal('MISSING TITLE');
    expect(wrapper.find('dd').text()).to.equal('John Doe');

    wrapper.unmount();
  });

  it('should render "MISSING TITLE" when no title is found', () => {
    const name = 'unknownField';
    const data = {
      unknownField: 'Some value',
    };
    const wrapper = mount(
      <CustomPersonalInformationReviewField name={name} data={data} />,
    );

    expect(wrapper.find('dt').text()).to.equal('MISSING TITLE');
    expect(wrapper.find('dd').text()).to.equal('Some value');

    wrapper.unmount();
  });

  it('should handle boolean values and render "Yes" or "No"', () => {
    const name = 'aboutYourself';
    const data = {
      aboutYourself: true,
    };
    const wrapper = mount(
      <CustomPersonalInformationReviewField name={name} data={data} />,
    );

    expect(wrapper.find('dd').text()).to.equal('Yes');

    wrapper.unmount();
  });

  it('should render the correct value when value is not a boolean', () => {
    const name = 'aboutYourself';
    const data = {
      aboutYourself: 'Jane Doe',
    };
    const wrapper = mount(
      <CustomPersonalInformationReviewField name={name} data={data} />,
    );

    expect(wrapper.find('dd').text()).to.equal('Jane Doe');

    wrapper.unmount();
  });
});
