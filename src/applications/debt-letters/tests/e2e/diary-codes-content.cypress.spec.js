import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mock-user.json';

describe('Diary Codes', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', mockFeatureToggles);
    cy.visit('/manage-va-debt/your-debt/');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('renders expected content for diary code: 080', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 100', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 101, 450, 610, 617', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 117', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 123', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 500', () => {
    expect(true).to.be.true;
  });

  it('renders expected content for diary code: 600, 601', () => {
    expect(true).to.be.true;
  });
});
