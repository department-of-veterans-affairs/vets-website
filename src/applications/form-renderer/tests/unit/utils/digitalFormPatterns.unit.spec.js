import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import {
  digitalFormAddress,
  digitalFormIdentificationInfo,
  digitalFormNameAndDoB,
  digitalFormPhoneAndEmail,
} from 'applications/form-renderer/utils/digitalFormPatterns';
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
  let dobIncluded;

  beforeEach(() => {
    dobIncluded = digitalFormNameAndDoB(
      findChapterByType('digital_form_name_and_date_of_bi'),
    );
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
      const nameOnlyChapter = {
        id: 158254,
        chapterTitle: 'Name only chapter',
        type: 'digital_form_name_and_date_of_bi',
        pageTitle: 'Name and Date of Birth',
        additionalFields: {
          includeDateOfBirth: false,
        },
      };
      const nameOnly = digitalFormNameAndDoB(nameOnlyChapter);

      expect(nameOnly.schema.properties.dateOfBirth).to.eq(undefined);
      expect(nameOnly.uiSchema.dateOfBirth).to.eq(undefined);
    });
  });
});

describe('digitalFormIdentificationInfo', () => {
  let vetIdOnly;

  beforeEach(() => {
    vetIdOnly = digitalFormIdentificationInfo(
      findChapterByType('digital_form_identification_info'),
    );
  });

  it('contains veteranId', () => {
    expect(vetIdOnly.schema.properties.veteranId).to.eq(
      webComponentPatterns.ssnOrVaFileNumberSchema,
    );
    expect(vetIdOnly.uiSchema.veteranId).to.not.eq(undefined);
  });

  context('when includeServiceNumber is true', () => {
    it('includes serviceNumber', () => {
      const serviceNumberChapter = {
        id: 158255,
        chapterTitle: 'Service Number Included',
        type: 'digital_form_identification_info',
        pageTitle: 'Identification Information',
        additionalFields: {
          includeServiceNumber: true,
        },
      };
      const serviceNumberIncluded = digitalFormIdentificationInfo(
        serviceNumberChapter,
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
