import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import UserInfoSection from '../../../src/js/post-911-gib-status/components/UserInfoSection.jsx';

const props = {
  enrollmentData: {
  }
};
const currentHeadingSelector = '#up-to-date-header';

describe('<UserInfoSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  describe('props.showCurrentAsOfAlert=false', () => {
    it('should omit the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, { showCurrentAsOfAlert: false });
      const tree = SkinDeep.shallowRender(<UserInfoSection {...currentAsOfProps}/>);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });
  });

  describe('props.showCurrentAsOfAlert=null', () => {
    it('should omit the "current as of" date', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });
  });

  describe('props.showCurrentAsOfAlert=true', () => {
    it('should display the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, { showCurrentAsOfAlert: true });
      const tree = SkinDeep.shallowRender(<UserInfoSection {...currentAsOfProps}/>);
      expect(tree.subTree(currentHeadingSelector)).to.not.be.false;
    });
  });

  describe('props.percentageBenefit=null', () => {
    it('should display "unavilable"', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.not.be.false;
      expect(benefitLevel.text()).to.contain('unavailable');
    });
  });
});
