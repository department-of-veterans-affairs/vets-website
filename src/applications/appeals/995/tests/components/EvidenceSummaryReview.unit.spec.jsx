import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { records } from '../data/evidence-records';
import EvidenceSummaryReview from '../../components/EvidenceSummaryReview';
import {
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_OTHER_EVIDENCE,
  SUMMARY_EDIT,
} from '../../constants';
import { content } from '../../content/evidence/summary';
import { verifyHeader } from '../unit-test-helpers';

const setupSummary = ({
  vaMR = true,
  privateMR = true,
  other = true,
  limit,
  list = records(),
  editPage = () => {},
} = {}) =>
  render(
    <EvidenceSummaryReview
      data={{
        [HAS_VA_EVIDENCE]: vaMR,
        [HAS_PRIVATE_EVIDENCE]: privateMR,
        [HAS_OTHER_EVIDENCE]: other,
        ...list,
        limitedConsent: limit,
      }}
      editPage={editPage}
    />,
  );

describe('EvidenceSummaryReview', () => {
  it('should render the proper content', () => {
    const { container } = setupSummary({ limit: 'Limited consent details' });

    const h4s = $$('h4', container);
    const h5s = $$('h5', container);

    verifyHeader(h4s, 0, content.summaryTitle);
    expect($$('.edit-page', container)).to.exist;

    verifyHeader(h5s, 0, content.vaTitle);
    verifyHeader(h5s, 1, content.privateTitle);
    verifyHeader(h5s, 2, content.otherTitle);
  });

  it('should call editPage callback', () => {
    const editPageSpy = sinon.spy();
    const { container } = setupSummary({ editPage: editPageSpy });

    fireEvent.click($('va-button', container));

    expect(editPageSpy.called).to.be.true;
  });

  it('should focus on edit button after updating page', async () => {
    global.window.sessionStorage.setItem(SUMMARY_EDIT, 'true');
    setupSummary({ list: {}, limit: undefined });

    await waitFor(() => {
      expect(global.window.sessionStorage.getItem(SUMMARY_EDIT)).to.be.null;
    });
  });

  describe('when there is no evidence', () => {
    it('should render the missing evidence text', () => {
      const screen = setupSummary({ list: [] });
      expect(screen.getByText(content.missingEvidenceReviewText)).to.exist;
    });
  });
});
