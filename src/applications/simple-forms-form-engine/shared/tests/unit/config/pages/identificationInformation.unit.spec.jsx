import { expect } from 'chai';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import identificationInformation from 'applications/simple-forms-form-engine/shared/config/pages/identificationInformation';

describe('identificationInformation', () => {
  const normalizedPage = {
    pageTitle: 'Test Title for Identification Information Page',
    includeServiceNumber: false,
  };
  const pageSchema = identificationInformation(normalizedPage);

  it('includes an identification information page', () => {
    expect(pageSchema.title).to.eq(normalizedPage.pageTitle);
    expect(pageSchema.path).to.eq('identification-information');
  });

  context('when includeServiceNumber is true', () => {
    const normalizedServiceNumber = {
      ...normalizedPage,
      includeServiceNumber: true,
    };
    const serviceNumberIncluded = identificationInformation(
      normalizedServiceNumber,
    );

    it('includes serviceNumber', () => {
      expect(serviceNumberIncluded.schema.properties.serviceNumber).to.eq(
        webComponentPatterns.serviceNumberSchema,
      );
      expect(serviceNumberIncluded.uiSchema.serviceNumber).to.not.eq(undefined);
    });
  });

  context('when includeServiceNumber is false', () => {
    it('does not include serviceNumber', () => {
      expect(pageSchema.schema.properties.serviceNumber).to.eq(undefined);
      expect(pageSchema.uiSchema.serviceNumber).to.eq(undefined);
    });
  });
});
