import mockToggles from '../fixtures/toggles-response.json';

class GeneralFunctionsPage {
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

  updateFeatureToggles = (name, value) => {
    return {
      ...mockToggles,
      data: {
        ...mockToggles.data,
        features: [
          ...mockToggles.data.features,
          {
            name,
            value,
          },
        ],
      },
    };
  };

  getDateFormat = () => {
    const date = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter
      .format(date)
      .replace(`AM`, `a.m.`)
      .replace(`PM`, `p.m.`);
  };

  verifyUrl = endpoint => {
    cy.url().should(`include`, endpoint);
  };

  verifyPageHeader = text => {
    cy.get(`h1`).should(`have.text`, text);
  };
}

export default new GeneralFunctionsPage();
