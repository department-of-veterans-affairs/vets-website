import React from 'react';
import PropTypes from 'prop-types';

const StatusDropdown = props => {
  const { status } = props;

  const content = () => {
    switch (status) {
      case 'active': {
        return (
          <>
            <div data-testid="status">Active</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  This is a current prescription. If you have refills left, you
                  can request a refill now.
                </p>
                <p>
                  <strong>Note:</strong> If you have no refills left, you’ll
                  need to request a renewal instead.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                This is a current prescription. If you have refills left, you
                can request a refill now.
              </p>
              <p>
                <strong>Note:</strong> If you have no refills left, you’ll need
                to request a renewal instead.
              </p>
            </div>
          </>
        );
      }
      case 'activeParked': {
        return (
          <>
            <div data-testid="status">Active: Parked</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  Your VA provider prescribed this medication or supply to you.
                  But we won’t send any shipments until you request to fill or
                  refill it.
                </p>
                <p>We may use this status for either of these reasons.</p>
                <ul>
                  <li>
                    We’re not sure when you’ll need to fill this prescription,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    You told us you have too much of this medication or supply
                    If you need this prescription now, you can request to fill
                    or refill it
                  </li>
                </ul>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                This is a current prescription. If you have refills left, you
                can request a refill now.
              </p>
              <p>
                <strong>Note:</strong> If you have no refills left, you’ll need
                to request a renewal instead.
              </p>
            </div>
          </>
        );
      }
      case 'hold': {
        return (
          <>
            <div data-testid="status">Active: On hold</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
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
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
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
            </div>
          </>
        );
      }
      case 'refillinprocess': {
        return (
          <>
            <div data-testid="status">Active: Refill in process</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  We’re processing a fill or refill for this prescription. We’ll
                  update the status here when we ship your prescription.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                We’re processing a fill or refill for this prescription. We’ll
                update the status here when we ship your prescription.
              </p>
            </div>
          </>
        );
      }
      case 'discontinued': {
        return (
          <>
            <div data-testid="status">Discontinued</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  You can’t refill this prescription. We may use this status for
                  either of these reasons:
                </p>
                <ul>
                  <li>
                    Your provider stopped prescribing this medication or supply
                    to you,
                    <strong>or</strong>
                  </li>
                  <li>
                    You have a new prescription for the same medication or
                    supply
                  </li>
                </ul>
                <p>
                  If you have questions or need a new prescription, send a
                  message to your care team.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                You can’t refill this prescription. We may use this status for
                either of these reasons:
              </p>
              <ul>
                <li>
                  Your provider stopped prescribing this medication or supply to
                  you,
                  <strong>or</strong>
                </li>
                <li>
                  You have a new prescription for the same medication or supply
                </li>
              </ul>
              <p>
                If you have questions or need a new prescription, send a message
                to your care team.
              </p>
            </div>
          </>
        );
      }
      case 'submitted': {
        return (
          <>
            <div data-testid="status">Active: Submitted</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  We got your request to fill or refill this prescription. We’ll
                  update the status when we process your request.
                  <br />
                  Check back for updates. If we don’t update the status within 3
                  days after your request, call your VA pharmacy.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                We got your request to fill or refill this prescription. We’ll
                update the status when we process your request.
                <br />
                Check back for updates. If we don’t update the status within 3
                days after your request, call your VA pharmacy.
              </p>
            </div>
          </>
        );
      }
      case 'expired': {
        return (
          <>
            <div data-testid="status">Expired</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  This prescription is too old to refill.
                  <br />
                  An expired prescription doesn’t mean the medication itself is
                  expired. Check the prescription label for the expiration date
                  of the medication.
                  <br />
                  If you need more of this prescription, request a renewal.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                This prescription is too old to refill.
                <br />
                An expired prescription doesn’t mean the medication itself is
                expired. Check the prescription label for the expiration date of
                the medication.
                <br />
                If you need more of this prescription, request a renewal.
              </p>
            </div>
          </>
        );
      }
      case 'transferred': {
        return (
          <>
            <div data-testid="status">Transferred</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>We moved this prescription to our My VA Health portal.</p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>We moved this prescription to our My VA Health portal.</p>
            </div>
          </>
        );
      }
      default: {
        return (
          <>
            <div data-testid="status">Unknown</div>
            <div className="no-print">
              <va-additional-info trigger="What does this status mean?">
                <p>
                  There’s a problem with our system. You can’t manage this
                  prescription online right now.
                  <br />
                  If you need this prescription now, call your VA pharmacy.
                </p>
              </va-additional-info>
            </div>
            <div className="print-only vads-u-margin-top--2">
              {' '}
              <p>
                There’s a problem with our system. You can’t manage this
                prescription online right now.
                <br />
                If you need this prescription now, call your VA pharmacy.
              </p>
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
