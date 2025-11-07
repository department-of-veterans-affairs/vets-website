import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { records } from '../../data/evidence-records';
import Summary from '../../../components/evidence/Summary';
import { content } from '../../../content/evidence/summary';
import {
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  EVIDENCE_VA_PROMPT_URL,
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
} from '../../../constants';
import {
  clickBack,
  clickContinue,
  verifyHeader,
  verifyLink,
} from '../../unit-test-helpers';

const clickUpdatePage = container => {
  fireEvent.click($('.form-nav-buttons va-button', container));
};

const setupSummary = ({
  vaMR = true,
  privateMR = true,
  other = true,
  limit,
  privacy = true,
  goBack = () => {},
  goForward = () => {},
  setFormData = () => {},
  onReviewPage = false,
  updatePage = () => {},
  list = records(),
} = {}) =>
  render(
    <div>
      <Summary
        data={{
          [HAS_VA_EVIDENCE]: vaMR,
          [HAS_PRIVATE_EVIDENCE]: privateMR,
          [HAS_OTHER_EVIDENCE]: other,
          ...list,
          privacyAgreementAccepted: privacy,
          [HAS_PRIVATE_LIMITATION]: limit?.length > 0,
          limitedConsent: limit,
        }}
        goBack={goBack}
        goForward={goForward}
        setFormData={setFormData}
        contentBeforeButtons="testing"
        contentAfterButtons="after"
        onReviewPage={onReviewPage}
        updatePage={updatePage}
        testing
      />
    </div>,
  );

