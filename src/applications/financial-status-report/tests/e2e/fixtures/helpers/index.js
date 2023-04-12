export const mockDebtsEmpty = { debts: [] };
export const mockCopaysEmpty = { data: [] };

export const reply500 = req => {
  return req.reply(500, { errors: ['500 error'] });
};

export const reply404 = req => {
  return req.reply(404, { errors: ['404 error'] });
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

export const navigateToDebtSelection = () => {
  cy.get('#start-option-0').click();
  cy.get('#reconsider-option-2').click();
  cy.get('#recipients-option-1').click();
  cy.get('[data-testid="start-button"]').click();

  cy.get('va-button[text*="start"]')
    .first()
    .shadow()
    .find('button')
    .click();

  cy.findAllByText(/continue/i, { selector: 'button' })
    .first()
    .click();
};
