import React from 'react';
import { Link } from 'react-router-dom';
import newAppointmentFlow from '../../newAppointmentFlow';

import { LANGUAGES } from '../../../utils/constants';
import State from '../../../components/State';

export default function SelectedProviderSection({ data, vaCityState }) {
  const provider = data.communityCareProvider;
  const hasProvider =
    !!provider && !!Object.keys(data.communityCareProvider).length;

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
                {provider.address.line.map(line => (
                  <>
                    {line}
                    <br />
                  </>
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
            <br />
            {vaCityState && <>Closest VA health system: {vaCityState}</>}
          </span>
        </div>
        <div>
          <Link
            to={newAppointmentFlow.ccPreferences.url}
            aria-label="Edit provider preference"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
