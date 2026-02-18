import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  ACTIVE_NON_VA,
  dispStatusObj,
  dispStatusObjV2,
} from '../../util/constants';
import { dataDogActionNames } from '../../util/dataDogConstants';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
  selectMhvMedicationsOracleHealthCutoverFlag,
} from '../../util/selectors';

const StatusDropdown = props => {
  const { status } = props;
  const isCernerPilot = useSelector(selectCernerPilotFlag);
  const isV2StatusMapping = useSelector(selectV2StatusMappingFlag);
  const isOracleHealthCutover = useSelector(
    selectMhvMedicationsOracleHealthCutoverFlag,
  );
  const useV2Statuses = isCernerPilot && isV2StatusMapping;
  const statusObj = useV2Statuses ? dispStatusObjV2 : dispStatusObj;

  const displayStatus = statusTxt => {
    return (
      <p data-testid="status" data-dd-privacy="mask">
        {statusTxt}
      </p>
    );
  };

  const content = () => {
    if (!useV2Statuses) {
      switch (status) {
        case statusObj.active: {
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
                  <strong>Note:</strong> If you have no refills left, you’ll
                  need to request a renewal instead.
                </p>
              </>
            );
          };
          return (
            <>
              {displayStatus('Active')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.nonVA: {
          const dropdownContent = () => {
            return (
              <>
                <p className="vads-u-padding-bottom--1">
                  A VA provider added this medication record in your VA medical
                  records. But this isn’t a prescription you filled through a VA
                  pharmacy. You can’t request this medication through this
                  online tool.
                </p>
                <p>Non-VA medications include these types:</p>
                <ul className="vads-u-padding-bottom--1">
                  <li className="vads-u-margin-bottom--0">
                    Prescriptions you filled through a non-VA pharmacy
                  </li>
                  <li className="vads-u-margin-bottom--0">
                    Over-the-counter medications, supplements, and herbal
                    remedies
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
              {displayStatus(ACTIVE_NON_VA)}
              <va-additional-info
                data-testid="status-dropdown"
                uswds
                trigger="What does this status mean?"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.activeParked: {
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
              {displayStatus('Active: Parked')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.onHold: {
          const dropdownContent = () => {
            return (
              <>
                <p data-testid="onHold-status-definition">
                  We put a hold on this prescription. You can’t request a refill
                  until we remove the hold.
                </p>
                <p>We may use this status for either of these reasons:</p>
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
              {displayStatus('Active: On hold')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.refillinprocess: {
          const dropdownContent = () => {
            return (
              <p>
                We’re processing a fill or refill for this prescription. We’ll
                update the status here when we ship your prescription.
              </p>
            );
          };
          return (
            <>
              {displayStatus('Active: Refill in process')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.discontinued: {
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
                    Your provider stopped prescribing this medication or supply
                    to you, <strong>or</strong>
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
              </>
            );
          };
          return (
            <>
              {displayStatus('Discontinued')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.submitted: {
          const dropdownContent = () => {
            return (
              <>
                <p data-testid="submitted-status-definition">
                  We got your request to fill or refill this prescription. We’ll
                  update the status when we process your request.
                </p>
                <p>
                  Check back for updates. If we don’t update the status within 3
                  days after your request, call your VA pharmacy.
                </p>
              </>
            );
          };
          return (
            <>
              {displayStatus('Active: Submitted')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.expired: {
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
              {displayStatus('Expired')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.transferred: {
          const dropdownContent = () => {
            if (isOracleHealthCutover) {
              return (
                <p data-testid="transferred-status-definition">
                  This is a previous record of your medication. If you need a
                  refill, find the current medication in your medication list.
                  If you don’t have a current one, contact your provider.
                </p>
              );
            }
            return (
              <p data-testid="transferred-status-definition">
                We moved this prescription to our My VA Health portal.
              </p>
            );
          };
          return (
            <>
              {displayStatus('Transferred')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        default: {
          const dropdownContent = () => {
            return (
              <div data-testid="unknown-status-definition">
                <p>
                  There’s a problem with our system. You can’t manage this
                  prescription online right now.
                </p>
                <p>If you need this prescription now, call your VA pharmacy.</p>
              </div>
            );
          };
          return (
            <>
              {displayStatus('Unknown')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
      }
    } else {
      switch (status) {
        case statusObj.active: {
          const dropdownContent = () => {
            return (
              <>
                <p
                  className="vads-u-padding-bottom--1"
                  data-testid="active-status-definition"
                >
                  A prescription you can fill at a local VA pharmacy. If this
                  prescription is refillable, you may request a refill.
                </p>
                <p>
                  If you need a medication immediately, call your VA pharmacy’s
                  automated refill line. You can find the pharmacy phone number
                  on your prescription label or in your medications details
                  page.
                </p>
              </>
            );
          };
          return (
            <>
              {displayStatus('Active')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.nonVA: {
          const dropdownContent = () => {
            return (
              <>
                <p className="vads-u-padding-bottom--1">
                  A VA provider added this medication record in your VA medical
                  records. But this isn’t a prescription you filled through a VA
                  pharmacy. You can’t request this medication through this
                  online tool.
                </p>
                <p>Non-VA medications include these types:</p>
                <ul className="vads-u-padding-bottom--1">
                  <li className="vads-u-margin-bottom--0">
                    Prescriptions you filled through a non-VA pharmacy
                  </li>
                  <li className="vads-u-margin-bottom--0">
                    Over-the-counter medications, supplements, and herbal
                    remedies
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
              {displayStatus(ACTIVE_NON_VA)}
              <va-additional-info
                data-testid="status-dropdown"
                uswds
                trigger="What does this status mean?"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.inprogress: {
          const dropdownContent = () => {
            return (
              <>
                <p data-testid="inprogress-status-definition">
                  A new prescription or a prescription you’ve requested a refill
                  or renewal for.
                </p>
                <p>
                  If you need your medication sooner, call your VA pharmacy’s
                  automated refill line. You can find the pharmacy phone number
                  on your prescription label or in your medications details
                  page.
                </p>
              </>
            );
          };
          return (
            <>
              {displayStatus('In progress')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.inactive: {
          const dropdownContent = () => {
            return (
              <>
                <p
                  className="vads-u-padding-bottom--1"
                  data-testid="inactive-status-definition"
                >
                  A prescription you can no longer fill. Contact your VA
                  provider if you need more of this medication.
                </p>
              </>
            );
          };
          return (
            <>
              {displayStatus('Inactive')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        case statusObj.transferred: {
          const dropdownContent = () => {
            if (isOracleHealthCutover) {
              return (
                <p data-testid="transferred-status-definition">
                  This is a previous record of your medication. If you need a
                  refill, find the current medication in your medication list.
                  If you don’t have a current one, contact your provider.
                </p>
              );
            }
            return (
              <p data-testid="transferred-status-definition">
                A prescription moved to VA’s new electronic health record. This
                prescription may also be described as “Discontinued” on
                medication lists from your health care team. Take your
                medications as prescribed by your health care team.
              </p>
            );
          };
          return (
            <>
              {displayStatus('Transferred')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
        default: {
          const dropdownContent = () => {
            return (
              <div data-testid="unknown-status-definition">
                <p>
                  There’s a problem with our system. You can’t manage this
                  prescription online right now.
                </p>
                <p>If you need this prescription now, call your VA pharmacy.</p>
              </div>
            );
          };
          return (
            <>
              {displayStatus('Status not available')}
              <va-additional-info
                uswds
                trigger="What does this status mean?"
                data-testid="status-dropdown"
                data-dd-action-name={
                  dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
                }
              >
                {dropdownContent()}
              </va-additional-info>
            </>
          );
        }
      }
    }
  };
  return content();
};

StatusDropdown.propTypes = {
  status: PropTypes.string,
};

export default StatusDropdown;
