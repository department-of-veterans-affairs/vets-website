import React from 'react';
import PropTypes from 'prop-types';
import { dispStatusObj } from '../../util/constants';

const StatusDropdown = props => {
  const { status } = props;

  const content = () => {
    switch (status) {
      case dispStatusObj.active: {
        const dropdownContent = () => {
          return (
            <>
              <p
                className="vads-u-padding-bottom--1"
                data-testid="active-status-definition"
              >
                This is a current prescription. If you have refills left, you
                can request a refill now.
              </p>
              <p>
                <strong>Note:</strong> If you have no refills left, you’ll need
                to request a renewal instead.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }

      case dispStatusObj.nonVA: {
        const dropdownContent = () => {
          return (
            <>
              <p className="vads-u-padding-bottom--1">
                A VA provider added this medication record in your VA medical
                records. But this isn’t a prescription you filled through a VA
                pharmacy. You can’t request this medication through this online
                tool.
              </p>
              <p>Non-VA medications include these types:</p>
              <ul className="vads-u-padding-bottom--1">
                <li className="vads-u-margin-bottom--0">
                  Prescriptions you filled through a non-VA pharmacy
                </li>
                <li className="vads-u-margin-bottom--0">
                  Over-the-counter medications, supplements, and herbal remedies
                </li>
                <li className="vads-u-margin-bottom--0">
                  Sample medications a provider gave you
                </li>
                <li className="vads-u-margin-bottom--0">
                  Other drugs you’re taking that you don’t have a prescription
                  for, including recreational drugs
                </li>
              </ul>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active: Non-VA</div>
            <div data-testid="status-dropdown">
              <va-additional-info uswds trigger="What does this status mean?">
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }

      case dispStatusObj.activeParked: {
        const dropdownContent = () => {
          return (
            <>
              <p
                className="vads-u-padding-bottom--1"
                data-testid="parked-status-dropdown"
              >
                Your VA provider prescribed this medication or supply to you.
                But we won’t send any shipments until you request to fill or
                refill it.
              </p>
              <p className="vads-u-padding-bottom--1">
                We may use this status for either of these reasons:
              </p>
              <ul className="vads-u-padding-bottom--1">
                <li className="vads-u-margin-bottom--0">
                  We’re not sure when you’ll need to fill this prescription,{' '}
                  <strong>or</strong>
                </li>
                <li className="vads-u-margin-bottom--0">
                  You told us you have too much of this medication or supply
                </li>
              </ul>
              <p>
                If you need this prescription now, you can request to fill or
                refill it.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active: Parked</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }

      case dispStatusObj.onHold: {
        const dropdownContent = () => {
          return (
            <>
              <p data-testid="onHold-status-definition">
                We put a hold on this prescription. You can’t request a refill
                until we remove the hold.
                <br />
                We may use this status for either of these reasons:
              </p>
              <ul>
                <li>
                  You told us you have too much of this medication or supply,{' '}
                  <strong>or</strong>
                </li>
                <li>There’s a problem with this prescription</li>
              </ul>
              <p>If you need this prescription now, call your VA pharmacy.</p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active: On hold</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }

      case dispStatusObj.refillinprocess: {
        const dropdownContent = () => {
          return (
            <>
              <p>
                We’re processing a fill or refill for this prescription. We’ll
                update the status here when we ship your prescription.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active: Refill in process</div>
            <div>
              <va-additional-info uswds trigger="What does this status mean?">
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
      case dispStatusObj.discontinued: {
        const dropdownContent = () => {
          return (
            <>
              <p
                className="vads-u-padding-bottom--1"
                data-testid="discontinued-status-definition"
              >
                You can’t refill this prescription. We may use this status for
                either of these reasons:
              </p>
              <ul className="vads-u-padding-bottom--1">
                <li className="vads-u-margin-bottom--0">
                  Your provider stopped prescribing this medication or supply to
                  you, <strong>or</strong>
                </li>
                <li>
                  You have a new prescription for the same medication or supply
                </li>
              </ul>
              <p>
                If you have questions or need a new prescription, send a message
                to your care team.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Discontinued</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
      case dispStatusObj.submitted: {
        const dropdownContent = () => {
          return (
            <>
              <p data-testid="submitted-status-definition">
                We got your request to fill or refill this prescription. We’ll
                update the status when we process your request.
                <br />
                Check back for updates. If we don’t update the status within 3
                days after your request, call your VA pharmacy.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Active: Submitted</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
      case dispStatusObj.expired: {
        const dropdownContent = () => {
          return (
            <>
              <p
                className="vads-u-padding-bottom--1"
                data-testid="expired-status-definition"
              >
                This prescription is too old to refill.
              </p>
              <p>
                An expired prescription doesn’t mean the medication itself is
                expired.
              </p>
              <p className="vads-u-padding-bottom--1">
                Check the prescription label for the expiration date of the
                medication.
              </p>
              <p>If you need more of this prescription, request a renewal.</p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Expired</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
      case dispStatusObj.transferred: {
        const dropdownContent = () => {
          return (
            <>
              <p data-testid="transferred-status-definition">
                We moved this prescription to our My VA Health portal.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Transferred</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
      default: {
        const dropdownContent = () => {
          return (
            <>
              <p data-testid="unknown-status-definition">
                There’s a problem with our system. You can’t manage this
                prescription online right now.
                <br />
                If you need this prescription now, call your VA pharmacy.
              </p>
            </>
          );
        };
        return (
          <>
            <div data-testid="status">Unknown</div>
            <div>
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
              >
                {dropdownContent()}
              </va-additional-info>
            </div>
          </>
        );
      }
    }
  };

  return content();
};

StatusDropdown.propTypes = {
  status: PropTypes.string,
};

export default StatusDropdown;
