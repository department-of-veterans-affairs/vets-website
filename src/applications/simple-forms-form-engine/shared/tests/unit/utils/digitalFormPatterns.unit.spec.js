import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import { camelCase } from 'lodash';
import * as digitalFormPatterns from '../../../utils/digitalFormPatterns';
import { normalizedForm } from '../../../config/formConfig';

const {
  addressPages,
  customStepPages,
  listLoopPages,
  personalInfoPages,
  phoneAndEmailPages,
} = digitalFormPatterns;

const findChapterByType = type =>
  normalizedForm.chapters.find(chapter => chapter.type === type);

// Shared behavior among all single-page chapters
const itContainsASinglePage = (chapter, pattern) => {
  const pages = pattern(chapter);

  it('returns a single page', () => {
    expect(Object.keys(pages).length).to.eq(1);
    expect(pages[chapter.id].title).to.eq(chapter.pageTitle);
    expect(pages[chapter.id].path).to.eq(chapter.id.toString());
  });
};

describe('addressPages', () => {
  const includeMilitary = {
    id: 158256,
    chapterTitle: 'Includes military addresses',
    type: 'digital_form_address',
    pageTitle: 'Address',
    additionalFields: {
      militaryAddressCheckbox: true,
    },
  };

  itContainsASinglePage(includeMilitary, addressPages);

  context('when militaryAddressCheckbox is true', () => {
    let addressSpy;

    beforeEach(() => {
      addressSpy = sinon.spy(addressPatterns, 'addressSchema');
    });

    it('calls addressSchema', () => {
      const schemas = addressPages(includeMilitary);

      expect(addressSpy.calledOnce).to.eq(true);
      expect(schemas[includeMilitary.id].uiSchema.address).to.not.eq(undefined);
    });
  });

  context('when militaryAddressCheckbox is false', () => {
    let noMilitarySpy;

    beforeEach(() => {
      noMilitarySpy = sinon.spy(addressPatterns, 'addressNoMilitarySchema');
    });

    it('calls addressNoMilitarySchema', () => {
      const chapter = findChapterByType('digital_form_address');
      const schemas = addressPages(chapter);

      expect(noMilitarySpy.calledOnce).to.eq(true);
      expect(schemas[chapter.id].uiSchema.address).to.not.eq(undefined);
    });
  });
});

describe('customStepPages', () => {
  it('returns the correct number of pages', () => {
    const chapter = findChapterByType('digital_form_custom_step');
    const schemas = customStepPages(chapter);
    const camelTitle = camelCase(chapter.pages[0].pageTitle);

    expect(Object.keys(schemas).length).to.eq(chapter.pages.length);
    expect(schemas[camelTitle].title).to.eq(chapter.pages[0].pageTitle);
  });
});

describe('phoneAndEmailPages', () => {
  const includeEmail = {
    id: 158256,
    chapterTitle: 'Email address included',
    type: 'digital_form_phone_and_email',
    pageTitle: 'Phone and email address',
    additionalFields: {
      includeEmail: true,
    },
  };
  const phoneOnly = findChapterByType('digital_form_phone_and_email');
  const phoneOnlyPage = phoneAndEmailPages(phoneOnly)[phoneOnly.id];

  itContainsASinglePage(phoneOnly, phoneAndEmailPages);

  it('includes homePhone', () => {
    expect(phoneOnlyPage.schema.properties.homePhone).to.eq(
      webComponentPatterns.phoneSchema,
    );
    expect(phoneOnlyPage.uiSchema.homePhone).to.not.eq(undefined);
  });

  it('requires homePhone', () => {
    expect(phoneOnlyPage.schema.required).to.include('homePhone');
  });

  it('includes mobilePhone', () => {
    expect(phoneOnlyPage.schema.properties.mobilePhone).to.eq(
      webComponentPatterns.phoneSchema,
    );
    expect(phoneOnlyPage.uiSchema.mobilePhone).to.not.eq(undefined);
  });

  context('when includeEmail is true', () => {
    const includeEmailPage = phoneAndEmailPages(includeEmail)[includeEmail.id];

    it('includes emailAddress', () => {
      expect(includeEmailPage.schema.properties.emailAddress).to.eq(
        webComponentPatterns.emailSchema,
      );
      expect(includeEmailPage.uiSchema.emailAddress).to.not.eq(undefined);
    });

    it('requires emailAddress', () => {
      expect(includeEmailPage.schema.required).to.include('emailAddress');
    });
  });

  context('when includeEmail is false', () => {
    it('does not include emailAddress', () => {
      expect(phoneOnlyPage.schema.properties.emailAddress).to.eq(undefined);
      expect(phoneOnlyPage.uiSchema.emailAddress).to.eq(undefined);
    });
  });
});

