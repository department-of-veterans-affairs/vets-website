import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import formConfig from '../../../config/form';
import {
  employmentCheckFields,
} from '../../../definitions/constants';
import {
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../../../utils/employment';

const proxyquireNoCache = proxyquire.noCallThru().noPreserveCache();

describe('21-4140 config/form', () => {
  it('registers the expected additional onboarding routes', () => {
    const routePaths = formConfig.additionalRoutes.map(route => route.path);

    expect(routePaths).to.include.members([
      'form-verification',
      'required-information',
      'before-you-begin',
      'what-you-need',
    ]);
  });

  it('wraps each Section 2 page with the employment visibility guard', () => {
    const { pages } = formConfig.chapters.employmentInformation;
    const guard = pages.employersIntro.depends;

    expect(guard({})).to.be.false;

    const formData = {
      [employmentCheckFields.parentObject]: {
        [employmentCheckFields.hasEmploymentInLast12Months]: 'yes',
      },
    };

    expect(guard(formData)).to.be.true;
    expect(pages.sectionTwoSignature.depends).to.equal(
      shouldShowEmploymentSection,
    );
  });

  it('uses the unemployment visibility guard for Section 3 pages', () => {
    const { pages } = formConfig.chapters.unemploymentCertification;

    expect(pages.sectionThreeIntro.depends).to.equal(
      shouldShowUnemploymentSection,
    );
    expect(pages.sectionThreeSignature.depends).to.equal(
      shouldShowUnemploymentSection,
    );
  });

  it('keeps onboarding routes always available', () => {
    formConfig.additionalRoutes.forEach(route => {
      expect(route.depends()).to.be.true;
    });
  });

  it('preserves existing page-specific depends logic in Section 2', () => {
    const originalDepends = sinon.stub().returns('original-result');
    const employmentGuardStub = sinon.stub().returns(true);
    const unemploymentGuardStub = sinon.stub().returns(true);

    const { default: configWithStubbedSectionTwo } = proxyquireNoCache(
      '../../../config/form',
      {
        '../pages/sectionTwo': {
          default: {
            testPage: {
              title: 'Test Page',
              uiSchema: {},
              schema: {},
              depends: originalDepends,
            },
          },
        },
        '../utils/employment': {
          shouldShowEmploymentSection: employmentGuardStub,
          shouldShowUnemploymentSection: unemploymentGuardStub,
        },
        '../manifest.json': { rootUrl: '/test-root' },
        'platform/utilities/environment': { API_URL: 'https://example.test' },
        'platform/forms/components/FormFooter': () => null,
        'platform/monitoring/DowntimeNotification': {
          externalServices: { lighthouseBenefitsIntake: 'lighthouse' },
        },
        '../containers/IntroductionPage': () => null,
        '../containers/PreSectionOnePage': () => null,
        '../containers/RequiredInformationPage': () => null,
        '../containers/BeforeYouBeginPage': () => null,
        '../containers/WhatYouNeedPage': () => null,
        '../containers/SectionOnePage': () => null,
        '../containers/EmploymentCheckPage': () => null,
        '../containers/EmploymentCheckReview': () => null,
        '../containers/SectionThreePage': () => null,
        '../containers/ConfirmationPage': () => null,
        '../../shared/components/GetFormHelp': () => null,
        './submit-transformer': () => null,
        '../pages/personalInformation1': { uiSchema: {}, schema: {} },
        '../pages/contactInformation1': { uiSchema: {}, schema: {} },
        '../pages/sectionTwoSignature': { uiSchema: {}, schema: {} },
        '../pages/sectionThreeSignature': { uiSchema: {}, schema: {} },
      },
    );

    const guard =
      configWithStubbedSectionTwo.chapters.employmentInformation.pages
        .testPage.depends;
    const formData = { mock: true };
    const result = guard(formData);

    expect(employmentGuardStub.calledOnceWithExactly(formData)).to.be.true;
    expect(originalDepends.calledOnceWithExactly(formData)).to.be.true;
    expect(result).to.equal('original-result');
  });
});
