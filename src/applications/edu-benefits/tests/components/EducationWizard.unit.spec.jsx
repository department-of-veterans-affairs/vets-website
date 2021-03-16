import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import EducationWizard from '../../components/EducationWizard';

function getQuestion(tree, name) {
  return tree.find(name);
}

function answerQuestion(tree, name, value) {
  getQuestion(tree, name).simulate('change', { target: { value } });
}

describe('<EducationWizard>', () => {
  it('should show button and no questions', () => {
    const tree = mount(<EducationWizard />);

    expect(tree.find('button').length).to.eq(1);
    expect(tree.find('.wizard-content-closed').length).to.eq(1);
    tree.unmount();
  });
  it('should show button and first question', () => {
    const tree = mount(<EducationWizard />);
    tree.setState({ open: true });
    expect(tree.find('button').length).to.eq(1);
    expect(tree.find('RadioButtons').length).to.eq(1);
    tree.unmount();
  });
  it('should show own service question for new benefit', () => {
    const tree = mount(<EducationWizard />);

    tree.setState({ open: true });
    expect(getQuestion(tree, '#newBenefit-0').length).to.eq(1);
    answerQuestion(tree, '#newBenefit-0', 'yes');
    expect(getQuestion(tree, 'serviceBenefitBasedOn')).not.to.be.undefined;
    tree.unmount();
  });
  it('should show 1990 button', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-0', 'own');
    answerQuestion(tree, '#nationalCallToService-1', 'no');
    answerQuestion(tree, '#vetTecBenefit-1', 'no');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show 0994 button', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-0', 'own');
    answerQuestion(tree, '#nationalCallToService-1', 'no');
    answerQuestion(tree, '#vetTecBenefit-0', 'yes');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('0994'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show 10203 button', () => {
    const tree = mount(<EducationWizard />);
    answerQuestion(tree, '#newBenefit-2', 'extend');
    answerQuestion(tree, '#applyForScholarship-0', 'yes');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('10203'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show 5495 button', () => {
    const tree = mount(<EducationWizard />);
    answerQuestion(tree, '#newBenefit-1', 'no');
    answerQuestion(tree, '#transferredEduBenefits-2', 'fry');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('5495'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show 1990N button', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-0', 'own');
    answerQuestion(tree, '#nationalCallToService-0', 'yes');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990N'),
    ).to.be.true;
    expect(tree.find('.usa-alert-warning')).not.be.be.false;
    tree.unmount();
  });
  it('should show 5490 button', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-1', 'other');
    answerQuestion(tree, '#sponsorDeceasedDisabledMIA-0', 'yes');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('5490'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show 1990E button', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-1', 'other');
    answerQuestion(tree, '#sponsorDeceasedDisabledMIA-1', 'no');
    answerQuestion(tree, '#sponsorTransferredBenefits-0', 'yes');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990E'),
    ).to.be.true;
    tree.unmount();
  });
  it('should show transfer warning', () => {
    const tree = mount(<EducationWizard />);

    answerQuestion(tree, '#newBenefit-0', 'yes');
    answerQuestion(tree, '#serviceBenefitBasedOn-1', 'other');
    answerQuestion(tree, '#sponsorDeceasedDisabledMIA-1', 'no');
    answerQuestion(tree, '#sponsorTransferredBenefits-1', 'no');
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990E'),
    ).to.be.true;
    expect(tree.find('.usa-alert-warning')).not.be.be.false;
    tree.unmount();
  });
  it('should record user events for newBenefit', () => {
    const tree = mount(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, '#newBenefit-0', 'yes');
    expect(global.window.dataLayer.length).to.equal(1);
    expect(global.window.dataLayer[0].event).to.equal(
      'edu-howToApply-formChange',
    );
    expect(global.window.dataLayer[0]['edu-form-field']).to.equal(
      'benefitUpdate',
    );
    expect(global.window.dataLayer[0]['edu-form-value']).to.equal('new');
    answerQuestion(tree, '#newBenefit-1', 'no');
    expect(global.window.dataLayer.length).to.equal(2);
    expect(global.window.dataLayer[1].event).to.equal(
      'edu-howToApply-formChange',
    );
    expect(global.window.dataLayer[1]['edu-form-field']).to.equal(
      'benefitUpdate',
    );
    expect(global.window.dataLayer[1]['edu-form-value']).to.equal('update');
    tree.unmount();
  });

  it('should record user events for STEM section links', () => {
    const tree = mount(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, '#newBenefit-2', 'extend');
    expect(global.window.dataLayer.length).to.equal(1);
    const edithNourseLink = tree.find({
      href: '/education/other-va-education-benefits/stem-scholarship/',
    });
    const remainingBenefitsLink = tree.find({
      href: '/education/gi-bill/post-9-11/ch-33-benefit/',
    });
    const approvedBenefitsLink = tree.find({
      href: 'https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf',
    });
    edithNourseLink.simulate('click');
    expect(global.window.dataLayer.length).to.equal(2);
    expect(global.window.dataLayer[1].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[1]['edu-action']).to.equal(
      'stem-scholarship',
    );
    approvedBenefitsLink.simulate('click');
    expect(global.window.dataLayer.length).to.equal(3);
    expect(global.window.dataLayer[2].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[2]['edu-action']).to.equal(
      'see-approved-stem-programs',
    );
    remainingBenefitsLink.simulate('click');
    expect(global.window.dataLayer.length).to.equal(4);
    expect(global.window.dataLayer[1].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[3]['edu-action']).to.equal(
      'check-remaining-benefits',
    );
    tree.unmount();
  });

  it('should record user events on application submission', () => {
    const tree = mount(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, '#newBenefit-2', 'extend');
    expect(global.window.dataLayer.length).to.equal(1);

    answerQuestion(tree, '#applyForScholarship-0', 'yes');
    const applyNowLink = tree.find('#apply-now-link');
    applyNowLink.simulate('click');

    expect(global.window.dataLayer[1].event).to.equal(
      'edu-howToApply-applyNow',
    );
    expect(global.window.dataLayer[1]['edu-benefitUpdate']).to.equal(
      'stem-scholarship',
    );
    expect(global.window.dataLayer[1]['edu-isBenefitClaimForSelf']).to.equal(
      null,
    );
    expect(
      global.window.dataLayer[1]['edu-isNationalCallToServiceBenefit'],
    ).to.equal(null);
    expect(global.window.dataLayer[1]['edu-isVetTec']).to.equal(null);
    expect(
      global.window.dataLayer[1]['edu-hasSponsorTransferredBenefits'],
    ).to.equal(null);
    expect(
      global.window.dataLayer[1]['edu-isReceivingSponsorBenefits'],
    ).to.equal(null);
    expect(global.window.dataLayer[1]['edu-isSponsorReachable']).to.equal(null);
    expect(global.window.dataLayer[1]['edu-stemApplicant']).to.equal('yes');
    expect(global.window.dataLayer.length).to.equal(2);
    tree.unmount();
  });
});
