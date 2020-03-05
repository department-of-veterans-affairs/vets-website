import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EducationWizard from '../../components/EducationWizard';

function getQuestion(tree, name) {
  return tree
    .everySubTree('ErrorableRadioButtons')
    .find(i => i.props.name === name);
}

function answerQuestion(tree, name, value) {
  getQuestion(tree, name).props.onValueChange({ value });
}

describe('<EducationWizard>', () => {
  it('should show button and no questions', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions').props.className).to.contain(
      'wizard-content-closed',
    );
  });
  it('should show button and first question', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    tree.getMountedInstance().setState({ open: true });
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions').props.className).not.to.contain(
      'wizard-content-closed',
    );
    expect(tree.everySubTree('ErrorableRadioButtons')).not.to.be.empty;
  });
  it('should show own service question for new benefit', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    tree.getMountedInstance().setState({ open: true });
    expect(getQuestion(tree, 'newBenefit')).not.to.be.undefined;
    answerQuestion(tree, 'newBenefit', 'yes');
    expect(getQuestion(tree, 'serviceBenefitBasedOn')).not.to.be.undefined;
  });
  it('should show 1990 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'own');
    answerQuestion(tree, 'nationalCallToService', 'no');
    answerQuestion(tree, 'vetTecBenefit', 'no');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1990')).to.be
      .true;
  });
  it('should show 0994 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'own');
    answerQuestion(tree, 'nationalCallToService', 'no');
    answerQuestion(tree, 'vetTecBenefit', 'yes');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('0994')).to.be
      .true;
  });
  it('should show 1995 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);
    answerQuestion(tree, 'newBenefit', 'extend');
    answerQuestion(tree, 'applyForScholarship', 'yes');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1995')).to.be
      .true;
  });
  it('should show 1995 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'no');
    answerQuestion(tree, 'transferredEduBenefits', 'own');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1995')).to.be
      .true;
  });
  it('should show 5495 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'no');
    answerQuestion(tree, 'transferredEduBenefits', 'fry');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('5495')).to.be
      .true;
  });
  it('should show 1990N button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'own');
    answerQuestion(tree, 'nationalCallToService', 'yes');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1990N')).to.be
      .true;
    expect(tree.subTree('.usa-alert-warning')).not.be.be.false;
  });
  it('should show 5490 button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'other');
    answerQuestion(tree, 'sponsorDeceasedDisabledMIA', 'yes');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('5490')).to.be
      .true;
  });
  it('should show 1990E button', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'other');
    answerQuestion(tree, 'sponsorDeceasedDisabledMIA', 'no');
    answerQuestion(tree, 'sponsorTransferredBenefits', 'yes');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1990E')).to.be
      .true;
  });
  it('should show transfer warning', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);

    answerQuestion(tree, 'newBenefit', 'yes');
    answerQuestion(tree, 'serviceBenefitBasedOn', 'other');
    answerQuestion(tree, 'sponsorDeceasedDisabledMIA', 'no');
    answerQuestion(tree, 'sponsorTransferredBenefits', 'no');
    expect(tree.subTree('#apply-now-link').props.href.endsWith('1990E')).to.be
      .true;
    expect(tree.subTree('.usa-alert-warning')).not.be.be.false;
  });
  it('should record user events for newBenefit', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, 'newBenefit', 'yes');
    expect(global.window.dataLayer.length).to.equal(1);
    expect(global.window.dataLayer[0].event).to.equal(
      'edu-howToApply-formChange',
    );
    expect(global.window.dataLayer[0]['edu-form-field']).to.equal(
      'benefitUpdate',
    );
    expect(global.window.dataLayer[0]['edu-form-value']).to.equal('new');
    answerQuestion(tree, 'newBenefit', 'no');
    expect(global.window.dataLayer.length).to.equal(2);
    expect(global.window.dataLayer[1].event).to.equal(
      'edu-howToApply-formChange',
    );
    expect(global.window.dataLayer[1]['edu-form-field']).to.equal(
      'benefitUpdate',
    );
    expect(global.window.dataLayer[1]['edu-form-value']).to.equal('update');
  });

  it('should record user events for STEM section links', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, 'newBenefit', 'extend');
    expect(global.window.dataLayer.length).to.equal(1);
    const edithNourseLink = tree.subTree('a', {
      href: 'https://benefits.va.gov/gibill/fgib/stem.asp',
    });
    const remainingBenefitsLink = tree.subTree('a', {
      href: '../gi-bill/post-9-11/ch-33-benefit/',
    });
    const approvedBenefitsLink = tree.subTree('a', {
      href: 'https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf',
    });

    edithNourseLink.props.onClick();
    expect(global.window.dataLayer.length).to.equal(2);
    expect(global.window.dataLayer[1].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[1]['edu-action']).to.equal(
      'stem-scholarship',
    );

    remainingBenefitsLink.props.onClick();
    expect(global.window.dataLayer.length).to.equal(3);
    expect(global.window.dataLayer.length).to.equal(3);
    expect(global.window.dataLayer[2].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[2]['edu-action']).to.equal(
      'check-remaining-benefits',
    );

    approvedBenefitsLink.props.onClick();
    expect(global.window.dataLayer.length).to.equal(4);
    expect(global.window.dataLayer[3].event).to.equal('edu-navigation');
    expect(global.window.dataLayer[3]['edu-action']).to.equal(
      'see-approved-stem-programs',
    );
  });

  it('should record user events on application submission', () => {
    const tree = SkinDeep.shallowRender(<EducationWizard />);
    expect(global.window.dataLayer.length).to.equal(0);
    answerQuestion(tree, 'newBenefit', 'extend');
    expect(global.window.dataLayer.length).to.equal(1);

    answerQuestion(tree, 'applyForScholarship', 'yes');
    const applyNowLink = tree.subTree('#apply-now-link');
    applyNowLink.props.onClick();

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
  });
});
