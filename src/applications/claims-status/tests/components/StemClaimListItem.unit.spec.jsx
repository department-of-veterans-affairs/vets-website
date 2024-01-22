import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import StemClaimListItem from '../../components/StemClaimListItem';

describe('<StemClaimListItem>', () => {
  const defaultClaim = {
    id: 1,
    attributes: {
      automatedDenial: true,
      deniedAt: '2021-03-02',
      submittedAt: '2021-03-01',
    },
  };

  it('should render a denied STEM claim', () => {
    const tree = shallow(<StemClaimListItem claim={defaultClaim} />);
    expect(tree.find('h2').length).to.equal(1);
    tree.unmount();
  });

  it('should not render a non-denied STEM claim', () => {
    const claim = {
      ...defaultClaim,
      attributes: {
        automatedDenial: false,
      },
    };

    const tree = shallow(<StemClaimListItem claim={claim} />);
    expect(tree.isEmptyRender()).to.be.true;
    tree.unmount();
  });

  it('should render updated on and submitted on with proper date', () => {
    const tree = shallow(<StemClaimListItem claim={defaultClaim} />);
    expect(tree.find('h2').text()).to.contain('updated on March 2, 2021');
    expect(
      tree
        .find('p')
        .last()
        .text(),
    ).to.equal('Received on: March 1, 2021');
    tree.unmount();
  });

  it('should show denied status', () => {
    const tree = shallow(<StemClaimListItem claim={defaultClaim} />);
    expect(
      tree
        .find('.status-circle + p')
        .first()
        .text(),
    ).to.equal('Status: Denied');
    tree.unmount();
  });

  it('should render a status circle with the `closed` class', () => {
    const tree = shallow(<StemClaimListItem claim={defaultClaim} />);
    const circle = tree.find('.status-circle').first();
    expect(circle.hasClass('open-claim')).to.be.false;
    expect(circle.hasClass('closed-claim')).to.be.true;
    tree.unmount();
  });
});
