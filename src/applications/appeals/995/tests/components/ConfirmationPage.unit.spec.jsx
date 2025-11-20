import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ConfirmationPage from '../../components/ConfirmationPage';
import comprehensiveTest from '../fixtures/data/pre-api-comprehensive-test.json';
import noEvidenceTest from '../fixtures/data/pre-api-no-evidence-test.json';
import { verifyHeader } from '../unit-test-helpers';
import { title995 } from '../../content/title';
import { content as evidenceSummaryContent } from '../../content/evidence/summary';

describe('ConfirmationPage', () => {
  const makeStore = data => ({
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({
      user: {
        profile: {
          userFullName: {
            first: 'Michael',
            middle: 'Thomas',
            last: 'Wazowski',
            suffix: 'Esq.',
          },
          dob: '1990-02-03',
        },
      },
      form: {
        formId: '20-0995',
        submission: {
          response: new Date().toISOString(),
        },
        data,
      },
    }),
  });

  const createConfirmationPage = data => {
    return render(
      <Provider store={makeStore(data)}>
        <ConfirmationPage />
      </Provider>,
    );
  };

  describe('when evidence is present', () => {
    it('should render the proper content', () => {
      const { container } = createConfirmationPage(comprehensiveTest.data);

      const h2s = $$('h2', container);
      const h3s = $$('h3', container);
      const h4s = $$('h4', container);

      verifyHeader(h2s, 0, title995);
      expect($$('va-alert[status="success"]', container)).to.exist;
      verifyHeader(h3s, 0, 'Print this confirmation page');
      verifyHeader(h3s, 1, 'Personal information');
      verifyHeader(h3s, 2, 'Issues for review');

      // Check 5103
      const response5103 = $$(
        '[data-testid="confirmation-form-5103"]',
        container,
      )?.[0];

      expect(response5103.textContent).to.equal('Yes, I certify');

      // Check facility types
      const facilityTypes = $$(
        '[data-testid="confirmation-facility-types"]',
        container,
      )?.[0];

      expect(facilityTypes.textContent).to.equal(
        'VA medical center (also called a VAMC), Community-based outpatient clinic (also called a CBOC), Department of Defense military treatment facility (also called an MTF), Community care provider paid for by VA, VA Vet Center, Private healthcare provider, and Some other type of provider',
      );

      // Evidence is present, validate that "no evidence" header is not there
      const noEvidenceHeader = $$(
        '[data-testid="confirmation-no-evidence-header"]',
      );

      expect(noEvidenceHeader.length).to.equal(0);

      // Evidence
      verifyHeader(h4s, 0, evidenceSummaryContent.vaTitle);
      verifyHeader(h4s, 1, evidenceSummaryContent.privateTitle);
      verifyHeader(h4s, 2, evidenceSummaryContent.otherTitle);

      // VHA / MST
      expect(h3s.includes('VHA indicator'));

      const responseMst = $$(
        '[data-testid="confirmation-mst-response"]',
        container,
      )?.[0];

      expect(responseMst.textContent).to.equal('Yes');

      const indicatorMst = $$(
        '[data-testid="confirmation-mst-option-indicator"]',
        container,
      )?.[0];

      expect(indicatorMst.textContent).to.equal(
        'I gave permission in the past, but I want to revoke (or cancel) my permission',
      );
    });
  });

  describe('when no evidence is present', () => {
    it('should render the proper content', () => {
      const { container } = createConfirmationPage(noEvidenceTest.data);

      const h2s = $$('h2', container);
      const h3s = $$('h3', container);

      verifyHeader(h2s, 0, title995);
      expect($$('va-alert[status="success"]', container)).to.exist;
      verifyHeader(h3s, 0, 'Print this confirmation page');
      verifyHeader(h3s, 1, 'Personal information');
      verifyHeader(h3s, 2, 'Issues for review');

      // Check 5103
      const response5103 = $$(
        '[data-testid="confirmation-form-5103"]',
        container,
      )?.[0];

      expect(response5103.textContent).to.equal('Yes, I certify');

      // Check facility types
      const facilityTypes = $$(
        '[data-testid="confirmation-facility-types"]',
        container,
      )?.[0];

      expect(facilityTypes.textContent).to.equal('None selected');

      const noEvidenceHeader = $$('.no-evidence', container)?.[0];

      expect(noEvidenceHeader.textContent).to.equal(
        evidenceSummaryContent.missingEvidenceReviewText,
      );

      // VHA / MST
      expect(h3s.includes('VHA indicator'));

      const responseMst = $$(
        '[data-testid="confirmation-mst-response"]',
        container,
      )?.[0];

      expect(responseMst.textContent).to.equal('Yes');

      const indicatorMst = $$(
        '[data-testid="confirmation-mst-option-indicator"]',
        container,
      )?.[0];

      expect(indicatorMst.textContent).to.equal(
        'I gave permission in the past, but I want to revoke (or cancel) my permission',
      );
    });
  });
});
