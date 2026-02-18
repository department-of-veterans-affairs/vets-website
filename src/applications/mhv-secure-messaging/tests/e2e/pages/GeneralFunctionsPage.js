import { format, subMonths, getYear } from 'date-fns';
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

  // param [ArrayOfObjects{name: string, value: any}]
  // returns {Object} - the updated mock toggles object.
  updateFeatureToggles = toggles => {
    return {
      ...mockToggles,
      data: {
        ...mockToggles.data,
        features: [...mockToggles.data.features, ...toggles],
      },
    };
  };

  updateTGSuggestedName = (response, name) => {
    return {
      ...response,
      data: [
        {
          ...response.data[0],
          attributes: {
            ...response.data[0].attributes,
            suggestedNameDisplay: name,
          },
        },
        ...response.data.slice(1),
      ],
    };
  };

  formatToReadableDate = isoString => {
    const date = new Date(isoString);

    return new Intl.DateTimeFormat('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
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
    cy.get(`h1`)
      .should(`be.visible`)
      .and(`include.text`, text);
  };

  verifyHeaderFocused = () => {
    cy.get(`h1`).should(`be.focused`);
  };

  verifyMaintenanceBanner = (startDate, endDate, text) => {
    cy.get(Locators.ALERTS.VA_ALERT)
      .find(`h2`)
      .eq(0)
      .should(`be.visible`)
      .and(`contain`, text);

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

  getParsedDate = date => {
    let year = getYear(date);
    let startMonth = format(subMonths(date, 1), 'MMMM');
    const endMonth = format(date, 'MMMM');
    if (endMonth === 'January') {
      year -= 1;
      startMonth = endMonth;
    }
    return {
      year,
      startMonth,
      endMonth,
    };
  };

  verifyLastBreadCrumb = value => {
    cy.get(`.usa-breadcrumb__link`)
      .last()
      .should(`have.text`, value);
  };

  verifyPageTitle = value => {
    cy.title().should(`contain`, value);
  };
}

export default new GeneralFunctionsPage();
