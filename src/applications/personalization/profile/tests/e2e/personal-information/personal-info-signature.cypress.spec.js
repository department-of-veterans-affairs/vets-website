import PersonalInformationPage from '../pages/PersonalInformationPage';

describe('personal information signature', () => {
  it('test', () => {
    const updatedFeatureToggles = {
      data: {
        features: [
          {
            name: 'profileEnhancements',
            value: true,
          },
          {
            name: 'profile_enhancements',
            value: true,
          },
          {
            name: 'mhv_secure_messaging_signature_settings',
            value: true,
          },
          {
            name: 'mhv_secure_messaging_signature_settings',
            value: true,
          },
        ],
      },
    };

    PersonalInformationPage.load(updatedFeatureToggles);
    cy.injectAxeThenAxeCheck();
  });
});
