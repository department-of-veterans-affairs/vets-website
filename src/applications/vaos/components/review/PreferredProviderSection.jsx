import React from 'react';
import { Link } from 'react-router';
import newAppointmentFlow from '../../newAppointmentFlow';
import { LANGUAGES } from '../../utils/constants';

export default function PreferredProviderSection(props) {
  return (
    <>
      {props.data.hasCommunityCareProvider && (
        <>
          <div className="vads-l-grid-container vads-u-padding--0">
            <div className="vads-l-row">
              <div className="vads-l-col--6">
                <h3 className="vaos-appts__block-label">Preferred provider</h3>
              </div>
              <div className="vads-l-col--6 vads-u-text-align--right">
                <Link
                  to={newAppointmentFlow.ccPreferences.url}
                  aria-label="Edit provider preference"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <span>
            {props.data.communityCareProvider.practiceName}
            <br />
            {props.data.communityCareProvider.firstName} &nbsp;
            {props.data.communityCareProvider.lastName}
            <br />
            {props.data.communityCareProvider.address.street}
            <br />
            {props.data.communityCareProvider.address.street2}
            <br />
            {props.data.communityCareProvider.address.city}, &nbsp;
            {props.data.communityCareProvider.address.state} &nbsp;
            {props.data.communityCareProvider.address.postalCode}
          </span>
        </>
      )}
      {!props.data.hasCommunityCareProvider && (
        <>
          <div className="vads-l-grid-container vads-u-padding--0">
            <div className="vads-l-row">
              <div className="vads-l-col--6">
                <h3 className="vaos-appts__block-label">Preferred provider</h3>
              </div>
              <div className="vads-l-col--6 vads-u-text-align--right">
                <Link
                  to={newAppointmentFlow.ccPreferences.url}
                  aria-label="Edit provider preference"
                >
                  Edit
                </Link>{' '}
              </div>
            </div>
          </div>
          <span>
            Provider not specified
            <br />
            <br />
            Prefers provider to speak &nbsp;
            {
              LANGUAGES.find(
                language => language.id === props.data.preferredLanguage,
              )?.value
            }
            <br />
            Practice in &nbsp;
            {props.vaCityState}
          </span>
        </>
      )}
    </>
  );
}
