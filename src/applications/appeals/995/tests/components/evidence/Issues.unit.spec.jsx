import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { content as evidenceVaContent } from '../../../content/evidence/vaDetails';
import { content as evidencePrivateContent } from '../../../content/evidencePrivateRecords';
import EvidenceIssues from '../../../components/evidence/Issues';
import { NO_ISSUES_SELECTED } from '../../../constants';

const showErrorSpy = sinon.spy();
const emptyData = {
  issues: [],
  locationAndName: '',
  treatmentDate: '',
};

const availableIssues = ['Hypertension', 'Right Knee Injury', 'ADHD'];

describe('EvidenceIssues', () => {
  describe('when there are no available issues', () => {
    it('should render the proper content', () => {
      const screen = render(
        <EvidenceIssues
          availableIssues={[]}
          content={evidenceVaContent}
          currentData={emptyData}
          handlers={{}}
          showError={showErrorSpy}
        />,
      );

      expect(screen.getByText(NO_ISSUES_SELECTED)).to.exist;
    });
  });

  describe('for VA evidence', () => {
    describe('before the form has been filled out', () => {
      it('should render the proper content', () => {
        const { container } = render(
          <EvidenceIssues
            availableIssues={availableIssues}
            content={evidenceVaContent}
            currentData={emptyData}
            handlers={{}}
            showError={showErrorSpy}
          />,
        );

        const checkboxParent = $('va-checkbox-group', container);
        const checkboxes = $$('va-checkboxes', container);

        expect(checkboxParent.label).to.equal(evidenceVaContent.issuesLabel);

        checkboxes.forEach((checkbox, index) => {
          expect(checkbox)
            .getAttribute('label')
            .to.eq(availableIssues[index]);

          expect(checkbox)
            .getAttribute('checked')
            .to.eq(false);
        });
      });
    });

    describe('when the form has been filled out', () => {
      it('should render the proper content', () => {
        const filledData = {
          issues: availableIssues,
          locationAndName: 'South Texas VA Facility',
          noDate: undefined,
          treatmentDate: '2001-01',
        };

        const { container } = render(
          <EvidenceIssues
            availableIssues={availableIssues}
            content={evidenceVaContent}
            currentData={filledData}
            handlers={{}}
            showError={showErrorSpy}
          />,
        );

        const checkboxParent = $('va-checkbox-group', container);
        const checkboxes = $$('va-checkboxes', container);

        expect(checkboxParent.label).to.equal(evidenceVaContent.issuesLabel);

        checkboxes.forEach((checkbox, index) => {
          expect(checkbox)
            .getAttribute('label')
            .to.eq(availableIssues[index]);

          expect(checkbox)
            .getAttribute('checked')
            .to.eq(true);
        });
      });
    });
  });

  describe('for non-VA evidence', () => {
    describe('before the form has been filled out', () => {
      it('should render the proper content', () => {
        const { container } = render(
          <EvidenceIssues
            availableIssues={availableIssues}
            content={evidencePrivateContent}
            currentData={emptyData}
            handlers={{}}
            showError={showErrorSpy}
          />,
        );

        const checkboxParent = $('va-checkbox-group', container);
        const checkboxes = $$('va-checkboxes', container);

        expect(checkboxParent.label).to.equal(
          evidencePrivateContent.issuesLabel,
        );

        checkboxes.forEach((checkbox, index) => {
          expect(checkbox)
            .getAttribute('label')
            .to.eq(availableIssues[index]);

          expect(checkbox)
            .getAttribute('checked')
            .to.eq(false);
        });
      });
    });

    describe('when the form has been filled out', () => {
      it('should render the proper content', () => {
        const filledData = {
          issues: availableIssues,
          locationAndName: 'South Texas VA Facility',
          noDate: undefined,
          treatmentDate: '2001-01',
        };

        const { container } = render(
          <EvidenceIssues
            availableIssues={availableIssues}
            content={evidencePrivateContent}
            currentData={filledData}
            handlers={{}}
            showError={showErrorSpy}
          />,
        );

        const checkboxParent = $('va-checkbox-group', container);
        const checkboxes = $$('va-checkboxes', container);

        expect(checkboxParent.label).to.equal(
          evidencePrivateContent.issuesLabel,
        );

        checkboxes.forEach((checkbox, index) => {
          expect(checkbox)
            .getAttribute('label')
            .to.eq(availableIssues[index]);

          expect(checkbox)
            .getAttribute('checked')
            .to.eq(true);
        });
      });
    });
  });
});
