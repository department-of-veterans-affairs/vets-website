export const mockDebtsEmpty = { debts: [], hasDependentDebts: false };
export const mockCopaysEmpty = { data: [] };

export const reply500 = req => {
  return req.reply(500, { errors: ['500 error'] });
};

export const reply404 = req => {
  return req.reply(404, { errors: ['404 error'] });
};

export const copayReply404 = req => {
  return req.reply(404, { message: 'Resource not found' });
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

export const customButtonGroupContinue = (buttonText = 'Continue') => {
  cy.get('va-button[data-testid="custom-button-group-button"]')
    .shadow()
    .find(`button:contains("${buttonText}")`)
    .click();
};

export const navigateToDebtSelection = () => {
  cy.get('#start-option-0').click();
  cy.get('#reconsider-option-2').click();
  cy.get('#recipients-option-1').click();
  cy.get('[data-testid="start-button"]').click();

  cy.get('a.vads-c-action-link--green')
    .first()
    .click();

  cy.findAllByText(/continue/i, { selector: 'button' })
    .first()
    .click();
};
