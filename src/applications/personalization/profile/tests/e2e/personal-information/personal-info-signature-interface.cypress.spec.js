import PersonalInformationPage from '../pages/PersonalInformationPage';

describe('PERSONAL INFORMATION SIGNATURE', () => {
  it('verify signature content', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);
    PersonalInformationPage.verifyInterface();

    cy.injectAxeThenAxeCheck();
  });
});
