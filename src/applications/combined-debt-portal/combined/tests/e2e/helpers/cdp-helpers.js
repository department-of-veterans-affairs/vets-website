import mockCopays from '../../../../medical-copays/tests/e2e/fixtures/mocks/copays.json';
import mockDebts from '../../../../debt-letters/tests/e2e/fixtures/mocks/debts.json';
import mockDebtVBMS from '../../../../debt-letters/tests/e2e/fixtures/mocks/debtsVBMS.json';

const mockCopayEmpty = { data: [] };
const mockDebtEmpty = {
  hasDependentDebts: false,
  debts: [],
};
const mockVBMSEmpty = {
  data: [],
};

const reply404 = req => {
  return req.reply(404, { errors: ['error'] });
};

export const reply403 = req => {
  return req.reply(403, {
    errors: [
      {
        title: 'Forbidden',
        detail: 'User does not have access to the requested resource',
        code: '403',
        status: '403',
      },
    ],
  });
};

export const debtResponses = {
  good: (name = 'debts') => {
    cy.intercept('GET', '/v0/debts', mockDebts).as(name);
  },
  bad: (name = 'debts') => {
    cy.intercept('GET', '/v0/debts', req => reply404(req)).as(name);
  },
  empty: (name = 'debts') => {
    cy.intercept('GET', '/v0/debts', mockDebtEmpty).as(name);
  },
};

export const vbmsResponses = {
  good: (name = 'debtVBMS') => {
    cy.intercept('GET', '/v0/debt_letters', mockDebtVBMS).as(name);
  },
  bad: (name = 'debtVBMS') => {
    cy.intercept('GET', '/v0/debt_letters', req => reply404(req)).as(name);
  },
  empty: (name = 'debtVBMS') => {
    cy.intercept('GET', '/v0/debt_letters', mockVBMSEmpty).as(name);
  },
};

export const copayResponses = {
  good: (name = 'copays') => {
    cy.intercept('GET', '/v0/medical_copays', mockCopays).as(name);
  },
  bad: (name = 'copays') => {
    cy.intercept('GET', '/v0/medical_copays', req => reply404(req)).as(name);
  },
  empty: (name = 'copays') => {
    cy.intercept('GET', '/v0/medical_copays', mockCopayEmpty).as(name);
  },
  notEnrolled: (name = 'copays') => {
    cy.intercept('GET', '/v0/medical_copays', req => reply403(req)).as(name);
  },
};
