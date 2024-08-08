import { generateUser } from '../../../mocks/api/user';

class LandingPage {
  constructor() {
    this.pageUrl = '/my-health/';
  }

  validatePageLoaded = () =>
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;

  loaded = () => this.validatePageLoaded();

  secondaryNav = () => cy.findByRole('navigation', { name: 'My HealtheVet' });

  secondaryNavRendered = () => this.secondaryNav().should.exist;

  validateURL = () => cy.url().should('match', /\/my-health\/$/);

  visitPage = ({
    verified = true,
    registered = true,
    mhvAccountState = 'OK',
  } = {}) => {
    let props = { mhvAccountState };
    if (!verified) props = { ...props, loa: 1 };
    if (!registered) props = { ...props, vaPatient: false };
    const user = generateUser(props);
    cy.login(user);
    cy.visit(this.pageUrl);
    this.loaded();
    this.validateURL();
  };

  visit = props => this.visitPage(props);
}

export default new LandingPage();
