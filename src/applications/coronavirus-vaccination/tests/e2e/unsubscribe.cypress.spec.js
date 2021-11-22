import UnsubscribePage from './page-objects/UnsubscribePage';

describe('COVID-19 Vaccination Preparation Form', () => {
  it('should successfully unsubscribe the user', () => {
    const unsubscribePage = new UnsubscribePage();
    unsubscribePage.loadPage(200, 12345);
    unsubscribePage.confirmUnsubscription();
  });
});
