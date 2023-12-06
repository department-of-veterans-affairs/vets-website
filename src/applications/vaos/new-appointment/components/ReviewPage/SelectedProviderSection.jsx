import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
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

export default function SelectedProviderSection({ data, vaCityState }) {
  const history = useHistory();
  const provider = data.communityCareProvider;
  const hasProvider =
    !!provider && !!Object.keys(data.communityCareProvider).length;
  const pageFlow = useSelector(getNewAppointmentFlow);

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row vads-u-justify-content--space-between">
        <div className="vads-u-flex--1 vads-u-padding-right--1">
          <h3 className="vaos-appts__block-label">Preferred provider</h3>
          {!hasProvider && <>No provider specified</>}
          <span className="vaos-u-word-break--break-word">
            {!!hasProvider && (
              <>
                {provider.name}
                <br />
                {provider.address.line.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                {provider.address.city},{' '}
                <State state={provider.address.state} />{' '}
                {provider.address.postalCode}
              </>
            )}
            <br />
            <br />
            Prefers provider to speak{' '}
            {
              LANGUAGES.find(language => language.id === data.preferredLanguage)
                ?.value
            }
            {vaCityState && <>Closest VA health system: {vaCityState}</>}
          </span>
        </div>
        <div>
          <va-link
            onClick={handleClick(history, pageFlow)}
            aria-label="Edit provider preference"
            text="Edit"
            data-testid="edit-new-appointment"
          />
        </div>
      </div>
    </div>
  );
}

SelectedProviderSection.propTypes = {
  data: PropTypes.object,
  vaCityState: PropTypes.string,
};
