import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import Timeouts from 'platform/testing/e2e/timeouts';
import { getPastItf, fetchItf } from './cypress.helpers';
import cypressSetup from './cypress.setup';
import mockUser from './fixtures/mocks/user.json';
import inProgressMock from './fixtures/mocks/get-in-progress';
import { MAX_SELECTED_ERROR } from '../constants';

const preventMaxSelections = ({
  baseUrl,
  contestableApi,
  formId,
  inProgressVersion,
  data,
  mockInProgress,
}) => {
  describe('Max selections alert shows', () => {
    beforeEach(() => {
      setStoredSubTask({ benefitType: 'compensation' }); // HLR & SC
      cypressSetup();

      cy.intercept('GET', contestableApi, {
        data: [],
      }).as('getIssues');
      cy.intercept('PUT', `/v0/in_progress_forms/${formId}`, mockInProgress);
      cy.intercept(
        'GET',
        `/v0/in_progress_forms/${formId}`,
        inProgressMock({ data, version: 3, returnUrl: '/contestable-issues' }),
      );
      cy.intercept('GET', '/v0/intent_to_file', fetchItf()); // 995 only
      cy.intercept('GET', '/v0/feature_toggles*', {});

      cy.visit(baseUrl);
      cy.injectAxeThenAxeCheck();
    });

    it('Allows continuing application when submit services are down for maintenance', () => {
      const user = {
        ...mockUser,
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            ...mockUser.data.attributes,
            // set in progress returnUrl to review and submit page
            inProgressForms: [
              {
                form: formId,
                metadata: inProgressMock({
                  version: inProgressVersion,
                  returnUrl: '/contestable-issues',
                }).metadata,
                lastUpdated: 1715357232,
              },
            ],
          },
        },
      };
      cypressSetup({ user });
      cy.reload();

      cy.get('va-button[data-testid="continue-your-application"]').click();

      // go to contestable issues page
      cy.location('pathname')
        .should('contain', `/contestable-issues`)
        .then(() => {
          if (formId === '20-0995') {
            getPastItf(cy);
          }
        });

      cy.get('va-checkbox#root_contestedIssues_0').as('issueCheckbox');

      cy.get('@issueCheckbox')
        .should('not.be.checked')
        .click();

      cy.get('va-modal[visible]:not([visible="false"])', {
        timeout: Timeouts.slow,
      })
        .should('have.attr', 'modal-title', MAX_SELECTED_ERROR)
        .and('be.visible');

      cy.realPress('Escape'); // close modal
      cy.get('@issueCheckbox').should('not.be.checked');

      // Focus should go to the clicked input; but ends up on the can't find any
      // eligible issues alert
      // cy.get(':focus').should('have.id', 'root_contestedIssues_0');

      cy.injectAxeThenAxeCheck();
    });
  });
};
export default preventMaxSelections;
