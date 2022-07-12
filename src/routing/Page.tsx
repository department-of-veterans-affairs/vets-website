import React, { useContext, useEffect } from 'react';
import { Form, useFormikContext } from 'formik';
import {
  useNavigate,
  To,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import { PageProps } from './types';
import { RouterContext } from './RouterContext';

/**
 * Renders the page contents
 *
 * @beta
 */
export default function Page(props: PageProps): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPage = searchParams.get('edit');
  const sourceAnchor = searchParams.get('source');
  const state = useFormikContext();
  const currentLocation = useLocation();

  const { nextRoute, previousRoute } = useContext(RouterContext);

  useEffect(() => {
    // Reset the form on route change.
    // This could be used in a different component
    // but was used here because it's related to routing.
    state.setErrors({});
    state.setTouched({}); // resetting fields
    state.setSubmitting(false); // resetting fields
  }, [currentLocation]);

  return (
    <div>
      <h3>{props.title}</h3>
      <div className="vads-u-margin-y--2">{props.children}</div>

      {editPage && (
        <div>
          <button
            onClick={(event) => {
              navigate(
                `/review-and-submit${
                  sourceAnchor ? `#${sourceAnchor}` : ''
                }` as To
              );
            }}
            className="btn next"
          >
            Back to Review page
          </button>
        </div>
      )}
      {previousRoute && !props.hidePreviousButton && (
        <button
          className="btn usa-button-secondary prev"
          onClick={() => {
            navigate(previousRoute as To);
          }}
        >
          <i className="fas fa-angle-double-left" /> Previous
        </button>
      )}

      {nextRoute && (
        <button
          className="btn usa-button-primary next"
          onClick={(event) => {
            if (Object.keys(state.errors).length > 0) {
              state.handleSubmit();
              event.preventDefault();
            } else {
              state.handleSubmit();
              navigate(nextRoute as To);
            }
          }}
          type="submit"
          aria-describedby={props.nextButtonDescribedBy}
        >
          {props.nextButtonCustomText ? props.nextButtonCustomText : 'Next'}{' '}
          <i className="fas fa-angle-double-right" />
        </button>
      )}
    </div>
  );
}
