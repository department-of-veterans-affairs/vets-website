import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from '../../../config/helpers';
import { flowPages } from '../../../config/schema-helpers/formFlowHelper';
import {
  CategoryDebt,
  TopicEducationBenefitOverpayments,
  schoolInYourProfileOptions,
  yourRoleOptionsEducation,
} from '../../../constants';

describe('flowPages', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(helpers, 'generalQuestionCondition')
      .callsFake(formData => formData?.isGeneralQuestion || false);
    sandbox
      .stub(helpers, 'aboutMyselfRelationshipVeteranCondition')
      .callsFake(formData => formData?.isVeteran || false);
    sandbox
      .stub(helpers, 'aboutMyselfRelationshipFamilyMemberCondition')
      .callsFake(formData => formData?.isFamilyMember || false);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const testPages = {
    page1: {
      title: 'Page 1',
    },
    page2: {
      title: 'Page 2',
      depends: formData => formData?.showPage2 || false,
    },
  };

  const testList = ['page1', 'page2'];
  const testPath = 'test-path';

  it('clones pages and adds to flow group', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page1_testpath).to.deep.include({
      title: 'Page 1',
    });
    expect(result.page2_testpath).to.deep.include({
      title: 'Page 2',
    });
  });

  it('sets path correctly', () => {
    const result = flowPages(testPages, testList, testPath);
    expect(result.page1_testpath.path).to.equal('test-path-1');
    expect(result.page2_testpath.path).to.equal('test-path-2');
  });

  it('preserves existing depends function', () => {
    const result = flowPages(testPages, testList, testPath);
    const formData = { showPage2: true };
    expect(result.page2_testpath.depends(formData)).to.be.true;

    formData.showPage2 = false;
    expect(result.page2_testpath.depends(formData)).to.be.false;
  });

  it('adds condition from conditionMap when path matches', () => {
    const result = flowPages(testPages, testList, 'general-question');
    const formData = { isGeneralQuestion: true };
    expect(result.page1_generalquestion.depends(formData)).to.be.true;

    formData.isGeneralQuestion = false;
    expect(result.page1_generalquestion.depends(formData)).to.be.false;
  });

  it('combines existing depends with condition from map', () => {
    const result = flowPages(testPages, testList, 'general-question');
    const formData = { showPage2: true, isGeneralQuestion: true };
    expect(result.page2_generalquestion.depends(formData)).to.be.true;

    formData.showPage2 = false;
    expect(result.page2_generalquestion.depends(formData)).to.be.false;

    formData.showPage2 = true;
    formData.isGeneralQuestion = false;
    expect(result.page2_generalquestion.depends(formData)).to.be.false;
  });

  it('handles complex searchSchools depends logic', () => {
    const pages = {
      searchschools: {
        title: 'Search Schools',
        depends: formData =>
          ((!formData.school ||
            !formData.schoolInfo?.schoolName ||
            formData.useSchoolInProfile === schoolInYourProfileOptions.NO) &&
            (formData.selectCategory === CategoryDebt &&
              formData.selectTopic === TopicEducationBenefitOverpayments)) ||
          ((formData.useSchoolInProfile === schoolInYourProfileOptions.NO ||
            !formData.schoolInfo?.schoolName) &&
            (formData.yourRole === yourRoleOptionsEducation.SCO ||
              formData.yourRole ===
                yourRoleOptionsEducation.TRAINING_OR_APPRENTICESHIP_SUP)),
      },
    };

    const result = flowPages(pages, ['searchschools'], 'general-question');

    // Test debt category path
    expect(
      result.searchschools_generalquestion.depends({
        selectCategory: CategoryDebt,
        selectTopic: TopicEducationBenefitOverpayments,
        useSchoolInProfile: schoolInYourProfileOptions.NO,
        isGeneralQuestion: true,
      }),
    ).to.be.true;

    // Test education role path with no school info
    expect(
      result.searchschools_generalquestion.depends({
        yourRole: yourRoleOptionsEducation.SCO,
        useSchoolInProfile: schoolInYourProfileOptions.NO,
        isGeneralQuestion: true,
      }),
    ).to.be.true;

    // Test case where neither condition is met
    expect(
      result.searchschools_generalquestion.depends({
        selectCategory: 'Other',
        yourRole: 'Other',
        isGeneralQuestion: true,
      }),
    ).to.be.false;
  });

  it('handles aboutYourself depends logic with all combinations', () => {
    const pages = {
      aboutyourself: {
        title: 'About Yourself',
        depends: formData => !formData.hasPrefillInformation,
      },
    };

    const result = flowPages(pages, ['aboutyourself'], 'general-question');

    // Test with no data
    expect(
      result.aboutyourself_generalquestion.depends({
        isGeneralQuestion: true,
      }),
    ).to.be.true;

    // Test with complete data
    expect(
      result.aboutyourself_generalquestion.depends({
        aboutYourself: {
          first: 'John',
          last: 'Doe',
          dateOfBirth: '1990-01-01',
        },
        hasPrefillInformation: true,
        isGeneralQuestion: true,
      }),
    ).to.be.false;
  });

  it('handles null and undefined values in depends functions', () => {
    const pages = {
      page1: {
        title: 'Page 1',
        depends: formData => formData?.a?.b?.c === true,
      },
    };

    const result = flowPages(pages, ['page1'], 'general-question');
    const { depends } = result.page1_generalquestion;

    // Test deep null/undefined handling
    expect(depends(null)).to.be.false;
    expect(depends(undefined)).to.be.false;
    expect(depends({})).to.be.false;
    expect(depends({ a: null })).to.be.false;
    expect(depends({ a: { b: null } })).to.be.false;
    expect(depends({ a: { b: { c: false } } })).to.be.false;
    expect(
      depends({
        a: { b: { c: true } },
        isGeneralQuestion: true,
      }),
    ).to.be.true;
  });
});
