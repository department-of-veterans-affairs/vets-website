import PageObject from './PageObject';

export class PlanAheadPageObject extends PageObject {
  assertUrl() {
    return super.assertUrl({
      url: 'covid-vaccine',
      breadcrumb: 'COVID-19 vaccine appointment',
    });
  }
}

export default new PlanAheadPageObject();
