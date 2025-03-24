import { expect } from 'chai';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import nameAndDateOfBirth from 'applications/simple-forms-form-engine/shared/config/pages/nameAndDateOfBirth';

describe('nameAndDateOfBirth', () => {
  const normalizedPage = {
    pageTitle: 'Test Title for Name and Date of Birth',
    includeDateOfBirth: true,
  };

  const formattedPage = nameAndDateOfBirth(normalizedPage);

  it('includes the correct attributes', () => {
    expect(formattedPage.title).to.eq(normalizedPage.pageTitle);
    expect(formattedPage.path).to.eq('name-and-date-of-birth');
  });

  it('contains fullName', () => {
    expect(formattedPage.schema.properties.fullName).to.eq(
      webComponentPatterns.fullNameSchema,
    );
    expect(formattedPage.uiSchema.fullName).to.not.eq(undefined);
  });

  context('when includeDateOfBirth is true', () => {
    it('contains dateOfBirth', () => {
      expect(formattedPage.schema.properties.dateOfBirth).to.eq(
        webComponentPatterns.dateOfBirthSchema,
      );
      expect(formattedPage.uiSchema.dateOfBirth).to.not.eq(undefined);
    });
  });

  context('when includeDateOfBirth is false', () => {
    const noDob = { ...normalizedPage, includeDateOfBirth: false };
    const formattedNameOnly = nameAndDateOfBirth(noDob);

    it('does not contain dateOfBirth', () => {
      expect(formattedNameOnly.schema.properties.dateOfBirth).to.eq(undefined);
      expect(formattedNameOnly.uiSchema.dateOfBirth).to.eq(undefined);
    });
  });
});
