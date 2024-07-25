import { mount } from 'cypress/react'

Cypress.Commands.add('mount', (component, options) => {
  return mount(component, options)
});

