import React from 'react';
import BreadCrumbs from '../../components/Breadcrumbs';

const ClaimStatusExplainerPage = () => {
  return (
    <div>
      <article className="row">
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--8 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <BreadCrumbs />
            <h1
              tabIndex="-1"
              data-testid="header"
              className="vads-u-font-size--h2"
            >
              What does my claim status mean?
            </h1>
            <div>
              <p>
                VA uses many statuses to track claims from before you submit to
                after you receive payment. This page provides descriptions for
                what each status means. If you continue to have questions about
                your claim, please contact your local VA Medical Center (VAMC)
                and ask to speak with the Beneficiary Travel department.
              </p>
              <p>
                On the Dashboard and Claims pages, each claim has a status.
                These pages also include filters which allow you to filter by
                one of the following categories: Saved or Incomplete, Under VA
                Review, and Closed. The claim categories and statuses within
                Beneficiary Travel Self Service System (BTSSS) are:
              </p>

              <h2 className="vads-u-font-size--h3">Saved or Incomplete</h2>
              <p>
                These are claims that the Beneficiary Travel office cannot
                process. Either you have not submitted the claim, or you
                submitted a claim without required information. This category of
                claim statues includes:
              </p>
              <ul>
                <li>
                  <b>Incomplete — </b>
                  You submitted a claim without required expense information.
                  You must provide the required information for BTSSS to process
                  the claim.
                </li>
                <li>
                  <b>Saved — </b>
                  You saved changes to your claim, but you did not submit it to
                  BTSSS for review. Submit the claim so BTSSS can begin
                  processing your claim.
                </li>
              </ul>

              <h2 className="vads-u-font-size--h3">Under VA Review</h2>
              <p>
                These claims require action from VA. If VA needs more
                information from you, your Travel Clerk will contact you.
              </p>
              <ul>
                <li>
                  <b>In Process — </b>
                  You submitted a claim, and now BTSSS is reviewing your claim.
                </li>
                <li>
                  <b>Claim Submitted — </b>
                  You submitted a claim for a completed appointment.
                </li>
                <li>
                  <b>In Manual Review — </b>
                  Your claim requires a manual review by a Travel Clerk due to
                  one or more of the following reasons:
                  <ul>
                    <li>Your claim includes receipts</li>
                    <li>
                      The mileage is not equal to or less than the calculated
                      limit
                    </li>
                    <li>
                      Your travel does not meet the eligibility requirements for
                      detailed information about your claim, contact your local
                      VAMC and ask for the Beneficiary Travel department.
                    </li>
                  </ul>
                </li>

                <li>
                  <b>On Hold — </b>
                  You must provide the needed information for the claim to be
                  processed. Your Travel Clerk will contact you when they put
                  your claim on hold and tell you what additional information is
                  required. For more information about your claim, please
                  contact your local VAMC and ask for the Beneficiary Travel
                  department.
                </li>
                <li>
                  <b>Appealed — </b>
                  You appealed the denial of your claim. The Travel Clerk will
                  review your appeal.
                </li>
              </ul>

              <h2 className="vads-u-font-size--h3">Closed</h2>
              <p>
                The Beneficiary Travel office finished their review of your
                claim and closed it. In some situations you can Beneficiary
                Travel department’s decision and re-open a claim. If you have
                questions about why your claim has one of the following
                statuses, contact your local VAMC and ask for the Beneficiary
                Travel department.
              </p>
              <ul>
                <li>
                  <b>Partial Payment — </b> The Travel Clerk determined the
                  claim does not qualify for a full reimbursement. Instead, they
                  approved a partial payment and sent a Partial Payment letter
                  was sent to you.
                </li>
                <li>
                  <b>Denied —</b>
                  The Travel Clerk denied your claim for one or more of the
                  following reasons:
                  <ul>
                    <li>Claims is not eligible for reimbursement.</li>
                    <li>
                      The Travel Clerk could not verification the services in
                      your claim
                    </li>
                    <li>
                      Your appointment does not exist in VISTA, either because
                      the VA clinic you went to did not enter it or you received
                      care at a non-VA facility
                    </li>
                    <li>
                      The Travel Clerk sent you a denial letter. The letter
                      contains information on how to appeal the decision.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Approved for Payment — </b>
                  The Travel Clerk approved your claim for payment. The payment
                  is pending and has not been paid.
                </li>
                <li>
                  <b>Submitted for Payment — </b>
                  The approved claim payment is assigned to the Financial
                  Service Center (FSC) so that you can receive reimbursement.
                </li>
                <li>
                  <b>Fiscal Rescinded — </b>
                  The Financial Service Center (FSC) rejected payment. You will
                  not be able to appeal this decision. For more detailed
                  information about your claim, please contact your local VAMC
                  and ask for the Beneficiary Travel department.
                </li>
                <li>
                  <b>Claim Paid — </b>
                  The reimbursement on the approved claim is paid to the
                  submitter. Note that reimbursements for claims submitted by a
                  Caregiver on behalf of a Veteran claimant are sent to the
                  Caregiver’s address or deposited in the Caregiver’s account.
                </li>
                <li>
                  <b>Payment Canceled — </b>
                  The fund transfer did not complete because of the claimant’s
                  bank. Payment has been canceled. You may create a new claim
                  and reference the original claim number in the Notes section
                  of the new claim.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ClaimStatusExplainerPage;
