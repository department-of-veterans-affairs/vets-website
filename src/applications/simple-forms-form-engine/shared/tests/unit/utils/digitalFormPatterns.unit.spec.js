import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import {
  digitalFormAddress,
  digitalFormIdentificationInfo,
  digitalFormNameAndDoB,
  digitalFormPhoneAndEmail,
  listLoopPages,
} from '../../../utils/digitalFormPatterns';
import { normalizedForm } from '../../../_config/formConfig';

const findChapterByType = type =>
  normalizedForm.chapters.find(chapter => chapter.type === type);

describe('digitalFormAddress', () => {
  let addressSpy;
  let noMiliarySpy;

  beforeEach(() => {
    addressSpy = sinon.spy(addressPatterns, 'addressSchema');
    noMiliarySpy = sinon.spy(addressPatterns, 'addressNoMilitarySchema');
  });

  afterEach(() => {
    addressSpy.restore();
    noMiliarySpy.restore();
  });

  context('when militaryAddressCheckbox is true', () => {
    it('calls addressSchema', () => {
      const includeMilitary = {
        id: 158256,
        chapterTitle: 'Includes military addresses',
        type: 'digital_form_address',
        pageTitle: 'Address',
        additionalFields: {
          militaryAddressCheckbox: true,
        },
      };
      const schemas = digitalFormAddress(includeMilitary);

      expect(addressSpy.calledOnce).to.eq(true);
      expect(schemas.uiSchema.address).to.not.eq(undefined);
    });
  });

  context('when militaryAddressCheckbox is false', () => {
    it('calls addressNoMilitarySchema', () => {
      const schemas = digitalFormAddress(
        findChapterByType('digital_form_address'),
      );

      expect(noMiliarySpy.calledOnce).to.eq(true);
      expect(schemas.uiSchema.address).to.not.eq(undefined);
    });
  });
});

describe('digitalFormNameAndDoB', () => {
  const dobPage = {
    pageTitle: 'Name and Date of Birth',
    includeDateOfBirth: true,
  };
  let dobIncluded;

  beforeEach(() => {
    dobIncluded = digitalFormNameAndDoB(dobPage);
  });

  it('contains fullName', () => {
    expect(dobIncluded.schema.properties.fullName).to.eq(
      webComponentPatterns.fullNameSchema,
    );
    expect(dobIncluded.uiSchema.fullName).to.not.eq(undefined);
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
      const nameOnlyPage = {
        pageTitle: 'Name and Date of Birth',
        includeDateOfBirth: false,
      };
      const nameOnly = digitalFormNameAndDoB(nameOnlyPage);

      expect(nameOnly.schema.properties.dateOfBirth).to.eq(undefined);
      expect(nameOnly.uiSchema.dateOfBirth).to.eq(undefined);
    });
  });
});

describe('digitalFormIdentificationInfo', () => {
  let vetIdOnly;

  beforeEach(() => {
    const [, identificationInfo] = findChapterByType(
      'digital_form_your_personal_info',
    ).pages;
    vetIdOnly = digitalFormIdentificationInfo(identificationInfo);
  });

  it('contains veteranId', () => {
    expect(vetIdOnly.schema.properties.veteranId).to.eq(
      webComponentPatterns.ssnOrVaFileNumberSchema,
    );
    expect(vetIdOnly.uiSchema.veteranId).to.not.eq(undefined);
  });

  context('when includeServiceNumber is true', () => {
    it('includes serviceNumber', () => {
      const serviceNumberPage = {
        pageTitle: 'Identification Information',
        includeServiceNumber: true,
      };
      const serviceNumberIncluded = digitalFormIdentificationInfo(
        serviceNumberPage,
      );

      expect(serviceNumberIncluded.schema.properties.serviceNumber).to.eq(
        webComponentPatterns.serviceNumberSchema,
      );
      expect(serviceNumberIncluded.uiSchema.serviceNumber).to.not.eq(undefined);
    });
  });

  context('when includeServiceNumber is false', () => {
    it('does not include serviceNumber', () => {
      expect(vetIdOnly.schema.properties.serviceNumber).to.eq(undefined);
      expect(vetIdOnly.uiSchema.serviceNumber).to.eq(undefined);
    });
  });
});

describe('digitalFormPhoneAndEmail', () => {
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

  it('includes homePhone', () => {
    const schemas = digitalFormPhoneAndEmail(includeEmail);

    expect(schemas.schema.properties.homePhone).to.eq(
      webComponentPatterns.phoneSchema,
    );
    expect(schemas.uiSchema.homePhone).to.not.eq(undefined);
  });

  it('includes mobilePhone', () => {
    const schemas = digitalFormPhoneAndEmail(phoneOnly);

    expect(schemas.schema.properties.mobilePhone).to.eq(
      webComponentPatterns.phoneSchema,
    );
    expect(schemas.uiSchema.mobilePhone).to.not.eq(undefined);
  });

  context('when includeEmail is true', () => {
    it('includes emailAddress', () => {
      const schemas = digitalFormPhoneAndEmail(includeEmail);

      expect(schemas.schema.properties.emailAddress).to.eq(
        webComponentPatterns.emailSchema,
      );
      expect(schemas.uiSchema.emailAddress).to.not.eq(undefined);
    });
  });

  context('when includeEmail is false', () => {
    it('does not include emailAddress', () => {
      const schemas = digitalFormPhoneAndEmail(phoneOnly);

      expect(schemas.schema.properties.emailAddress).to.eq(undefined);
      expect(schemas.uiSchema.emailAddress).to.eq(undefined);
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

    expect(employerSummary.title).to.eq('Your employers');
    expect(employerSummary.path).to.eq('employers');
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
    // let pages;

    context('when optional is false', () => {
      beforeEach(() => {
        listLoopPages(required, arrayBuilderStub);
        // introPage = pages.employer;
      });

      it('sets required to true', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(true);
      });

      it('includes an introPage');
    });

    context('when optional is true', () => {
      beforeEach(() => {
        listLoopPages(optional, arrayBuilderStub);
        // introPage = pages.employer;
      });

      it('sets required to false', () => {
        const options = arrayBuilderStub.getCall(0).args[0];

        expect(options.required).to.eq(false);
      });

      it('does not include an introPage');
    });
  });
});
