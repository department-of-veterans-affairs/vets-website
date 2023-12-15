import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import StemClaimListItemV3 from '../../components/StemClaimListItemV3';

describe('<StemClaimListItemV3>', () => {
  const defaultClaim = {
    id: 1,
    attributes: {
      automatedDenial: true,
      deniedAt: '2021-03-02',
      submittedAt: '2021-03-01',
    },
  };

  it('should render a denied STEM claim', () => {
    const tree = shallow(<StemClaimListItemV3 claim={defaultClaim} />);
    expect(tree.find('ClaimCard').length).to.equal(1);
    tree.unmount();
  });

  it('should not render a non-denied STEM claim', () => {
    const claim = {
      ...defaultClaim,
      attributes: {
        automatedDenial: false,
      },
    };

    const tree = shallow(<StemClaimListItemV3 claim={claim} />);
    expect(tree.isEmptyRender()).to.be.true;
    tree.unmount();
  });

  it('should render updated on and submitted on with proper date', () => {
    const wrapper = shallow(<StemClaimListItemV3 claim={defaultClaim} />);
    expect(
      wrapper
        .find('ClaimCard')
        .shallow()
        .find('.submitted-on')
        .text(),
    ).to.equal('Submitted on March 1, 2021');
    wrapper.unmount();
  });

  it('should show denied status', () => {
    const tree = shallow(<StemClaimListItemV3 claim={defaultClaim} />);
    expect(
      tree
        .find('.card-status p')
        .first()
        .text(),
    ).to.equal('Status: Denied');
    tree.unmount();
  });
});
