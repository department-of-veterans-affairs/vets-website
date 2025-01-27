import mockToggles from '../fixtures/toggles-response.json';
import { Locators } from '../utils/constants';

class GeneralFunctionsPage {
  getPageHeader = () => {
    return cy.get(`h1`);
  };

  updatedThreadDates = data => {
    const currentDate = new Date();
    return {
      ...data,
      data: data.data.map((item, i) => {
        const newSentDate = new Date(currentDate);
        const newDraftDate = new Date(currentDate);
        newSentDate.setDate(currentDate.getDate() - i);
        newDraftDate.setDate(currentDate.getDate() - i);
        return {
          ...item,
          attributes: {
            ...item.attributes,
            sentDate:
              item.attributes.sentDate != null
                ? newSentDate.toISOString()
                : null,
            draftDate:
              item.attributes.draftDate != null
                ? newDraftDate.toISOString()
                : null,
          },
        };
      }),
    };
  };

  updateFeatureToggles = (...args) => {
    const options = [];
    for (let i = 0; i < args.length; i += 2) {
      options.push({
        name: args[i],
        value: args[i + 1],
      });
    }
    return {
      ...mockToggles,
      data: {
        ...mockToggles.data,
        features: [...mockToggles.data.features, ...options],
      },
    };
  };

  getDateFormat = (date = new Date()) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  };

  verifyUrl = endpoint => {
    cy.url().should(`include`, endpoint);
  };

  verifyPageHeader = text => {
    cy.get(`h1`).should(`have.text`, text);
  };

  verifyHeaderFocused = () => {
    cy.get(`h1`).should(`be.focused`);
  };

  verifyMaintenanceBanner = (startDate, endDate, text) => {
    cy.get(Locators.ALERTS.VA_ALERT)
      .find(`h2`)
      .should(`be.visible`)
      .and(`have.text`, text);

    cy.contains(`Start:`)
      .parent(`p`)
      .should(`include.text`, `Start: ${this.getDateFormat(startDate)}`);
    cy.contains(`End:`)
      .parent(`p`)
      .should(`include.text`, `End: ${this.getDateFormat(endDate)}`);
  };

  getRandomDateWithinLastNumberOfMonths = number => {
    const now = new Date();
    const currentDate = new Date();
    currentDate.setMonth(now.getMonth() - number);

    const randomTime =
      currentDate.getTime() +
      Math.random() * (now.getTime() - currentDate.getTime());
    return new Date(randomTime).toISOString();
  };
}

export default new GeneralFunctionsPage();
