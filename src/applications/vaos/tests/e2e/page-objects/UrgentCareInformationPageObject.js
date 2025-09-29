import PageObject from './PageObject';

class UrgentCareInformationPageObject extends PageObject {
  assertUrl() {
    return super.assertUrl(
      {
        url: '/schedule',
        breadcrumb: 'Only schedule appointments for non-urgent needs',
      },
      { timeout: 10000 },
    );
  }
}

export default new UrgentCareInformationPageObject();
