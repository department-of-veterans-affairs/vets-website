import { mount } from 'cypress/react';
import '../../../../site-wide/wc-loader';

Cypress.Commands.add('mount', (component, options) => {
  return mount(component, options);
});
