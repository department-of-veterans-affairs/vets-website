import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SummaryOfDisabilitiesDescription } from '../../content/summaryOfDisabilities';

describe('summaryOfDisabilitiesDescription', () => {
  it('renders selected rated disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'Condition 1',
        },
        {
          'view:selected': true,
          name: 'Condition 2',
        },
      ],
    };

    const wrapper = shallow(
      <SummaryOfDisabilitiesDescription formData={formData} />,
    );

    expect(wrapper.find('li').length).to.equal(2);
    wrapper.unmount();
  });

  it('does not render unselected rated disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'Condition 1',
        },
        {
          'view:selected': false,
          name: 'Condition 2',
        },
      ],
    };

    const wrapper = shallow(
      <SummaryOfDisabilitiesDescription formData={formData} />,
    );

    expect(wrapper.find('li').length).to.equal(1);
    wrapper.unmount();
  });

  it('renders new disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        { condition: 'Condition 1' },
        { condition: 'Condition 2' },
        { condition: 'Condition 3' },
      ],
    };

    const wrapper = shallow(
      <SummaryOfDisabilitiesDescription formData={formData} />,
    );

    expect(wrapper.find('li').length).to.equal(3);
    wrapper.unmount();
  });

  it('renders both new disabilities and rated disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': true,
      },
      newDisabilities: [
        { condition: 'Condition 1' },
        { condition: 'Condition 2' },
      ],
      ratedDisabilities: [
        {
          'view:selected': false,
          name: 'Rated Disability 1',
        },
        {
          'view:selected': true,
          name: 'Rated Disability 2',
        },
      ],
    };

    const wrapper = shallow(
      <SummaryOfDisabilitiesDescription formData={formData} />,
    );

    expect(wrapper.find('li').length).to.equal(3);
    wrapper.unmount();
  });
});
