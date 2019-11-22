import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import EligibilityCheckMessage from '../../components/EligibilityCheckMessage';

describe('VAOS <EligibilityCheckMessage>', () => {
  it('should render past visit message', () => {
    const eligibility = {
      requestPastVisit: false,
      requestPastVisitValue: 24,
    };

    const tree = mount(<EligibilityCheckMessage eligibility={eligibility} />);

    expect(tree.text()).to.contain('seen within the past 24 months');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render limit message', () => {
    const eligibility = {
      requestPastVisit: true,
      requestLimit: false,
    };

    const tree = mount(<EligibilityCheckMessage eligibility={eligibility} />);

    expect(tree.text()).to.contain('more outstanding requests');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should render generic message', () => {
    const eligibility = {
      requestPastVisit: true,
      requestLimit: true,
    };

    const tree = mount(<EligibilityCheckMessage eligibility={eligibility} />);

    expect(tree.text()).to.contain('trouble verifying');
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
