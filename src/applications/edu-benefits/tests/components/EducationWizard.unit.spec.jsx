import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

// import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import configureMockStore from 'redux-mock-store';

import EducationWizard from '../../components/EducationWizard';

const mockStore = configureMockStore();
const store = mockStore({});

function getQuestion(tree, name) {
  return tree.find(name).last();
}

function answerQuestion(tree, name, value) {
  getQuestion(tree, name).simulate('change', { target: { value } });
}

describe('<EducationWizard>', () => {
  it('should show button and no questions', () => {
    const tree = mount(<EducationWizard store={store} />);
    expect(tree.find('va-button').length).to.eq(1);
    expect(tree.find('.wizard-content-closed').length).to.eq(1);
    tree.unmount();
  });
  it('should show button and first question', async () => {
    const tree = mount(
      <EducationWizard store={store} levels={['newBenefit']} />,
    );
    expect(tree.find('va-button').length).to.eq(1);
    expect(tree.find('va-radio').length).to.eq(1);
    tree.unmount();
  });
  it('should show own service question for new benefit', () => {
    const tree = mount(<EducationWizard store={store} />);
    expect(getQuestion(tree, '#newBenefit_yes').length).to.eq(1);
    answerQuestion(tree, '#newBenefit_yes', 'yes');
    expect(getQuestion(tree, 'serviceBenefitBasedOn')).not.to.be.undefined;
    tree.unmount();
  });

  it('should show 1990 button', () => {
    const myStore = mockStore({
      showEduBenefits1990EZWizard: true,
    });
    const testLevels = {
      newBenefit: 'yes',
      serviceBenefitBasedOn: 'own',
      vetTecBenefit: 'no',
      post911GIBill: 'no',
    };
    const tree = mount(
      <EducationWizard store={myStore} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show 0994 button', () => {
    const myStore = mockStore({
      showEduBenefits1990EZWizard: true,
    });
    const testLevels = {
      newBenefit: 'yes',
      serviceBenefitBasedOn: 'own',
      vetTecBenefit: 'yes',
    };
    const tree = mount(
      <EducationWizard store={myStore} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('0994'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show 10203 button', () => {
    const myStore = mockStore({
      showEduBenefits1990EZWizard: true,
    });
    const testLevels = {
      newBenefit: 'extend',
      applyForScholarship: 'yes',
    };
    const tree = mount(
      <EducationWizard store={myStore} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('10203'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show 5495 button', () => {
    const myStore = mockStore({
      showEduBenefits1990EZWizard: true,
    });
    const testLevels = {
      newBenefit: 'no',
      transferredEduBenefits: 'fry',
    };
    const tree = mount(
      <EducationWizard store={myStore} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('5495'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show 1990E button', () => {
    const myStore = mockStore({
      showEduBenefits1990EZWizard: true,
    });
    const testLevels = {
      newBenefit: 'yes',
      serviceBenefitBasedOn: 'other',
      sponsorTransferredBenefits: 'yes',
    };

    const tree = mount(
      <EducationWizard store={myStore} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('1990E'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show 5490 button', () => {
    const testLevels = {
      newBenefit: 'yes',
      serviceBenefitBasedOn: 'other',
      sponsorTransferredBenefits: 'no',
      sponsorDeceasedDisabledMIA: 'yes',
    };
    const tree = mount(
      <EducationWizard store={store} test testLevels={testLevels} />,
    );
    expect(
      tree
        .find('#apply-now-link')
        .prop('href')
        .endsWith('5490'),
    ).to.be.true;
    tree.unmount();
  });

  it('should show transfer warning', () => {
    const testLevels = {
      newBenefit: 'yes',
      serviceBenefitBasedOn: 'other',
      sponsorTransferredBenefits: 'no',
      sponsorDeceasedDisabledMIA: 'no',
    };
    const tree = mount(
      <EducationWizard store={store} test testLevels={testLevels} />,
    );
    expect(tree.find('.usa-alert-warning')).not.be.be.false;
    tree.unmount();
  });
});
