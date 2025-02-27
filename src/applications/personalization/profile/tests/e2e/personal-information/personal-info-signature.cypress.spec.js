import PersonalInformationPage from '../pages/PersonalInformationPage';

describe('personal information signature', () => {
  it('test', () => {
    const updatedFeatureToggles = PersonalInformationPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_signature_settings',
        value: true,
      },
    ]);

    PersonalInformationPage.load(updatedFeatureToggles);

    cy.injectAxeThenAxeCheck();
  });
});
