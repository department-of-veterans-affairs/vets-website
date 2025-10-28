import { expect } from 'chai';

import formConfig from '../../../config/form';
import {
  employmentCheckFields,
} from '../../../definitions/constants';
import {
  shouldShowEmploymentSection,
  shouldShowUnemploymentSection,
} from '../../../utils/employment';

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
});
