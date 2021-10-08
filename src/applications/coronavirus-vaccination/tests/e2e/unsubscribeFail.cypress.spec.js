import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';
import UnsubscribePage from './page-objects/UnsubscribePage';

describe('COVID-19 Vaccination Preparation Form', () => {
  it('should fail to unsubscribe the user', () => {
    const unsubscribePage = new UnsubscribePage();
    unsubscribePage.loadPage(404, '00000');
    unsubscribePage.confirmUnsubscription('failed');
  });
});
