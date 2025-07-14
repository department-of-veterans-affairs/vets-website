import React from 'react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ClaimDetailsContent from '../../components/ClaimDetailsContent';

describe('ClaimDetailsContent', () => {
  const claimDetailsProps = {
    claimId: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimNumber: 'TC0928098230498',
    claimStatus: 'Claim submitted',
    appointmentDate: '2024-05-26T16:40:45.781Z',
    facilityName: 'Tomah VA Medical Center',
    createdOn: '2024-05-27T16:40:45.781Z',
    modifiedOn: '2024-05-31T16:40:45.781Z',
    totalCostRequested: 50.99,
  };

  const getState = ({
    featureTogglesAreLoading = false,
    hasStatusFeatureFlag = true,
    hasDetailsFeatureFlag = true,
    hasClaimsManagementFlag = true,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      travel_pay_view_claim_details: hasDetailsFeatureFlag,
      travel_pay_claims_management: hasClaimsManagementFlag,
      /* eslint-enable camelcase */
    },
  });

  it('Successfully renders', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} />,
      {
        initialState: getState(),
      },
    );

    expect(
      screen.getByText(
        'Your travel reimbursement claim for Sunday, May 26, 2024',
      ),
    ).to.exist;
    expect(screen.getByText('Claim number: TC0928098230498')).to.exist;
    expect(screen.getByText('Tomah VA Medical Center')).to.exist;
    expect(screen.getByText('Claim status: Claim submitted')).to.exist;
  });

  it('renders appeal link for denied claims', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} claimStatus="Denied" />,
      {
        initialState: getState(),
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $(
        'va-link-action[text="Appeal the claim decision"][href="/decision-reviews"]',
      ),
    ).to.exist;
  });

  it('renders additional info with HCD status definition', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} />,
      {
        initialState: getState(),
      },
    );

    expect(screen.getByText('Claim status: Claim submitted')).to.exist;
    expect(screen.getByText('What does this status mean')).to.exist;
    expect(screen.getByText(/You submitted this claim for review/i)).to.exist;
  });

  it('renders help information if the status is not in the list', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent
        {...claimDetailsProps}
        claimStatus="Unexpected status"
      />,
      {
        initialState: getState(),
      },
    );

    expect(screen.getByText('Claim status: Unexpected status')).to.exist;
    expect(screen.queryByText('What does this status mean')).to.not.exist;
    expect(screen.getByText(/If you need help understanding your claim/i)).to
      .exist;
  });

  it('does not render claims management content with flag off', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent
        {...claimDetailsProps}
        claimStatus="Denied"
        reimbursementAmount={46.93}
        documents={[
          {
            filename: 'Decision Letter.docx',
            mimetype:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
          { filename: 'screenshot.png', mimetype: 'image/png' },
          { filename: 'note-1.txt', mimetype: '' },
        ]}
      />,
      {
        initialState: getState({ hasClaimsManagementFlag: false }),
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.not.exist;
    expect(screen.queryByText('What does this status mean')).to.not.exist;
    expect(screen.queryByText('Reimbursement amount of $46.93')).to.not.exist;
    expect($('va-link[text="Download your decision letter"]')).to.not.exist;
    expect($('va-link[text="screenshot.png"]')).to.not.exist;
  });

  describe('Documents', () => {
    it('renders download links for claim attachments from the user and travel clerk', () => {
      renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          documents={[
            {
              filename: 'Rejection Letter.docx',
              mimetype:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            { filename: 'screenshot.png', mimetype: 'image/png' },
            { filename: 'note-1.txt', mimetype: '' },
          ]}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.exist;
      expect($('va-link[text="screenshot.png"]')).to.exist;
      expect($('va-link[text="note-1.txt"]')).to.not.exist;
    });

    it('renders only user document links', () => {
      renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          documents={[
            { filename: 'screenshot.png', mimetype: 'image/png' },
            { filename: 'screenshot-2.png', mimetype: 'image/png' },
          ]}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.not.exist;
      expect($('va-link[text="screenshot.png"]')).to.exist;
      expect($('va-link[text="screenshot-2.png"]')).to.exist;
    });

    it('renders only clerk document links', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          documents={[
            {
              filename: 'Decision Letter.docx',
              mimetype:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
          ]}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.exist;
      expect(screen.queryByText('Documents you submitted')).to.not.exist;
    });

    it('renders okay with no documents', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent {...claimDetailsProps} documents={[]} />,
        {
          initialState: getState(),
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.not.exist;
      expect(screen.queryByText('Documents you submitted')).to.not.exist;
    });

    it('renders direct download link for 10-0998 form if a document is available for it', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          claimStatus="Denied"
          documents={[
            {
              filename:
                'VA Form 10-0998 Your Rights to Appeal Our Decision.pdf',
              mimetype: 'application/pdf',
            },
          ]}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-link[download="true"][text="VA Form 10-0998 (PDF)"]')).to
        .exist;
      expect(screen.queryByText('Documents you submitted')).to.not.exist;
    });
  });

  describe('Amounts', () => {
    it('renders both submitted amount and reimbursement amount when both are > 0', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={120.5}
          reimbursementAmount={100.25}
        />,
        {
          initialState: getState(),
        },
      );
      expect(screen.getByText('Amount')).to.exist;
      expect(screen.getByText('Submitted amount of $120.5')).to.exist;
      expect(screen.getByText('Reimbursement amount of $100.25')).to.exist;
    });

    it('renders only submitted amount when reimbursement amount is 0', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={75}
          reimbursementAmount={0}
        />,
        {
          initialState: getState(),
        },
      );
      expect(screen.getByText('Amount')).to.exist;
      expect(screen.getByText('Submitted amount of $75')).to.exist;
      expect(screen.queryByText(/Reimbursement amount of/)).to.not.exist;
    });

    it('does not render amount section if both submitted and reimbursement amounts are 0', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={0}
          reimbursementAmount={0}
        />,
        {
          initialState: getState(),
        },
      );
      expect(screen.queryByText('Amount')).to.not.exist;
      expect(screen.queryByText(/Submitted amount of/)).to.not.exist;
      expect(screen.queryByText(/Reimbursement amount of/)).to.not.exist;
    });

    it('renders deductible info when submitted and reimbursement amounts are different', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={100}
          reimbursementAmount={90}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-additional-info[trigger="Why are my amounts different"]')).to
        .exist;
      expect(
        screen.getByText(
          /The VA travel pay deductible is \$3 for a one-way trip/i,
        ),
      ).to.exist;
    });

    it('does not render deductible info when submitted amount is present but reimbursement amount is not', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={100}
          reimbursementAmount={0}
        />,
        {
          initialState: getState(),
        },
      );

      expect($('va-additional-info[trigger="Why are my amounts different"]')).to
        .not.exist;
      expect(
        screen.queryByText(
          /The VA travel pay deductible is \$3 for a one-way trip/i,
        ),
      ).to.not.exist;
    });

    it('does not render deductible info when submitted and reimbursement amounts are equal', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          totalCostRequested={50}
          reimbursementAmount={50}
        />,
        {
          initialState: getState(),
        },
      );
      expect($('va-additional-info[trigger="Why are my amounts different"]')).to
        .not.exist;
      expect(
        screen.queryByText(
          /The VA travel pay deductible is \$3 for a one-way trip/i,
        ),
      ).to.not.exist;
    });
  });
});
