import React from 'react';
import { useRouteError } from 'react-router-dom-v5-compat';
import { Toggler } from 'platform/utilities/feature-toggles';
import ErrorPage from '../../containers/ErrorPage';
import Error403 from './Error403';
import GenericError from './GenericError';

const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <ErrorPage>
      <va-alert data-testid="error-message" status="error" visible>
        {error.status === 403 ? (
          <>
            <Toggler
              toggleName={
                Toggler.TOGGLE_NAMES
                  .accreditedRepresentativePortalSelfServiceAuth
              }
            >
              <Toggler.Enabled>
                <Error403 />
              </Toggler.Enabled>
              <Toggler.Disabled>
                <GenericError />
              </Toggler.Disabled>
            </Toggler>
          </>
        ) : (
          <GenericError />
        )}
      </va-alert>
    </ErrorPage>
  );
};

export default ErrorBoundary;
