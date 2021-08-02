import React from 'react';

export default function AppointmentRequestCommunityCareLocation({
  appointment,
}) {
  const providers = appointment.preferredCommunityCareProviders;

  return (
    <>
      <h4 className="vaos-appts__block-label">Preferred provider</h4>
      <div>
        {!providers?.length && 'Not specified'}
        {!!providers?.length && (
          // eslint-disable-next-line jsx-a11y/no-redundant-roles
          <ul className="usa-unstyled-list" role="list">
            {providers.map((provider, index) => {
              const { practiceName, providerName } = provider;

              return (
                <li key={index}>
                  {!!practiceName && (
                    <>
                      {practiceName}
                      {!!providerName && <br />}
                    </>
                  )}
                  {providerName}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
