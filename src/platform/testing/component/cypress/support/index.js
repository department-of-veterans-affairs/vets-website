import { mount } from 'cypress/react'
import '../../../../site-wide/wc-loader.js';

Cypress.Commands.add('mount', (component, options) => {
  return mount(component, options)
});
