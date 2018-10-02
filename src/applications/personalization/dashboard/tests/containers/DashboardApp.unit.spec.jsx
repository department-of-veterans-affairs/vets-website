import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';

import localStorage from '../../../../../platform/utilities/storage/localStorage';
import { DashboardApp } from '../../containers/DashboardApp';

const defaultProps = {
  profile: {
    verified: false,
    loa: {
      current: 1,
    },
  },
};

describe('<DashboardApp>', () => {
  before(() => {
    sinon.stub(localStorage, 'getItem');
  });

  after(() => {
    localStorage.getItem.restore();
  });

  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DashboardApp {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.be.ok;
  });

  it('should render verification state if LOA != 3', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 1 } }} />,
    );
    expect(tree.toString()).to.contain('Verify your identity to access more');
    expect(tree.toString()).to.contain('tools and features');
  });

  it('should render MVI warning state if status not OK', () => {
    const tree = SkinDeep.shallowRender(
      <DashboardApp profile={{ loa: { current: 3 }, status: 'ERROR' }} />,
    );
    expect(tree.toString()).to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
  });

  it('should not render warnings if information available', () => {
    const props = {
      profile: {
        loa: {
          current: 3,
        },
        status: 'OK',
        verified: true,
      },
    };

    const tree = SkinDeep.shallowRender(<DashboardApp {...props} />);
    expect(tree.toString()).to.not.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
    expect(tree.toString()).to.not.contain(
      'Verify your identity to access more Vets.gov tools and features',
    );
  });
});
