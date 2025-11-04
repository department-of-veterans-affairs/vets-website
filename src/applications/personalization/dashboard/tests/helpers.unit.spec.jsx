import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  FORM_DESCRIPTIONS,
  MY_VA_SIP_FORMS,
  VA_FORM_IDS,
} from '~/platform/forms/constants';
import * as formHelpers from '~/platform/forms/helpers';
import * as recordEventModule from '~/platform/monitoring/record-event';

import {
  normalizeSubmissionStatus,
  formatSubmissionDisplayStatus,
  isSIPEnabledForm,
  filterOutExpiredForms,
  sipFormSorter,
  formatFormTitle,
  recordDashboardClick,
  renderWidgetDowntimeNotification,
  sortStatementsByDate,
  getLatestCopay,
  presentableFormIDs,
} from '../helpers';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form.id]).to.exist;
      });
    });
  });

  describe('MY_VA_SIP_FORMS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(form.description).to.exist;
      });
    });
  });

  describe('normalizeSubmissionStatus', () => {
    it('throws TypeError if no string is provided', () => {
      expect(normalizeSubmissionStatus).to.throw(TypeError);
    });

    it('should normalize "actionNeeded" from api submission status', () => {
      ['error', 'expired'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('actionNeeded');
      });
    });

    it('should normalize "received" from api submission status', () => {
      ['VBMS'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('received');
      });
    });

    it('should normalize "inProgress" from api submission status', () => {
      ['pending', 'uploaded', 'received', 'processing', 'success'].forEach(
        value => {
          expect(normalizeSubmissionStatus(value)).to.equal('inProgress');
        },
      );
    });
  });

  describe('formatSubmissionDisplayStatus', () => {
    it('returns undefind with unknownn api status', () => {
      expect(formatSubmissionDisplayStatus()).to.be.undefined;
    });

    it('returns xpcted strigs from normalized submission status', () => {
      expect(formatSubmissionDisplayStatus('inProgress')).to.equal(
        'Submission in Progress',
      );
      expect(formatSubmissionDisplayStatus('actionNeeded')).to.equal(
        'Action Needed',
      );
      expect(formatSubmissionDisplayStatus('received')).to.equal('Received');
    });
  });

  describe('isSIPEnabledForm', () => {
    let sandbox;
    let getFormLinkStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      getFormLinkStub = sandbox.stub(formHelpers, 'getFormLink');
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('when foundForm exists but foundForm.title is falsy', () => {
      it('should return false', () => {
        getFormLinkStub.returns('http://example.com/form');
        // Note: Testing the branch where foundForm.title is falsy is odd because
        // MY_VA_SIP_FORMS is a constant and all forms have valid titles. However we can
        // verify the logic by testing with a form that doesn't exist in MY_VA_SIP_FORMS.
        // When foundForm is undefined, foundForm?.title is undefined (falsy), which triggers
        // the same branch: `!foundForm?.title` evaluates to true, causing the function to return false.
        // This tests the falsy title branch logic even though we can't create a form with
        // an explicit falsy title value.
        const savedForm = {
          form: 'NON_EXISTENT_FORM_ID',
        };

        const result = isSIPEnabledForm(savedForm);
        expect(result).to.be.false;
      });
    });

    describe('when foundForm exists but getFormLink returns falsy', () => {
      it('should return false', () => {
        getFormLinkStub.returns(null);
        const savedForm = {
          form: VA_FORM_IDS.FORM_10_10EZ,
        };

        const result = isSIPEnabledForm(savedForm);
        expect(result).to.be.false;
      });

      it('should return false when getFormLink returns empty string', () => {
        getFormLinkStub.returns('');
        const savedForm = {
          form: VA_FORM_IDS.FORM_10_10EZ,
        };

        const result = isSIPEnabledForm(savedForm);
        expect(result).to.be.false;
      });
    });

    describe('when foundForm is falsy (form not found in MY_VA_SIP_FORMS)', () => {
      it('should return false (error on line 42 is unreachable)', () => {
        getFormLinkStub.returns('http://example.com/form');
        const savedForm = {
          form: 'NON_EXISTENT_FORM_ID',
        };

        // Note: When foundForm is falsy, the check on line 38
        // (!foundForm?.title || !getFormLink(formNumber)) evaluates to true
        // because !foundForm?.title is true when foundForm is undefined.
        // This causes the function to return false on line 39, before reaching
        // the error throw on line 42. The error throw is unreachable code.
        const result = isSIPEnabledForm(savedForm);
        expect(result).to.be.false;
      });
    });

    describe('when form is valid and enabled', () => {
      it('should return true', () => {
        getFormLinkStub.returns('http://example.com/form');
        const savedForm = {
          form: VA_FORM_IDS.FORM_10_10EZ,
        };

        const result = isSIPEnabledForm(savedForm);
        expect(result).to.be.true;
      });
    });
  });

  describe('filterOutExpiredForms', () => {
    describe('when expiresAt is a number (seconds since epoch)', () => {
      it('should return true for future dates', () => {
        const futureTimestamp = Math.floor(Date.now() / 1000) + 86400; // 1 day in future
        const savedForm = {
          metadata: {
            expiresAt: futureTimestamp,
          },
        };

        const result = filterOutExpiredForms(savedForm);
        expect(result).to.be.true;
      });

      it('should return false for past dates', () => {
        const pastTimestamp = Math.floor(Date.now() / 1000) - 86400; // 1 day in past
        const savedForm = {
          metadata: {
            expiresAt: pastTimestamp,
          },
        };

        const result = filterOutExpiredForms(savedForm);
        expect(result).to.be.false;
      });
    });

    describe('when expiresAt is a string (date parsing path)', () => {
      it('should return true for future date strings', () => {
        const futureDate = new Date(Date.now() + 86400000); // 1 day in future
        const savedForm = {
          metadata: {
            expiresAt: futureDate.toISOString(),
          },
        };

        const result = filterOutExpiredForms(savedForm);
        expect(result).to.be.true;
      });

      it('should return false for past date strings', () => {
        const pastDate = new Date(Date.now() - 86400000); // 1 day in past
        const savedForm = {
          metadata: {
            expiresAt: pastDate.toISOString(),
          },
        };

        const result = filterOutExpiredForms(savedForm);
        expect(result).to.be.false;
      });
    });
  });

  describe('sipFormSorter', () => {
    describe('error handling', () => {
      it('should throw TypeError when arg is not a plain object', () => {
        const validForm = {
          metadata: {
            expiresAt: 1000,
          },
        };

        expect(() => sipFormSorter(validForm, 'not an object')).to.throw(
          TypeError,
          'not an object is not a plain object',
        );
      });

      it('should throw TypeError when arg.metadata is missing', () => {
        const validForm = {
          metadata: {
            expiresAt: 1000,
          },
        };
        const formWithoutMetadata = {};

        expect(() => sipFormSorter(validForm, formWithoutMetadata)).to.throw(
          TypeError,
          "'metadata.expiresAt' is not set on",
        );
      });

      it('should throw TypeError when arg.metadata.expiresAt is missing', () => {
        const validForm = {
          metadata: {
            expiresAt: 1000,
          },
        };
        const formWithoutExpiresAt = {
          metadata: {},
        };

        expect(() => sipFormSorter(validForm, formWithoutExpiresAt)).to.throw(
          TypeError,
          "'metadata.expiresAt' is not set on",
        );
      });

      it('should throw TypeError when arg.metadata.expiresAt is not a number', () => {
        const validForm = {
          metadata: {
            expiresAt: 1000,
          },
        };
        const formWithStringExpiresAt = {
          metadata: {
            expiresAt: '1000', // string instead of number
          },
        };

        expect(() =>
          sipFormSorter(validForm, formWithStringExpiresAt),
        ).to.throw(TypeError, "'metadata.expiresAt' is not set on");
      });
    });

    describe('when both forms are valid', () => {
      it('should sort forms by expiresAt (earlier first)', () => {
        const formA = {
          metadata: {
            expiresAt: 2000,
          },
        };
        const formB = {
          metadata: {
            expiresAt: 1000,
          },
        };

        const result = sipFormSorter(formA, formB);
        expect(result).to.equal(1000); // 2000 - 1000 = 1000 (positive means formA expires later)
      });

      it('should sort forms by expiresAt (later first)', () => {
        const formA = {
          metadata: {
            expiresAt: 1000,
          },
        };
        const formB = {
          metadata: {
            expiresAt: 2000,
          },
        };

        const result = sipFormSorter(formA, formB);
        expect(result).to.equal(-1000); // formA expires first, so negative number
      });
    });
  });

  describe('formatFormTitle', () => {
    it('should use default empty string parameter when title is undefined', () => {
      const result = formatFormTitle(undefined);
      expect(result).to.equal('');
    });

    it('should format title correctly when title is provided', () => {
      const result = formatFormTitle('form 10-10ez');
      expect(result).to.equal('Form 10-10EZ');
    });
  });

  describe('recordDashboardClick', () => {
    let sandbox;
    let recordEventStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      recordEventStub = sandbox.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should use default actionType parameter "view-link" when not provided', () => {
      const product = 'test-product';
      const clickHandler = recordDashboardClick(product);

      clickHandler();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'dashboard-navigation',
        'dashboard-action': 'view-link',
        'dashboard-product': product,
      });
    });

    it('should use provided actionType when provided', () => {
      const product = 'test-product';
      const actionType = 'custom-action';
      const clickHandler = recordDashboardClick(product, actionType);

      clickHandler();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'dashboard-navigation',
        'dashboard-action': actionType,
        'dashboard-product': product,
      });
    });
  });

  describe('renderWidgetDowntimeNotification', () => {
    it('should render downtime notification when downtime.status === "down"', () => {
      const appName = 'Test App';
      const sectionTitle = 'Test Section';
      const downtime = {
        status: 'down',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T14:00:00Z',
      };
      const children = <div data-testid="children">Children content</div>;

      const renderer = renderWidgetDowntimeNotification(appName, sectionTitle);
      const { container, queryByTestId } = render(renderer(downtime, children));

      expect(container.querySelector('h2')).to.exist;
      expect(container.querySelector('h2').textContent).to.equal(sectionTitle);
      expect(container.querySelector('va-alert')).to.exist;
      expect(container.querySelector('h4.usa-alert-heading')).to.exist;
      expect(
        container.querySelector('h4.usa-alert-heading').textContent,
      ).to.include(`${appName} is down for maintenance`);
      expect(queryByTestId('children')).to.be.null;
    });

    it('should return children when downtime.status is not "down"', () => {
      const appName = 'Test App';
      const sectionTitle = 'Test Section';
      const downtime = {
        status: 'up',
      };
      const children = <div data-testid="children">Children content</div>;

      const renderer = renderWidgetDowntimeNotification(appName, sectionTitle);
      const { getByTestId } = render(renderer(downtime, children));

      expect(getByTestId('children')).to.exist;
    });
  });

  describe('sortStatementsByDate', () => {
    it('should sort statements by date in descending order (newest first)', () => {
      const statements = [
        { pSStatementDateOutput: '01/15/2024', id: '1' },
        { pSStatementDateOutput: '03/20/2024', id: '2' },
        { pSStatementDateOutput: '02/10/2024', id: '3' },
      ];

      const result = sortStatementsByDate(statements);

      expect(result[0].id).to.equal('2'); // March 20 (newest)
      expect(result[1].id).to.equal('3'); // February 10
      expect(result[2].id).to.equal('1'); // January 15 (oldest)
    });

    it('should handle empty array', () => {
      const statements = [];

      const result = sortStatementsByDate(statements);

      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });

    it('should handle single statement', () => {
      const statements = [{ pSStatementDateOutput: '01/15/2024', id: '1' }];

      const result = sortStatementsByDate(statements);

      expect(result.length).to.equal(1);
      expect(result[0].id).to.equal('1');
    });
  });

  describe('getLatestCopay', () => {
    it('should return null when statements is null', () => {
      const result = getLatestCopay(null);
      expect(result).to.be.null;
    });

    it('should return null when statements is undefined', () => {
      const result = getLatestCopay(undefined);
      expect(result).to.be.null;
    });

    it('should return acc when statement does not have pSStatementDateOutput', () => {
      const statements = [
        { pSStatementDateOutput: '01/15/2024', id: '1' },
        { id: '2' }, // No pSStatementDateOutput - should return acc (statement 1)
        { pSStatementDateOutput: '03/20/2024', id: '3' },
      ];

      const result = getLatestCopay(statements);

      // Should return the latest statement with a date (id: '3')
      // Statement 2 without date should not affect the result, just returns acc
      expect(result.id).to.equal('3');
      expect(result.pSStatementDateOutput).to.equal('03/20/2024');
    });

    it('should return acc (existing latest) when encountering statement without pSStatementDateOutput', () => {
      const statements = [
        { pSStatementDateOutput: '03/20/2024', id: 'latest' },
        { id: 'no-date' }, // No pSStatementDateOutput - should return acc (latest)
      ];

      const result = getLatestCopay(statements);

      // Should return the latest statement with a date, not replace with the one without date
      expect(result.id).to.equal('latest');
      expect(result.pSStatementDateOutput).to.equal('03/20/2024');
    });

    it('should return the latest copay by date', () => {
      const statements = [
        { pSStatementDateOutput: '01/15/2024', id: '1' },
        { pSStatementDateOutput: '03/20/2024', id: '2' },
        { pSStatementDateOutput: '02/10/2024', id: '3' },
      ];

      const result = getLatestCopay(statements);

      expect(result.id).to.equal('2'); // March 20 is the latest
    });

    it('should return null when no statements have pSStatementDateOutput', () => {
      const statements = [{ id: '1' }, { id: '2' }, { id: '3' }];

      const result = getLatestCopay(statements);

      expect(result).to.be.null;
    });
  });

  describe('presentableFormIDs', () => {
    it('should format FEEDBACK_TOOL as "FEEDBACK TOOL"', () => {
      expect(presentableFormIDs[VA_FORM_IDS.FEEDBACK_TOOL]).to.equal(
        'FEEDBACK TOOL',
      );
    });

    it('should format FORM_10_10EZ as "FORM 10-10EZ"', () => {
      expect(presentableFormIDs[VA_FORM_IDS.FORM_10_10EZ]).to.equal(
        'FORM 10-10EZ',
      );
    });

    it('should format FORM_21P_530EZ as "FORM 21P-530EZ"', () => {
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_530EZ]).to.equal(
        'FORM 21P-530EZ',
      );
    });

    it('should format forms with "-UPLOAD" suffix by removing "-UPLOAD" and prefixing with "FORM"', () => {
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0779_UPLOAD]).to.equal(
        'FORM 21-0779',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4192_UPLOAD]).to.equal(
        'FORM 21-4192',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21_509_UPLOAD]).to.equal(
        'FORM 21-509',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21_686C_UPLOAD]).to.equal(
        'FORM 21-686C',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_530A_UPLOAD]).to.equal(
        'FORM 21P-530a',
      );
    });

    it('should format other forms by prefixing with "FORM"', () => {
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21_526EZ]).to.equal(
        'FORM 21-526EZ',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_10_10D]).to.equal(
        'FORM 10-10D',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_22_1990]).to.equal(
        'FORM 22-1990',
      );
      expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_527EZ]).to.equal(
        'FORM 21P-527EZ',
      );
    });
  });
});
