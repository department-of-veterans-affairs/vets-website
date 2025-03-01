import PersonalInformationPage from '../pages/PersonalInformationPage';
import mockSignature from '../../fixtures/personal-information-signature.json';

describe('PERSONAL INFORMATION SIGNATURE', () => {
  it('verify no signature interface', () => {
    const noSignatureResponse = {
      ...mockSignature,
      data: {
        ...mockSignature.data,
        attributes: {
          ...mockSignature.data.attributes,
          signatureName: null,
          signatureTitle: null,
        },
      },
    };

    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);
    PersonalInformationPage.load(updatedFeatureToggles, noSignatureResponse);

    PersonalInformationPage.verifyNoSignatureInterface();
  });

  it('verify existing signature content', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);
    PersonalInformationPage.verifyExistingSignatureInterface();

    cy.injectAxeThenAxeCheck();
  });
});
