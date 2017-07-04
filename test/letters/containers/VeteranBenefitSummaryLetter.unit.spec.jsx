import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import { VeteranBenefitSummaryLetter } from '../../../src/js/letters/containers/VeteranBenefitSummaryLetter';

const defaultProps = {
  benefitSummaryOptions: {
    benefitInfo: {
      awardEffectiveDate: '1965-01-01T05:00:00.000+00:00',
      hasAdaptedHousing: true,
      hasChapter35Eligibility: false
    },
    serviceInfo: [
      {
        branch: 'ARMY',
        characterOfService: 'UNCHARACTERIZED',
        enteredDate: '1965-01-01T05:00:00.000+00:00',
        releasedDate: '1972-10-01T04:00:00.000+00:00'
      }
    ]
  },
  optionsAvailable: true,
  optionsToInclude: {
  }
};

describe('<VeteranBenefitSummaryLetter>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should show benefit info options', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    expect(tree.subTree('hasAdaptedHousing')).to.exist;
  });

  it('should show service info options', () => {
    const tree = SkinDeep.shallowRender(<VeteranBenefitSummaryLetter {...defaultProps}/>);
    expect(tree.subTree('serviceInfoCheckboxId')).to.exist;
  });
});
