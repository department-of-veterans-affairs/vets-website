import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import * as digitalFormPatterns from '../../../utils/digitalFormPatterns';
import { normalizedForm } from '../../../config/formConfig';

const {
  addressPages,
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

    expect(employerSummary.schema.properties['view:hasEmployers']).to.eq(
      webComponentPatterns.arrayBuilderYesNoSchema,
    );
    expect(employerSummary.uiSchema['view:hasEmployers']).to.not.eq(undefined);
  });

  context('when the variation is employment history', () => {
    it('includes a name page', () => {
      const { employerNamePage } = listLoopPages(optional, arrayBuilderStub);

      expect(employerNamePage.title).to.eq(
        'Name and address of employer or unit',
      );
      expect(employerNamePage.path).to.eq('employers/:index/name-and-address');
      expect(employerNamePage.schema.properties.address).to.not.eq(undefined);
      expect(employerNamePage.schema.properties.name).to.eq(
        webComponentPatterns.textSchema,
      );
      expect(employerNamePage.uiSchema.address).to.not.eq(undefined);
      expect(employerNamePage.uiSchema.name).to.not.eq(undefined);
    });

    it('includes a date page', () => {
      const { employerDatePage } = listLoopPages(optional, arrayBuilderStub);

      expect(employerDatePage.title).to.eq('Dates you were employed');
      expect(employerDatePage.path).to.eq('employers/:index/dates');
      expect(employerDatePage.schema.properties.dateRange).to.eq(
        webComponentPatterns.currentOrPastDateRangeSchema,
      );
      expect(employerDatePage.uiSchema.dateRange).to.not.eq(undefined);
    });

    it('includes a details page', () => {
      const { employerDetailPage } = listLoopPages(optional, arrayBuilderStub);

      expect(employerDetailPage.title).to.eq('Employment detail for employer');
      expect(employerDetailPage.path).to.eq('employers/:index/detail');
      expect(employerDetailPage.schema.properties.typeOfWork).to.eq(
        webComponentPatterns.textSchema,
      );
      expect(employerDetailPage.schema.properties.hoursPerWeek).to.eq(
        webComponentPatterns.numberSchema,
      );
      expect(employerDetailPage.schema.properties.lostTime).to.eq(
        webComponentPatterns.numberSchema,
      );
      expect(employerDetailPage.schema.properties.highestIncome).to.eq(
        webComponentPatterns.textSchema,
      );
      expect(employerDetailPage.uiSchema.typeOfWork).to.not.eq(undefined);
      expect(employerDetailPage.uiSchema.hoursPerWeek).to.not.eq(undefined);
      expect(employerDetailPage.uiSchema.lostTime).to.not.eq(undefined);
      expect(employerDetailPage.uiSchema.highestIncome).to.not.eq(undefined);
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
        expect(introPage.path).to.eq('employers');
        // introPages have no schemas
        expect(Object.keys(introPage.schema.properties).length).to.eq(0);
        expect(introPage.uiSchema).to.not.eq(undefined);

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
  const optionalFieldsIncluded = {
    id: 54321,
    type: 'digital_form_your_personal_info',
    chapterTitle: 'Your personal information',
    pages: [
      {
        pageTitle: 'Name',
        includeDateOfBirth: true,
      },
      {
        pageTitle: 'Identification information',
        includeServiceNumber: true,
      },
    ],
  };
  const yourPersonalInfo = findChapterByType('digital_form_your_personal_info');
  const [nameAndDob, identificationInfo] = yourPersonalInfo.pages;
  const { identificationInformation, nameAndDateOfBirth } = personalInfoPages(
    yourPersonalInfo,
  );
  const {
    identificationInformation: serviceNumberIncluded,
    nameAndDateOfBirth: dobIncluded,
  } = personalInfoPages(optionalFieldsIncluded);

  describe('nameAndDateOfBirth', () => {
    it('includes the correct attributes', () => {
      expect(nameAndDateOfBirth.title).to.eq(nameAndDob.pageTitle);
      expect(nameAndDateOfBirth.path).to.eq('name-and-date-of-birth');
    });

    it('contains fullName', () => {
      expect(nameAndDateOfBirth.schema.properties.fullName).to.eq(
        webComponentPatterns.fullNameSchema,
      );
      expect(nameAndDateOfBirth.uiSchema.fullName).to.not.eq(undefined);
    });

    context('when includeDateOfBirth is true', () => {
      it('contains dateOfBirth', () => {
        expect(dobIncluded.schema.properties.dateOfBirth).to.eq(
          webComponentPatterns.dateOfBirthSchema,
        );
        expect(dobIncluded.uiSchema.dateOfBirth).to.not.eq(undefined);
      });
    });

    context('when includeDateOfBirth is false', () => {
      it('does not contain dateOfBirth', () => {
        expect(nameAndDateOfBirth.schema.properties.dateOfBirth).to.eq(
          undefined,
        );
        expect(nameAndDateOfBirth.uiSchema.dateOfBirth).to.eq(undefined);
      });
    });
  });

  describe('identificationInformation', () => {
    it('includes an identification information page', () => {
      expect(identificationInformation.title).to.eq(
        identificationInfo.pageTitle,
      );
      expect(identificationInformation.path).to.eq(
        'identification-information',
      );
    });

    context('when includeServiceNumber is true', () => {
      it('includes serviceNumber', () => {
        expect(serviceNumberIncluded.schema.properties.serviceNumber).to.eq(
          webComponentPatterns.serviceNumberSchema,
        );
        expect(serviceNumberIncluded.uiSchema.serviceNumber).to.not.eq(
          undefined,
        );
      });
    });

    context('when includeServiceNumber is false', () => {
      it('does not include serviceNumber', () => {
        expect(identificationInformation.schema.properties.serviceNumber).to.eq(
          undefined,
        );
        expect(identificationInformation.uiSchema.serviceNumber).to.eq(
          undefined,
        );
      });
    });
  });
});
