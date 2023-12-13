import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import { SummaryOfDisabilitiesDescription } from '../../content/summaryOfDisabilities';
import { NULL_CONDITION_STRING } from '../../constants';

describe('summaryOfDisabilitiesDescription', () => {
  it('renders selected rated disabilities', () => {
    const formData = {
      newDisabilities: [],
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'condition 1',
        },
        {
          'view:selected': true,
          name: undefined,
        },
      ],
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));
    tree.getByText('Condition 1');
    tree.getByText(NULL_CONDITION_STRING);
  });

  it('does not render unselected rated disabilities', () => {
    const formData = {
      newDisabilities: [],
      ratedDisabilities: [
        {
          'view:selected': true,
          name: 'condition 1',
        },
        {
          'view:selected': false,
          name: 'condition 2',
        },
      ],
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
    };

    const tree = render(SummaryOfDisabilitiesDescription({ formData }));

    tree.getByText('Condition 1');
    expect(tree.queryByText('Condition 2')).to.be.null;
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
