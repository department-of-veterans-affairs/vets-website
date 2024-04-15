import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TravelClaimCard from '../components/TravelClaimCard';
import { getTravelClaims } from '../redux/actions';

export default function App() {
  const dispatch = useDispatch();

  const claims = useSelector(state => state.travelPay.travelClaims);
  useEffect(
    () => {
      dispatch(getTravelClaims());
    },
    [dispatch],
  );

  return (
    <article className="row">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <va-breadcrumbs uswds="false" className="hydrated">
          <li className="va-breadcrumbs-li">
            <a href="/">VA.gov home</a>
          </li>
          <li className="va-breadcrumbs-li">
            <a href="/track-claims/your-claims" aria-current="page">
              Check your travel reimbursement claim status
            </a>
          </li>
        </va-breadcrumbs>
        <h1 className="claims-container-title">
          Check your travel reimbursement claim status
        </h1>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <p className="vads-u-margin-bottom--0">Filter appointments by:</p>
          <div className="vaos-hide-for-print vads-l-row xsmall-screen:vads-u-border-bottom--0 vads-u-margin-bottom--3 small-screen:vads-u-margin-bottom--4 small-screen:vads-u-border-bottom--1px vads-u-color--gray-medium">
            <nav
              aria-label="Appointment list navigation"
              className="vaos-appts__breadcrumb vads-u-flex--1 vads-u-padding-top--0p5"
            >
              <ul>
                <li>
                  <a
                    aria-current="true"
                    className="active"
                    href="/my-health/appointments/"
                  >
                    Most recent
                  </a>
                </li>
                <li>
                  <a href="/my-health/appointments/pending">Oldest</a>
                </li>
              </ul>
            </nav>
          </div>
          <p id="pagination-info">Showing 1 ‒ 10 of 1543 events</p>
          <div className="claim-list">
            <TravelClaimCard
              appointmentDate="Friday, February 23, 2024 at 4:30 p.m. ET"
              appointmentLocation="Cheyenne VA Medical Center"
              // claimNumber="TC0820000010877"
              claimNumber={claims[0] ? claims[0].claimNumber : 'nope'}
              claimStatus="Denied"
              createdOn="Friday, February 25, 2024 at 6:40 p.m. ET"
              updatedOn="Monday, March 25, 2024 at 10:20 a.m. ET"
            />

            <va-card
              className="claim-list-item vads-u-margin-bottom--2 hydrated"
              uswds="false"
            >
              <h2 className="claim-list-item-header vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                Friday, February 23, 2024 at 4:30 p.m. ET appointment
              </h2>
              <div className="card-status">
                <h4 className="claim-list-item-header vads-u-margin-bottom--0">
                  <div role="text">Where</div>
                </h4>
                <p className="vads-u-margin-y--0 submitted-on">
                  Cheyenne VA Medical Center
                </p>
              </div>
              <div className="card-status">
                <h4 className="claim-list-item-header vads-u-margin-bottom--0p5">
                  <div role="text">Claim details</div>
                </h4>

                <p className="vads-u-margin-y--0">
                  <strong>Claim status: In progress</strong>
                </p>
                <p className="vads-u-margin-y--0">
                  Claim number: TC0820000010877
                </p>
                <p className="vads-u-margin-y--0">
                  Submitted on Tuesday, February 6, 2024 at 11:58 a.m. ET
                </p>
                <p className="vads-u-margin-y--0">
                  Updated on Monday, March 25, 2024 at 10:20 a.m. ET
                </p>
              </div>
            </va-card>

            <va-card
              className="claim-list-item vads-u-margin-bottom--2 hydrated"
              uswds="false"
            >
              <h2 className="claim-list-item-header vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                Friday, February 23, 2024 at 4:30 p.m. ET appointment
              </h2>
              <div className="card-status">
                <h4 className="claim-list-item-header vads-u-margin-bottom--0">
                  <div role="text">Where</div>
                </h4>
                <p className="vads-u-margin-y--0 submitted-on">
                  Cheyenne VA Medical Center
                </p>
              </div>
              <div className="card-status">
                <h4 className="claim-list-item-header vads-u-margin-bottom--0p5">
                  <div role="text">Claim details</div>
                </h4>

                <p className="vads-u-margin-y--0">
                  <strong>Claim status: Submitted for payment</strong>
                </p>
                <p className="vads-u-margin-y--0">
                  Claim number: TC0820000010877
                </p>
                <p className="vads-u-margin-y--0">
                  Submitted on Friday, January 26, 2024 at 1:58 p.m. ET
                </p>
                <p className="vads-u-margin-y--0">
                  Updated on Monday, March 25, 2024 at 10:20 a.m. ET
                </p>
              </div>
            </va-card>
          </div>
          <va-pagination
            uswds="false"
            page="1"
            pages="55"
            role="navigation"
            aria-label="Pagination"
            className="hydrated"
          />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 vads-u-margin-top--5 medium-screen:vads-l-col--4">
          <h2 className="help-heading">
            Need to manage your travel reimbursement claim?
          </h2>
          <p>
            You can login to the &nbsp;
            <a href="https://dvagov-btsss.dynamics365portals.us/">
              BTSSS portal
            </a>
            &nbsp;&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="14px"
              fill="#005ea2"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
            <br />
            You can also make note of your travel claim number and call the VA's
            Beneficiary Travel toll-free call center at 855-574-7292. Hours: 7
            a.m. to 7 p.m. Monday through Friday.
          </p>
          <va-need-help className="hydrated">
            <div slot="content">
              <p>
                Call us at &nbsp;
                <va-telephone contact="8008271000" className="hydrated" />.
                We're here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If
                you have hearing loss,&nbsp;
                <va-telephone contact="711" tty="true" className="hydrated" />.
              </p>
            </div>
          </va-need-help>
        </div>
      </div>
    </article>
  );
}
