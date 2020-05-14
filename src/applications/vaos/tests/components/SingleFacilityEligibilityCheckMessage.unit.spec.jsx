import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import SingleFacilityEligibilityCheckMessage from '../../components/SingleFacilityEligibilityCheckMessage';

describe('VAOS <SingleFacilityEligibilityCheckMessage>', () => {
  it('should render past visit message', () => {
    const eligibility = {
      requestSupported: true,
      requestPastVisit: false,
      requestPastVisitValue: 24,
    };
    const facility = {
      address: [{}],
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
      requestSupported: true,
      requestPastVisit: true,
      requestLimit: false,
    };
    const facility = {
      address: [{}],
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
      requestSupported: true,
      requestPastVisit: true,
      requestLimit: true,
    };
    const facility = {
      address: [{}],
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('Something went wrong');
    expect(tree.find('AlertBox').props().status).to.equal('error');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render not supported message', () => {
    const eligibility = {
      requestSupported: false,
      requestPastVisit: true,
      requestLimit: true,
    };
    const facility = {
      address: [{}],
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('does not allow online');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render error message on request failure', () => {
    const eligibility = {
      requestFailed: true,
      requestSupported: true,
      requestPastVisit: false,
      requestPastVisitValue: 24,
    };
    const facility = {
      address: [{}],
    };

    const tree = mount(
      <SingleFacilityEligibilityCheckMessage
        facility={facility}
        eligibility={eligibility}
      />,
    );

    expect(tree.text()).to.contain('Something went wrong');
    expect(tree.find('AlertBox').props().status).to.equal('error');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
