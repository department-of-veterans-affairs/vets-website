// Helper functions
export const expectPath = (pathname, search = '') => {
  cy.location('pathname', { timeout: 10000 }).should('eq', pathname);
  cy.location('search').should('eq', search);
};

export const waitHydrated = selector =>
  cy.get(selector, { timeout: 15000 }).should('have.class', 'hydrated');

// Always select a NON-disabled inner input and re-query before actions
export const getVaInnerInput = selector =>
  waitHydrated(selector)
    .shadow()
    // only grab enabled one(s)
    .find('#inputField:not([disabled])', { timeout: 15000 })
    .should('be.visible')
    .and('be.enabled');

export const setVaInputValue = (hostSelector, value) =>
  waitHydrated(hostSelector)
    .shadow()
    .find('#inputField', { timeout: 15000 })
    .should('be.visible')
    .then(input => {
      const el = input[0];
      const wasDisabled = el.disabled === true;
      if (wasDisabled) el.disabled = false;

      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      if (wasDisabled) el.disabled = true;

      return cy
        .wrap(el, { timeout: 15000 })
        .should('have.prop', 'value', value);
    });

export const setVaTextareaValue = (hostSelector, value) =>
  waitHydrated(hostSelector)
    .shadow()
    .find('textarea#input-type-textarea', { timeout: 15000 })
    .should('be.visible')
    .then(text => {
      const el = text[0];
      const wasDisabled = el.disabled === true;
      if (wasDisabled) el.disabled = false;

      el.value = '';
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      if (wasDisabled) el.disabled = true;

      return cy
        .wrap(el, { timeout: 15000 })
        .should('have.prop', 'value', value);
    });