describe('Summary', () => {
  describe('on the evidence summary page', () => {
    it('should render the proper content', () => {
      const { container } = render(
        <Summary
          data={{
            [HAS_VA_EVIDENCE]: true,
            [HAS_PRIVATE_EVIDENCE]: true,
            [HAS_OTHER_EVIDENCE]: true,
            ...records(),
            privacyAgreementAccepted: true,
            [HAS_PRIVATE_LIMITATION]: true,
            limitedConsent: 'Limited consent details',
          }}
          goBack={() => {}}
          goForward={() => {}}
          setFormData={() => {}}
          contentBeforeButtons={
            <p data-testid="before-buttons">Content before buttons</p>
          }
          contentAfterButtons={
            <p data-testid="after-buttons">Content after buttons</p>
          }
          onReviewPage={false}
          updatePage={() => {}}
          testing
        />,
      );

      const h3s = $$('h3', container);
      const h4s = $$('h4', container);

      verifyHeader(h3s, 0, content.summaryTitle);
      expect($$('va-alert[visible="false"]', container)).to.exist;
      expect($$('va-modal[visible="false"]', container)).to.exist;

      verifyHeader(h4s, 0, content.vaTitle);
      verifyHeader(h4s, 1, content.privateTitle);
      verifyHeader(h4s, 2, content.otherTitle);

      verifyLink(
        '[data-testid="add-more-evidence-link"]',
        `/${EVIDENCE_VA_PROMPT_URL}`,
      );

      expect(
        $$('[data-testid="before-buttons"]', container)[0].textContent,
      ).to.eq('Content before buttons');
      expect(
        $$('[data-testid="after-buttons"]', container)[0].textContent,
      ).to.eq('Content after buttons');
    });

    it('should render the alert banner when there is no evidence', async () => {
      const goForward = sinon.spy();
      const { container } = setupSummary({
        list: {
          locations: [{}],
          providerFacility: [{}],
          additionalDocuments: [{}],
        },
        goForward,
      });

      expect($$('va-alert[visible="true"]', container)).to.exist;
    });

    it('should submit page without error', () => {
      const goForward = sinon.spy();
      const { container } = setupSummary({ goForward });

      clickContinue(container);

      expect(goForward.called).to.be.true;
    });

    it('should not navigate forward with errors', async () => {
      const goForward = sinon.spy();
      const list = records();
      list.locations[0].issues = [];

      const { container } = setupSummary({
        limit: 'Limited consent details',
        list,
        goForward,
      });

      clickContinue(container);

      waitFor(() => {
        expect(goForward.called).to.be.false;
      });
    });

    it('should navigate forward with not-included partial data', () => {
      const goForward = sinon.spy();
      const { container } = setupSummary({
        vaMR: false,
        privateMR: false,
        other: false,
        limit: 'Limited consent details',
        list: {
          locations: [{}],
          providerFacility: [{}],
          additionalDocuments: [{}],
        },
        goForward,
      });

      clickContinue(container);

      expect(goForward.called).to.be.true;
    });

    it('should call goBack to get to the private limitation page, even with errors', () => {
      const goBack = sinon.spy();
      const { container } = setupSummary({
        vaMR: false,
        privateMR: false,
        other: false,
        limit: 'Limited consent details',
        goBack,
      });

      clickBack(container);

      expect(goBack.called).to.be.true;
    });
  });

  describe('on the review and submit page', () => {
    it('should render the proper content', () => {
      const { container } = render(
        <Summary
          data={{
            [HAS_VA_EVIDENCE]: true,
            [HAS_PRIVATE_EVIDENCE]: true,
            [HAS_OTHER_EVIDENCE]: true,
            ...records(),
            privacyAgreementAccepted: true,
            [HAS_PRIVATE_LIMITATION]: true,
            limitedConsent: 'Limited consent details',
          }}
          goBack={() => {}}
          goForward={() => {}}
          setFormData={() => {}}
          contentBeforeButtons={
            <p data-testid="before-buttons">Content before buttons</p>
          }
          contentAfterButtons={
            <p data-testid="after-buttons">Content after buttons</p>
          }
          onReviewPage
          updatePage={() => {}}
          testing
        />,
      );

      const h4s = $$('h4', container);
      const h5s = $$('h5', container);

      verifyHeader(h4s, 0, content.summaryTitle);
      expect($$('va-alert[visible="false"]', container)).to.exist;
      expect($$('va-modal[visible="false"]', container)).to.exist;

      verifyHeader(h5s, 0, content.vaTitle);
      verifyHeader(h5s, 1, content.privateTitle);
      verifyHeader(h5s, 2, content.otherTitle);

      verifyLink(
        '[data-testid="add-more-evidence-link"]',
        `/${EVIDENCE_VA_PROMPT_URL}`,
      );

      expect($('va-button[label="Update evidence page"]', container)).to.exist;
    });

    it('should not update with errors', async () => {
      const updateSpy = sinon.spy();
      const list = records();
      list.locations[0].issues = [];

      const { container } = setupSummary({
        limit: 'Limited consent details',
        list,
        onReviewPage: true,
        updatePage: updateSpy,
      });

      await clickUpdatePage(container);

      waitFor(() => {
        expect(updateSpy.called).to.be.false;
      });
    });

    // Remove entries
    it('should remove second VA entry when remove is clicked', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });
      const result = records().locations[0];

      // remove second VA entry
      fireEvent.click(
        $('va-button[label="Remove Midwest Alabama VA Facility"]', container),
      );

      const modal = $('va-modal', container);
      modal.__events.primaryButtonClick(); // Remove entry

      await waitFor(() => {
        expect(setFormData.called).to.be.true;
        expect(setFormData.args[0][0].locations[0]).to.deep.equal(result);
      });
    });

    it('should not remove VA entry when "No" is selected in the modal', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });

      // remove second VA entry
      fireEvent.click(
        $('va-button[label="Remove Midwest Alabama VA Facility"]', container),
      );

      const secondaryButton = $('va-button[secondary]', container);
      fireEvent.click(secondaryButton);

      await waitFor(() => {
        expect(setFormData.called).to.be.false;
      });
    });

    it('should remove second private entry when remove is clicked', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });
      const result = records().providerFacility[0];

      // remove second private entry
      fireEvent.click($('va-button[label="Remove Provider Two"]', container));

      const modal = $('va-modal', container);
      modal.__events.primaryButtonClick(); // Remove entry

      await waitFor(() => {
        expect(setFormData.called).to.be.true;
        expect(setFormData.args[0][0].providerFacility[0]).to.deep.equal(
          result,
        );
      });
    });

    it('should not remove private entry when "No" is selected in the modal', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });

      // remove second VA entry
      fireEvent.click(
        $('va-button[label="Remove South Texas VA Facility"]', container),
      );

      const secondaryButton = $('va-button[secondary]', container);
      fireEvent.click(secondaryButton);

      await waitFor(() => {
        expect(setFormData.called).to.be.false;
      });
    });

    it('should remove second upload entry when remove is clicked', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });
      const result = records().additionalDocuments[0];

      // remove second upload entry
      fireEvent.click($('va-button[label="Delete x-rays.pdf"]', container));

      const modal = $('va-modal', container);
      modal.__events.primaryButtonClick(); // Remove entry

      await waitFor(() => {
        expect(setFormData.called).to.be.true;
        expect(setFormData.args[0][0].additionalDocuments[0]).to.deep.equal(
          result,
        );
      });
    });

    it('should not remove upload when "No" is selected in the modal', async () => {
      const setFormData = sinon.spy();
      const { container } = setupSummary({ setFormData });

      // remove second VA entry
      fireEvent.click(
        $('va-button[label="Delete private-medical-records.pdf"]', container),
      );

      const secondaryButton = $('va-button[secondary]', container);
      fireEvent.click(secondaryButton);

      await waitFor(() => {
        expect(setFormData.called).to.be.false;
      });
    });

    it('should call updatePage in edit mode', () => {
      const updateSpy = sinon.spy();
      const { container } = setupSummary({
        onReviewPage: true,
        updatePage: updateSpy,
      });

      clickUpdatePage(container);

      expect(updateSpy.called).to.be.true;
    });
  });
});
