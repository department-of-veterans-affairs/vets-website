import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import SingleFacilityEligibilityCheckMessage from '../../components/SingleFacilityEligibilityCheckMessage';

describe('VAOS <EligibilityCheckMessage>', () => {
  it('should render past visit message', () => {
    const eligibility = {
      requestPastVisit: false,
      requestPastVisitValue: 24,
    };
    const facility = {
      institution: {},
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('seen within the past 24 months');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render limit message', () => {
    const eligibility = {
      requestPastVisit: true,
      requestLimit: false,
    };
    const facility = {
      institution: {},
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('more outstanding requests');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render generic message', () => {
    const eligibility = {
      requestPastVisit: true,
      requestLimit: true,
    };
    const facility = {
      institution: {},
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('trouble verifying');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
