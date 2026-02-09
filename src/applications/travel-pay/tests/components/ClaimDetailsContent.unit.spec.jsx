import React from 'react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ClaimDetailsContent from '../../components/ClaimDetailsContent';
import reducer from '../../redux/reducer';
import { BTSSS_PORTAL_URL } from '../../constants';

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
    appointment: {
      id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    },
  };

  const getState = ({
    featureTogglesAreLoading = false,
    hasStatusFeatureFlag = true,
    hasDetailsFeatureFlag = true,
    hasClaimsManagementFlag = true,
    hasClaimsManagementDecisionReasonFlag = true,
    hasComplexClaimsFlag = false,
    appointment = {
      data: {
        id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
      },
    },
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      travel_pay_view_claim_details: hasDetailsFeatureFlag,
      travel_pay_claims_management: hasClaimsManagementFlag,
      travel_pay_claims_management_decision_reason: hasClaimsManagementDecisionReasonFlag,
      travel_pay_enable_complex_claims: hasComplexClaimsFlag,
      /* eslint-enable camelcase */
    },
    travelPay: {
      appointment,
    },
  });

  const renderComponent = (component, stateOptions) => {
    return renderWithStoreAndRouter(component, {
      initialState: getState(stateOptions),
      reducers: reducer,
    });
  };

  it('Successfully renders', () => {
    const screen = renderComponent(
      <ClaimDetailsContent {...claimDetailsProps} />,
    );

    expect(
      screen.getByText(
        'Your travel reimbursement claim for Sunday, May 26, 2024',
      ),
    ).to.exist;
    expect(screen.getByText(/Claim number:/)).to.exist;
    expect(screen.getByText('TC0928098230498')).to.exist;
    expect(screen.getByText('Tomah VA Medical Center')).to.exist;
    expect(screen.getByText('Claim status: Claim submitted')).to.exist;
  });

  it('sets the page title correctly', () => {
    renderWithStoreAndRouter(<ClaimDetailsContent {...claimDetailsProps} />, {
      initialState: getState(),
      reducers: reducer,
    });

    expect(document.title).to.equal(
      'Travel Reimbursement Claim Details - Travel Pay | Veterans Affairs',
    );
  });

  it('renders secure messaging link for denied claims', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} claimStatus="Denied" />,
      {
        initialState: getState(),
        reducers: reducer,
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $(
        'va-link[text="Send a secure message"][href="/health-care/send-receive-messages/"]',
      ),
    ).to.exist;
  });

  it('renders additional info with HCD status definition', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} />,
      {
        initialState: getState(),
        reducers: reducer,
      },
    );

    expect(screen.getByText('Claim status: Claim submitted')).to.exist;
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
        reducers: reducer,
      },
    );

    expect(screen.getByText('Claim status: Unexpected status')).to.exist;
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
        reducers: reducer,
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.not.exist;
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
          reducers: reducer,
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.exist;
      expect($('va-link[text="screenshot.png"]')).to.exist;
      expect($('va-link[text="note-1.txt"]')).to.not.exist;
    });

    it('renders download links for partial payment letter as decision letter', () => {
      renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          documents={[
            {
              filename: 'Partial Payment Letter.docx',
              mimetype:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            { filename: 'screenshot.png', mimetype: 'image/png' },
          ]}
        />,
        {
          initialState: getState(),
          reducers: reducer,
        },
      );

      expect($('va-link[text="Download your decision letter"]')).to.exist;
      expect($('va-link[text="screenshot.png"]')).to.exist;
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
          reducers: reducer,
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
          reducers: reducer,
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
          reducers: reducer,
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
          reducers: reducer,
        },
      );

      expect(
        $('va-link[download="true"][text="Get VA Form 10-0998 to download"]'),
      ).to.exist;
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
          reducers: reducer,
        },
      );
      expect(screen.getByText('Amount')).to.exist;
      expect(screen.getByText('Submitted amount of $120.50')).to.exist;
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
          reducers: reducer,
        },
      );
      expect(screen.getByText('Amount')).to.exist;
      expect(screen.getByText('Submitted amount of $75.00')).to.exist;
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
          reducers: reducer,
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
          reducers: reducer,
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
          reducers: reducer,
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
          reducers: reducer,
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

  describe('Decision reason', () => {
    it('does not show decision reason section with flag off', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          claimStatus="Denied"
          decisionLetterReason="Your claim was denied because of reasons. Authority 38 CFR 70.10"
        />,
        {
          initialState: getState({
            hasClaimsManagementDecisionReasonFlag: false,
          }),
          reducers: reducer,
        },
      );

      expect(
        screen.getByText(
          'We denied your claim. You can review the decision letter for more information and how to appeal.',
        ),
      ).to.exist;
      expect(screen.queryByText('Your claim was denied because of reasons.')).to
        .not.exist;
    });

    it('shows decision reason section with flag on and decisionLetterReason provided', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          claimStatus="Denied"
          decisionLetterReason="Your claim was denied because of reasons. Authority 38 CFR 70.10"
        />,
        {
          initialState: getState(),
          reducers: reducer,
        },
      );

      expect(
        screen.getByText(
          'We denied your claim. You can review the decision letter for more information and how to appeal.',
        ),
      ).to.exist;
      expect(
        screen.getByText(
          'Your claim was denied because of reasons. Authority 38 CFR 70.10',
        ),
      ).to.exist;
    });

    it('shows partial payment specific copy for status', () => {
      const screen = renderWithStoreAndRouter(
        <ClaimDetailsContent
          {...claimDetailsProps}
          claimStatus="Partial payment"
          decisionLetterReason="We only paid some of your requested amount"
        />,
        {
          initialState: getState(),
          reducers: reducer,
        },
      );

      expect(
        screen.getByText(
          'Some of the expenses you submitted aren’t eligible for reimbursement. You can review the decision letter for more information.',
        ),
      ).to.exist;
      expect(screen.getByText('We only paid some of your requested amount')).to
        .exist;
    });
  });

  describe('Complex claims feature', () => {
    const getBTSSSLink = () =>
      $(
        `va-link[text="Complete and file your claim in BTSSS"][href="${BTSSS_PORTAL_URL}"]`,
      );

    describe('OutOfBoundsAppointmentAlert', () => {
      it('renders out of bounds alert when complexClaimsToggle is on and isOutOfBounds is true', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} isOutOfBounds />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(
          screen.getByText('Your appointment happened more than 30 days ago'),
        ).to.exist;
        // va-alert is rendered with the warning message
        expect($('va-alert[status="warning"]')).to.exist;
      });

      it('does not render out of bounds alert when complexClaimsToggle is off even if isOutOfBounds is true', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} isOutOfBounds />,
          {
            initialState: getState({ hasComplexClaimsFlag: false }),
            reducers: reducer,
          },
        );

        expect(
          screen.queryByText('Your appointment happened more than 30 days ago'),
        ).to.not.exist;
      });

      it('does not render out of bounds alert when isOutOfBounds is false even if complexClaimsToggle is on', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} isOutOfBounds={false} />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(
          screen.queryByText('Your appointment happened more than 30 days ago'),
        ).to.not.exist;
      });

      it('does not render out of bounds alert when isOutOfBounds is undefined', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(
          screen.queryByText('Your appointment happened more than 30 days ago'),
        ).to.not.exist;
      });
    });

    describe('Status alternative definition', () => {
      it('renders alternative definition for Saved status when complexClaimsToggle is on', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} claimStatus="Saved" />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        const statusDef = screen.getByTestId('status-definition-text');
        expect(statusDef.textContent).to.include(
          'We saved the expenses you’ve added so far',
        );
        expect(statusDef.textContent).to.include(
          'you haven’t filed your travel reimbursement claim yet',
        );
        expect(
          screen.queryByText(
            'We saved your claim. Make sure to submit it within 30 days of your appointment.',
          ),
        ).to.not.exist;
      });

      it('renders regular definition for Saved status when complexClaimsToggle is off', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} claimStatus="Saved" />,
          {
            initialState: getState({ hasComplexClaimsFlag: false }),
            reducers: reducer,
          },
        );

        expect(
          screen.getByText(
            'We saved your claim. Make sure to submit it within 30 days of your appointment.',
          ),
        ).to.exist;
        expect(
          screen.queryByText(
            /We saved the expenses you've added so far. But you haven’t filed your travel reimbursement claim yet/i,
          ),
        ).to.not.exist;
      });

      it('uses regular definition when alternativeDefinition does not exist', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Claim submitted"
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(screen.getByText('You submitted this claim for review.')).to
          .exist;
      });
    });

    describe('Complete and file claim links', () => {
      describe('BTSSS external link', () => {
        it('renders BTSSS link for Saved status when claim started in BTSSS', () => {
          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="BTSSS"
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = getBTSSSLink();
          expect(link).to.exist;
          expect(link).to.have.attribute('external');
          expect(link).to.have.attribute(
            'label',
            'Complete and file your claim in the Beneficiary Travel Self Service System',
          );
        });

        it('renders BTSSS link for Incomplete status when claim started in BTSSS', () => {
          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Incomplete"
              claimSource="BTSSS"
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = getBTSSSLink();
          expect(link).to.exist;
          expect(link).to.have.attribute('external');
        });

        it('renders BTSSS link when claim has unassociated documents', () => {
          const documents = [
            {
              documentId: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              // No expenseId, so doc is unassociated
            },
          ];
          const expenses = [];

          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="VaGov"
              documents={documents}
              expenses={expenses}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = getBTSSSLink();
          expect(link).to.exist;
          expect(link).to.have.attribute('external');
        });

        it('does not render BTSSS link for VA.gov claim without unassociated docs', () => {
          const documents = [
            {
              documentId: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              expenseId: 'exp1', // Document is associated with an expense
            },
          ];
          const expenses = [
            {
              id: 'exp1',
              expenseType: 'Parking',
            },
          ];

          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="VaGov"
              documents={documents}
              expenses={expenses}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          expect(getBTSSSLink()).to.not.exist;
        });

        it('does NOT render BTSSS link when only clerk notes exist (no mimetype)', () => {
          const documents = [
            {
              documentId: 'clerk-note-1',
              filename: 'Internal Note.txt',
              mimetype: '', // Clerk note with empty mimetype
            },
            {
              documentId: 'clerk-note-2',
              filename: 'Another Note.txt',
              mimetype: '', // Another clerk note
            },
          ];
          const expenses = [];

          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="VaGov"
              documents={documents}
              expenses={expenses}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          // Should NOT show BTSSS link - clerk notes are filtered out
          expect(getBTSSSLink()).to.not.exist;
          expect(
            $(
              `va-link-action[text="Complete and file your claim"][href="/my-health/travel-pay/file-new-claim/${
                claimDetailsProps.appointment.id
              }"]`,
            ),
          ).to.exist;
        });
      });

      describe('VA.gov internal link', () => {
        it('renders VA.gov link for Saved status when claim started on VA.gov without unassociated docs', () => {
          const documents = [
            {
              documentId: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              expenseId: 'exp1', // Document is associated with expense
            },
          ];
          const expenses = [
            {
              id: 'exp1',
              expenseType: 'Parking',
            },
          ];

          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="VaGov"
              documents={documents}
              expenses={expenses}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );
          expect(
            $(
              `va-link-action[text="Complete and file your claim"][href="/my-health/travel-pay/file-new-claim/${
                claimDetailsProps.appointment.id
              }"]`,
            ),
          ).to.exist;
        });

        it('renders VA.gov link for Incomplete status when claim started on VA.gov', () => {
          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Incomplete"
              claimSource="VaGov"
              documents={[]}
              expenses={[]}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = $('va-link-action[text="Complete and file your claim"]');
          expect(link).to.exist;
          expect(link).to.have.attribute(
            'href',
            `/my-health/travel-pay/file-new-claim/${
              claimDetailsProps.appointment.id
            }`,
          );
        });

        it('does not render VA.gov link when claim started in BTSSS', () => {
          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="BTSSS"
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = $(`va-link-action[text="Complete and file your claim"]`);
          expect(link).to.not.exist;
        });

        it('does not render VA.gov link when claim has unassociated documents', () => {
          const documents = [
            {
              documentId: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              // No expenseId, so doc is unassociated
            },
          ];
          const expenses = [];

          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Saved"
              claimSource="VaGov"
              documents={documents}
              expenses={expenses}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = $(`va-link-action[text="Complete and file your claim"]`);
          expect(link).to.not.exist;
        });

        it('does not render VA.gov link for other statuses', () => {
          renderWithStoreAndRouter(
            <ClaimDetailsContent
              {...claimDetailsProps}
              claimStatus="Denied"
              claimSource="VaGov"
              documents={[]}
              expenses={[]}
            />,
            {
              initialState: getState({ hasComplexClaimsFlag: true }),
              reducers: reducer,
            },
          );

          const link = $(`va-link-action[text="Complete and file your claim"]`);
          expect(link).to.not.exist;
        });
      });
    });

    describe('Claim submission timeline text', () => {
      it('renders "Created on" when complexClaimsToggle is on', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(screen.getByText(/Created on Monday, May 27, 2024 at/i)).to
          .exist;
        expect(screen.queryByText(/Submitted on Monday, May 27, 2024 at/i)).to
          .not.exist;
      });

      it('renders "Submitted on" when complexClaimsToggle is off', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent {...claimDetailsProps} />,
          {
            initialState: getState({ hasComplexClaimsFlag: false }),
            reducers: reducer,
          },
        );

        expect(screen.getByText(/Submitted on Monday, May 27, 2024 at/i)).to
          .exist;
        expect(screen.queryByText(/Created on Monday, May 27, 2024 at/i)).to.not
          .exist;
      });
    });

    describe('Combined scenarios', () => {
      it('renders all complex claims features when flag is on with Saved status and isOutOfBounds', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Saved"
            isOutOfBounds
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        // Out of bounds alert
        expect(
          screen.getByText('Your appointment happened more than 30 days ago'),
        ).to.exist;

        // Alternative definition
        const statusDef = screen.getByTestId('status-definition-text');
        expect(statusDef.textContent).to.include(
          'We saved the expenses you’ve added so far',
        );
        expect(statusDef.textContent).to.include(
          'you haven’t filed your travel reimbursement claim yet',
        );

        // Complete and file link
        const link = getBTSSSLink();
        expect(link).to.exist;
        expect(link).to.have.attribute('external');

        // Created on text
        expect(screen.getByText(/Created on Monday, May 27, 2024 at/i)).to
          .exist;
      });

      it('renders VA.gov link and no note when claim started on VA.gov without unassociated docs', () => {
        const documents = [
          {
            documentId: 'doc1',
            filename: 'receipt.pdf',
            mimetype: 'application/pdf',
            expenseId: 'exp1', // Doc is associated with expense
          },
        ];
        const expenses = [
          {
            id: 'exp1',
            expenseType: 'Parking',
          },
        ];

        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Saved"
            claimSource="VaGov"
            documents={documents}
            expenses={expenses}
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        // VA.gov link should exist
        const vaLink = $(`va-link-action[text="Complete and file your claim"]`);
        expect(vaLink).to.exist;

        // BTSSS link should not exist
        expect(getBTSSSLink()).to.not.exist;

        // Note should not exist
        expect(
          screen.queryByText(
            /We can't file your travel reimbursement claim here right now/i,
          ),
        ).to.not.exist;
      });
    });

    describe('BTSSS note text', () => {
      it('renders note text for a claim started in BTSSS', () => {
        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Saved"
            claimSource="Api"
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(screen.getByText('Note:', { exact: false })).to.exist;
        expect(
          screen.getByText(
            /We can't file your travel reimbursement claim here right now/i,
          ),
        ).to.exist;
        expect(
          screen.getByText(
            /you can still file your claim in the Beneficiary Travel Self Service System \(BTSSS\)/i,
          ),
        ).to.exist;
      });

      it('renders note text when claim has unassociated documents', () => {
        const documents = [
          {
            documentId: 'doc1',
            filename: 'receipt.pdf',
            mimetype: 'application/pdf',
          },
        ];
        const expenses = []; // No expenses, so doc is unassociated

        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Incomplete"
            claimSource="VaGov"
            documents={documents}
            expenses={expenses}
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(
          screen.getByText(
            /We can't file your travel reimbursement claim here right now/i,
          ),
        ).to.exist;
      });

      it('does not render note text for VA.gov claim without unassociated docs', () => {
        const documents = [
          {
            documentId: 'doc1',
            filename: 'receipt.pdf',
            mimetype: 'application/pdf',
            expenseId: 'exp1',
          },
        ];
        const expenses = [
          {
            id: 'exp1',
            expenseType: 'Parking',
          },
        ];

        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Saved"
            claimSource="VaGov"
            documents={documents}
            expenses={expenses}
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        expect(
          screen.queryByText(
            /We can't file your travel reimbursement claim here right now/i,
          ),
        ).to.not.exist;
      });

      it('does NOT render note text when only clerk notes exist (no mimetype)', () => {
        const documents = [
          {
            documentId: 'clerk-note-1',
            filename: 'Internal Note.txt',
            mimetype: '', // Clerk note with empty mimetype
          },
          {
            documentId: 'clerk-note-2',
            filename: 'Another Note.txt',
            mimetype: '', // Another clerk note
          },
        ];
        const expenses = [];

        const screen = renderWithStoreAndRouter(
          <ClaimDetailsContent
            {...claimDetailsProps}
            claimStatus="Approved for payment"
            claimSource="VaGov"
            documents={documents}
            expenses={expenses}
          />,
          {
            initialState: getState({ hasComplexClaimsFlag: true }),
            reducers: reducer,
          },
        );

        // Should NOT render note text - clerk notes are filtered out
        expect(
          screen.queryByText(
            /We can't file your travel reimbursement claim here right now/i,
          ),
        ).to.not.exist;
      });
    });
  });
});
