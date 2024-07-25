import React from 'react';

import TestCheckBox from '../TestCheckBox';

describe('TestCheckBox', () => {
  it('mounts', () => {
    cy.mount(<TestCheckBox />);
    cy.get('va-checkbox').should('have.text', 'foo');
  });
});