export const clickContinue = () => {
  cy.get('body', { log: false }).then($body => {
    // 1) Schemaform pattern: any button whose id ends with "-continueButton" and whose text is "Continue"
    if ($body.find('button[id$="-continueButton"]').length) {
      return cy
        .contains('button[id$="-continueButton"]', /^Continue\b/i)
        .should('be.visible')
        .and('not.be.disabled')
        .click();
    }

    // 2) Any visible submit button that says "Continue"
    if ($body.find('button[type="submit"]').length) {
      return cy
        .contains('button[type="submit"]', /^Continue\b/i)
        .filter(':visible')
        .should('be.enabled')
        .click();
    }

    // 3) <va-button text="Continue">
    if ($body.find('va-button[text="Continue"]').length) {
      return cy.get('va-button[text="Continue"]').then(el => {
        const inner = el[0].shadowRoot?.querySelector('button');
        cy.wrap(inner)
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
    }

    // 4) Fallback: any <va-button> whose inner shadow button contains "Continue"
    if ($body.find('va-button').length) {
      return cy.get('va-button').then(els => {
        const candidate = [...els].find(el =>
          el.shadowRoot
            ?.querySelector('button')
            ?.textContent?.match(/^continue\b/i),
        );
        const btn = candidate.shadowRoot.querySelector('button');
        cy.wrap(btn)
          .should('be.visible')
          .and('not.be.disabled')
          .click({ force: true });
      });
    }

    throw new Error('Continue button not found on this page');
  });
};

export const chooseRadioByValue = (groupName, value) => {
  cy.get(`va-radio-option[name="${groupName}"][value="${value}"]`)
    .should('exist')
    .then(opt => {
      // Click the input inside the web component’s shadow root
      const input =
        opt[0]?.shadowRoot?.querySelector('input[type="radio"]') ||
        opt.find('input[type="radio"]')[0];
      cy.wrap(input).check({ force: true });
    });
};

export const chooseFirstRadioIfUnknown = () => {
  cy.get('va-radio-option input[type="radio"]')
    .first()
    .check({ force: true });
};

export const fillNewConditionAutocomplete = text => {
  const input = () => getVaInnerInput('va-text-input#root_newCondition');

  input()
    .clear()
    .type(text, { delay: 10 });
  input().type('{downarrow}{enter}');
  input()
    .invoke('val')
    .should('not.be.empty');
};

export const selectSideOfBody = side => {
  cy.get(`va-radio-option[value="${side}"] input[type="radio"]`).check({
    force: true,
  });
};

const parseDateInput = input => {
  if (typeof input === 'string') {
    const m = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m)
      throw new Error(`fillNewConditionDate: invalid date string "${input}"`);
    const [, year, month, day] = m;
    return { year, month, day };
  }

  if (input && typeof input === 'object') {
    const { year, month, day } = input;
    return { year: String(year), month: String(month), day: String(day) };
  }

  throw new Error(
    'fillNewConditionDate: expected string "YYYY-MM-DD" or {year, month, day}',
  );
};

export const fillNewConditionDate = input => {
  const { year, month, day } = parseDateInput(input);

  const mNum = Number(month);
  const dNum = Number(day);
  const yStr = String(year);

  if (!/^\d{4}$/.test(yStr))
    throw new Error(`fillNewConditionDate: bad year "${year}"`);
  if (!mNum || mNum < 1 || mNum > 12)
    throw new Error(`fillNewConditionDate: bad month "${month}"`);
  if (!dNum || dNum < 1 || dNum > 31)
    throw new Error(`fillNewConditionDate: bad day "${day}"`);

  cy.get('.usa-memorable-date').within(() => {
    // month still uses the native <select>
    waitHydrated('va-select')
      .shadow()
      .find('select')
      .should('be.visible')
      .select(String(mNum));

    setVaInputValue('.usa-form-group--day va-text-input', String(dNum));
    setVaInputValue('.usa-form-group--year va-text-input', yStr);
  });
};

export const waitForOneOfPaths = (choices, search) => {
  cy.location('pathname', { timeout: 10000 }).should(p => {
    expect(choices, `one of ${choices.join(', ')}`).to.include(p);
  });
  if (typeof search === 'string') cy.location('search').should('eq', search);
};

export const chooseVaRadioByValue = (groupName, value) => {
  cy.get(`va-radio-option[name="${groupName}"][value="${value}"]`)
    .should('exist')
    .then(el => {
      const inputInShadow = el[0].shadowRoot?.querySelector(
        'input[type="radio"]',
      );
      if (inputInShadow) {
        cy.wrap(inputInShadow).check({ force: true });
      } else {
        cy.wrap(el)
          .find('input[type="radio"]')
          .check({ force: true });
      }
    });
};

export const expandAccordion = (index = 0) => {
  cy.get('.usa-accordion--bordered')
    .eq(index)
    .within(() => {
      cy.get('.usa-accordion__button')
        .first()
        .should('be.visible')
        .then(btn => {
          const expanded = btn.attr('aria-expanded');
          if (expanded === 'false' || expanded == null) {
            cy.wrap(btn).click();
          }
        });
    });
};

export const pickNthRadioOption = (n = 0) => {
  cy.get('va-radio-option')
    .eq(n)
    .then(opt => {
      const input = opt[0].shadowRoot?.querySelector('input[type="radio"]');
      if (input) {
        cy.wrap(input).check({ force: true });
      } else {
        cy.wrap(opt)
          .find('input[type="radio"]')
          .check({ force: true });
      }
    });
};

export const addRatedDisability = (index, dateYyyyMmDd = '2021-08-20') => {
  const BASE = `/user-testing/conditions/conditions-mango/${index}`;

  // Condition type page (pick "Rated disability")
  expectPath(`${BASE}/condition`, '?add=true');
  pickNthRadioOption(1); // Pick first rated disability
  clickContinue();

  // Goes straight to date (skips side-of-body/cause pages)
  expectPath(`${BASE}/rated-disability-date`, '?add=true');
  fillNewConditionDate(dateYyyyMmDd);
  clickContinue();

  // Next should be the summary page for conditions
  expectPath('/user-testing/conditions/conditions-mango-summary', '');
};

export const chooseConditionTypeRadioBtn = (optionIndex = 0) => {
  cy.get('va-radio[name="root_ratedDisability"] va-radio-option')
    .eq(optionIndex)
    .within(() => cy.get('input[type="radio"]').check({ force: true }));
};

export const clickEditOnCard = (index = 0) => {
  cy.get(`va-card[name="condition_${index}"]`)
    .should('exist')
    .within(() => {
      cy.get('va-link')
        .should('have.attr', 'data-action', 'edit')
        .shadow()
        .find('a')
        .contains(/^Edit$/i)
        .click();
    });
};

export const assertDeleteModalOpen = () => {
  cy.get('va-modal')
    .should('exist')
    .shadow()
    .find('.usa-modal', { timeout: 10000 })
    .should('exist');
};

export const assertDeleteModalClosed = () => {
  cy.get('va-modal')
    .should('exist')
    .shadow()
    .find('.usa-modal')
    .should('not.exist');
};

export const openDeleteModalFromCard = (index = 0) => {
  cy.get(`va-card[name="condition_${index}"]`)
    .should('exist')
    .within(() => {
      cy.get('va-button-icon[data-action="remove"]')
        .should('exist')
        .shadow()
        .find('button')
        .should('be.visible')
        .click({ force: true });
    });
  assertDeleteModalOpen();
};

export const cancelDelete = () => {
  cy.get('va-modal')
    .shadow()
    .contains('button', /^No, keep this condition$/i)
    .should('be.visible')
    .click({ force: true });

  assertDeleteModalClosed();
};

export const clickDeleteOnCard = (index = 0) => {
  cy.get(`va-card[name="condition_${index}"]`).within(() => {
    cy.get('va-button-icon[data-action="remove"]')
      .should('exist')
      .shadow()
      .find('button')
      .should('be.visible')
      .click();
  });
};

export const confirmDelete = () => {
  cy.get('va-modal[visible]')
    .should('exist')
    .shadow()
    .contains('button', /^Yes, delete this condition$/i)
    .click();
};

export const expectCardText = (index = 0, { titleRe, descRe } = {}) => {
  cy.get(`va-card[name="condition_${index}"]`)
    .should('exist')
    .within(() => {
      if (titleRe) cy.contains('h4', titleRe).should('be.visible');
      if (descRe) cy.contains('p', descRe).should('be.visible');
    });
};

export const chooseCauseByLabel = (labelRe = /Worsened/i) => {
  cy.get('va-radio[name="root_cause"]')
    .find('va-radio-option')
    .contains(labelRe)
    .closest('va-radio-option')
    .within(() => {
      cy.get('input[type="radio"]').check({ force: true });
    });
};

export const fillWorsenedDetails = (desc, effects) => {
  setVaInputValue('va-text-input[name="root_worsenedDescription"]', desc);
  setVaTextareaValue('va-textarea[name="root_worsenedEffects"]', effects);
};

export const clickSaveAndContinue = () => {
  cy.get('va-button[continue]')
    .should('be.visible')
    .shadow()
    .find('button[type="submit"]')
    .contains(/Save and continue/i)
    .click({ force: true });
};
