import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { HowToApplyPost911GiBill } from '../../../components/HowToApplyPost911GiBill';

describe('HowToApplyPost911GiBill – SaveInProgressIntro visibility', () => {
  const defaultProps = {
    route: { pageList: [], formConfig: { prefillEnabled: true } },
    showTextUpdate: false,
    formId: '22-1990',
    isClaimantCallComplete: true,
    isLOA3: true,
    isLoggedIn: true,
    savedForms: [],
    user: {},
  };

  const render = overrides =>
    shallow(<HowToApplyPost911GiBill {...defaultProps} {...overrides} />);

  it('shows SaveInProgressIntro when all conditions are met', () => {
    const wrapper = render();
    expect(wrapper.find(SaveInProgressIntro)).to.have.lengthOf(1);
  });

  ['isLoggedIn', 'isLOA3', 'isClaimantCallComplete'].forEach(flag => {
    it(`hides SaveInProgressIntro when ${flag} is false`, () => {
      const wrapper = render({ [flag]: false });
      expect(wrapper.find(SaveInProgressIntro)).to.have.lengthOf(0);
    });
  });

  it('hides SaveInProgressIntro when there is a saved form', () => {
    const wrapper = render({ savedForms: [{ form: '22-1990' }] });
    expect(wrapper.find(SaveInProgressIntro)).to.have.lengthOf(0);
  });
});

describe('HowToApplyPost911GiBill', () => {
  const defaultProps = {
    route: { pageList: [], formConfig: { prefillEnabled: true } },
    formId: '22-1990',
    isClaimantCallComplete: true,
    isLOA3: true,
    isLoggedIn: false,
    savedForms: [],
    user: {},
  };

  const render = overrides =>
    shallow(<HowToApplyPost911GiBill {...defaultProps} {...overrides} />);

  it('displays the content', () => {
    const wrapper = render();
    const text = wrapper.text();

    expect(text).to.include(
      'Use VA Form 22-1990 if you want to apply for education benefits for the first time or make changes to an existing benefit.',
    );
    expect(text).to.include(
      'For first time applicants, use the VA Form 22-1990 to apply for the following programs:',
    );
    expect(text).to.include(
      'If you have applied for benefits before, use the VA Form 22-1990 for these actions:',
    );
    expect(text).to.include(
      'Update your current benefit and get an updated Certificate of Eligibility (COE)',
    );
    expect(text).to.include(
      'Switch your existing education benefit and get a new COE',
    );
  });
});
