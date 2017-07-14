import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import UserInfoSection from '../../../src/js/post-911-gib-status/components/UserInfoSection.jsx';

const props = {
  enrollmentData: {
    vaFileNumber: '12345678'
  }
};
const currentHeadingSelector = '#current-as-of';

describe('<UserInfoSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  describe('showCurrentAsOfAlert is falsey', () => {
    it('should omit the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, { showCurrentAsOfAlert: false });
      const tree = SkinDeep.shallowRender(<UserInfoSection {...currentAsOfProps}/>);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });

    it('should omit the "current as of" date', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
      expect(tree.subTree(currentHeadingSelector)).to.be.false;
    });
  });

  describe('showCurrentAsOfAlert is truthy', () => {
    it('should display the "current as of" date', () => {
      const currentAsOfProps = _.merge({}, props, { showCurrentAsOfAlert: true });
      const tree = SkinDeep.shallowRender(<UserInfoSection {...currentAsOfProps}/>);
      expect(tree.subTree(currentHeadingSelector)).to.not.be.false;
    });
  });

  describe('percentageBenefit is not provided', () => {
    // TODO: handle corrupt data department-of-veterans-affairs/vets.gov-team#3336
    it('should display "unavailable"', () => {
      const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
      const benefitLevel = tree.subTree('#benefit-level');
      expect(benefitLevel).to.not.be.false;
      expect(benefitLevel.text()).to.contain('unavailable');
    });
  });
});
