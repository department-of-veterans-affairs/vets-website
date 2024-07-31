import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { LANGUAGES } from '../../../utils/constants';
import State from '../../../components/State';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, ccPreferences } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (ccPreferences.url.endsWith('/') && ccPreferences.url !== home.url)
    )
      history.push(`../${ccPreferences.url}`);
    else history.push(ccPreferences.url);
  };
}

export default function PreferredProviderSection(props) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

  return (
    <>
      {props.data.hasCommunityCareProvider && (
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row vads-u-justify-content--space-between">
            <div className="vads-u-flex--1 vads-u-padding-right--1">
              <h3 className="vaos-appts__block-label">Preferred provider</h3>
              <span className="vaos-u-word-break--break-word">
                {!!props.data.communityCareProvider.practiceName && (
                  <>
                    {props.data.communityCareProvider.practiceName}
                    <br />
                  </>
                )}
                {props.data.communityCareProvider.firstName}{' '}
                {props.data.communityCareProvider.lastName}
                <br />
                {props.data.communityCareProvider.address.street}
                {!!props.data.communityCareProvider.address.street2 && (
                  <>
                    <br />
                    {props.data.communityCareProvider.address.street2}
                  </>
                )}
                <br />
                {props.data.communityCareProvider.address.city},{' '}
                <State state={props.data.communityCareProvider.address.state} />{' '}
                {props.data.communityCareProvider.address.postalCode}
                <br />
                <br />
                {props.vaCityState && (
                  <>Closest VA health system: {props.vaCityState}</>
                )}
              </span>
            </div>
            <div>
              <va-link
                onClick={handleClick(history, pageFlow)}
                aria-label="Edit provider preference"
                text="Edit"
                data-testid="edit-new-appointment"
                role="link"
              />
            </div>
          </div>
        </div>
      )}
      {!props.data.hasCommunityCareProvider && (
        <>
          <div className="vads-l-grid-container vads-u-padding--0">
            <div className="vads-l-row vads-u-justify-content--space-between">
              <div className="vads-u-flex--1 vads-u-padding-right--1">
                <h3 className="vaos-appts__block-label">Preferred provider</h3>
                <span>
                  Provider not specified
                  <br />
                  <br />
                  Prefers provider to speak{' '}
                  {
                    LANGUAGES.find(
                      language => language.id === props.data.preferredLanguage,
                    )?.value
                  }
                  <br />
                  {props.vaCityState && (
                    <>Closest VA health system: {props.vaCityState}</>
                  )}
                </span>
              </div>
              <div>
                <va-link
                  href={pageFlow.ccPreferences.url}
                  aria-label="Edit provider preference"
                  text="Edit"
                  data-testid="edit-new-appointment"
                />{' '}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

PreferredProviderSection.propTypes = {
  data: PropTypes.object.isRequired,
  vaCityState: PropTypes.string,
};
