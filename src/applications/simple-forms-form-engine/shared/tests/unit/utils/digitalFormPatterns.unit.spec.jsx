import { expect } from 'chai';
import sinon from 'sinon';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import * as addressPatterns from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import * as digitalFormPatterns from '../../../utils/digitalFormPatterns';
import { normalizedForm } from '../../../config/formConfig';

const {
  addressPages,
  customStepPages,
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
    const page = chapter.pages[0];
    const schemas = customStepPages(chapter);

    expect(Object.keys(schemas).length).to.eq(chapter.pages.length);
    expect(schemas[`page${page.id}`].title).to.eq(page.pageTitle);
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
