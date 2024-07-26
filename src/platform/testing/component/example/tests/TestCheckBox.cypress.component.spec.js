import React from 'react';

import TestCheckBox from '../TestCheckBox';

describe('TestCheckBox', () => {
  it('mounts', () => {
    cy.mount(<TestCheckBox />);
    cy.get('va-checkbox').should.exist;
    cy.get('va-checkbox').get('input').should('not.have.attr', 'checked');
  });
  it('focus is on checkbox', () => {
    cy.mount(<TestCheckBox />);

    cy.focused().then(($el) => {
      console.log($el);
    })


    // Check if focus is on the checkbox
    cy.focused().should('have.attr', 'name', 'checkbox');
  });
});
