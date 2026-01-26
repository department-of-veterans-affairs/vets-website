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
    describe('branch: formID === VA_FORM_IDS.FEEDBACK_TOOL', () => {
      it('should format FEEDBACK_TOOL as "FEEDBACK TOOL"', () => {
        expect(presentableFormIDs[VA_FORM_IDS.FEEDBACK_TOOL]).to.equal(
          'FEEDBACK TOOL',
        );
      });
    });

    describe('branch: formID === VA_FORM_IDS.FORM_10_10EZ', () => {
      it('should format FORM_10_10EZ as "FORM 10-10EZ"', () => {
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_10EZ]).to.equal(
          'FORM 10-10EZ',
        );
      });
    });

    describe('branch: formID === VA_FORM_IDS.FORM_21P_530EZ (line 24)', () => {
      it('should format FORM_21P_530EZ as "FORM 21P-530EZ"', () => {
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_530EZ]).to.equal(
          'FORM 21P-530EZ',
        );
      });
    });

    describe('branch: formID.includes("-UPLOAD")', () => {
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
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_4185_UPLOAD]).to.equal(
          'FORM 21P-4185',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_651_UPLOAD]).to.equal(
          'FORM 21-651',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0304_UPLOAD]).to.equal(
          'FORM 21-0304',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_8960_UPLOAD]).to.equal(
          'FORM 21-8960',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_4706C_UPLOAD]).to.equal(
          'FORM 21P-4706c',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4140_UPLOAD]).to.equal(
          'FORM 21-4140',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_4718A_UPLOAD]).to.equal(
          'FORM 21P-4718a',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4193_UPLOAD]).to.equal(
          'FORM 21-4193',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0788_UPLOAD]).to.equal(
          'FORM 21-0788',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_8951_2_UPLOAD]).to.equal(
          'FORM 21-8951-2',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_674B_UPLOAD]).to.equal(
          'FORM 21-674b',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_2680_UPLOAD]).to.equal(
          'FORM 21-2680',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_8940_UPLOAD]).to.equal(
          'FORM 21-8940',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_0516_1_UPLOAD]).to.equal(
          'FORM 21P-0516-1',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_0517_1_UPLOAD]).to.equal(
          'FORM 21P-0517-1',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_0518_1_UPLOAD]).to.equal(
          'FORM 21P-0518-1',
        );
        expect(
          presentableFormIDs[VA_FORM_IDS.FORM_21P_0519C_1_UPLOAD],
        ).to.equal('FORM 21P-0519C-1');
        expect(
          presentableFormIDs[VA_FORM_IDS.FORM_21P_0519S_1_UPLOAD],
        ).to.equal('FORM 21P-0519S-1');
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_8049_UPLOAD]).to.equal(
          'FORM 21P-8049',
        );
      });
    });

    describe('else branch: default "FORM {formID}"', () => {
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
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_7959A]).to.equal(
          'FORM 10-7959A',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_7959C]).to.equal(
          'FORM 10-7959C',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_7959F_1]).to.equal(
          'FORM 10-7959F-1',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_7959F_2]).to.equal(
          'FORM 10-7959F-2',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10182]).to.equal(
          'FORM 10182',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_1330M]).to.equal(
          'FORM 40-1330M',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_1330M2]).to.equal(
          'FORM 40-1330M2',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_20_0995]).to.equal(
          'FORM 20-0995',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_20_0996]).to.equal(
          'FORM 20-0996',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_20_10206]).to.equal(
          'FORM 20-10206',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_20_10207]).to.equal(
          'FORM 20-10207',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0845]).to.equal(
          'FORM 21-0845',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0966]).to.equal(
          'FORM 21-0966',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0972]).to.equal(
          'FORM 21-0972',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_10210]).to.equal(
          'FORM 21-10210',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_22]).to.equal(
          'FORM 21-22',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_22A]).to.equal(
          'FORM 21-22a',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4142]).to.equal(
          'FORM 21-4142',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_686CV2]).to.equal(
          'FORM 686C-674',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_0847]).to.equal(
          'FORM 21P-0847',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_0994]).to.equal(
          'FORM 22-0994',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10203]).to.equal(
          'FORM 22-10203',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10215]).to.equal(
          'FORM 22-10215',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10282]).to.equal(
          'FORM 22-10282',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_1990EZ]).to.equal(
          'FORM 22-1990EZ',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_1995]).to.equal(
          'FORM 22-1995',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_26_1880]).to.equal(
          'FORM 26-1880',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_26_4555]).to.equal(
          'FORM 26-4555',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_27_8832]).to.equal(
          'FORM 27-8832',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_28_1900]).to.equal(
          'FORM 28-1900',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_28_8832]).to.equal(
          'FORM 28-8832',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_40_0247]).to.equal(
          'FORM 40-0247',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_40_10007]).to.equal(
          'FORM 40-10007',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_5655]).to.equal('FORM 5655');
        expect(presentableFormIDs[VA_FORM_IDS.FORM_DISPUTE_DEBT]).to.equal(
          'FORM DISPUTE-DEBT',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_VA_2346A]).to.equal(
          'FORM MDOT',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10216]).to.equal(
          'FORM 22-10216',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_10_10D_EXTENDED]).to.equal(
          'FORM 10-10D-EXTENDED',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0538]).to.equal(
          'FORM 21-0538',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10297]).to.equal(
          'FORM 22-10297',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_0839]).to.equal(
          'FORM 22-0839',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_22_10275]).to.equal(
          'FORM 22-10275',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_40_4962]).to.equal(
          'FORM 40-4962',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4140]).to.equal(
          'FORM 21-4140',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_2680]).to.equal(
          'FORM 21-2680',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_8940]).to.equal(
          'FORM 21-8940',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_4192]).to.equal(
          'FORM 21-4192',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21_0779]).to.equal(
          'FORM 21-0779',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_530A]).to.equal(
          'FORM 21P-530A',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_0537]).to.equal(
          'FORM 21P-0537',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_8416]).to.equal(
          'FORM 21P-8416',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_534EZ]).to.equal(
          'FORM 21P-534EZ',
        );
        expect(presentableFormIDs[VA_FORM_IDS.FORM_21P_601]).to.equal(
          'FORM 21P-601',
        );
      });
    });
  });
});