describe('listLoopPages', () => {
  const optional = {
    id: 162032,
    type: 'digital_form_list_loop',
    additionalFields: {
      optional: true,
    },
    chapterTitle: "Veteran's employment history",
    pageTitle: 'List & Loop',
  };
  const pageBuilder = {
    introPage: pageConfig => pageConfig,
    itemPage: pageConfig => pageConfig,
    summaryPage: pageConfig => pageConfig,
  };
  const required = findChapterByType('digital_form_list_loop');

  let arrayBuilderStub;

  beforeEach(() => {
    arrayBuilderStub = sinon
      .stub()
      .callsFake((options, pageBuilderCallback) =>
        pageBuilderCallback(pageBuilder),
      );
  });

  it('includes the right options', () => {
    listLoopPages(optional, arrayBuilderStub);

    const options = arrayBuilderStub.getCall(0).args[0];

    expect(options.arrayPath).to.eq('employers');
    expect(options.nounSingular).to.eq('employer');
    expect(options.nounPlural).to.eq('employers');
    expect(options.maxItems).to.eq(4);
  });

  it('includes a summary page', () => {
    const { employerSummary } = listLoopPages(optional, arrayBuilderStub);

    expect(employerSummary.path).to.eq('employers');
  });

  context('when the variation is employment history', () => {
    const {
      employerDatePage,
      employerDetailPage,
      employerNamePage,
    } = listLoopPages(optional, arrayBuilderStub);

    it('includes a name page', () => {
      expect(employerNamePage.title).to.eq(
        'Name and address of employer or unit',
      );
    });

    it('includes a date page', () => {
      expect(employerDatePage.title).to.eq('Dates you were employed');
    });

    it('includes a details page', () => {
      expect(employerDetailPage.title).to.eq('Employment detail for employer');
    });
  });

  describe('additionalFields', () => {
    let pages;

    context('when optional is false', () => {
      beforeEach(() => {
        pages = listLoopPages(required, arrayBuilderStub);
      });

      it('sets required to true', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(true);
      });

      it('includes an introPage', () => {
        const { employer: introPage, employerSummary } = pages;

        expect(introPage.title).to.eq('Employers');

        expect(employerSummary.title).to.eq('Review your employers');
        expect(employerSummary.path).to.eq('employers-summary');
      });
    });

    context('when optional is true', () => {
      beforeEach(() => {
        pages = listLoopPages(optional, arrayBuilderStub);
      });

      it('sets required to false', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(false);
      });

      it('does not include an introPage', () => {
        const { employerSummary } = pages;

        expect(pages.employer).to.eq(undefined);
        expect(employerSummary.title).to.eq('Your employers');
        expect(employerSummary.path).to.eq('employers');
      });
    });
  });
});

describe('personalInfoPages', () => {
  const yourPersonalInfo = findChapterByType('digital_form_your_personal_info');
  const [nameAndDob, identificationInfo] = yourPersonalInfo.pages;
  const { identificationInformation, nameAndDateOfBirth } = personalInfoPages(
    yourPersonalInfo,
  );

  it('includes a nameAndDateOfBirth page', () => {
    expect(nameAndDateOfBirth.title).to.eq(nameAndDob.pageTitle);
  });

  it('includes an identificationInformation page', () => {
    expect(identificationInformation.title).to.eq(identificationInfo.pageTitle);
  });
});
