import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
// import { setData } from 'platform/forms-system/exportsFile';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';

import { fetchDependents } from '../../shared/actions';
import manifest from '../manifest.json';
import { getRootParentUrl } from '../../shared/utils';

/**
 * Gateway Component fetches dependents and displays appropriate messaging
 * @typedef {object} GatewayProps
 * @property {object} route - form route information
 * @property {boolean} top - whether to render different information depending
 * on the part of the page
 *
 * @param {GatewayProps} props - Component props
 * @returns {React.Component} - Gateway component
 */
const Gateway = ({ route, top = false }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const [isFetching, setIsFetching] = useState(false);
  const { formConfig, pageList } = route;
  const [apiState, setApiState] = useState(
    userLoggedIn ? 'loading' : 'not-logged-in',
  );
  // const formData = useSelector(state => state.form?.data || {});
  const dependents = useSelector(
    state => state.dependents || { loading: true },
  );

  const dispatch = useDispatch();

  useEffect(
    () => {
      // isVerified means the Veteran is logged in and has LOA3 verification
      if (userLoggedIn) {
        if (!userIdVerified) {
          setApiState('not-verified');
        }
        // Gateway is rendered on the intro page twice, so check `top` to
        // prevent duplicate fetch calls
        if (top && !isFetching && userIdVerified) {
          setIsFetching(true);
          // If the user is logged in but not verified, we might want to show a
          // verification alert or redirect them to a verification page.
          // This is a placeholder for any additional logic needed.
          dispatch(fetchDependents());
        } else if (dependents.error) {
          setApiState('error');
        } else if (!dependents.loading && dependents?.data) {
          if (dependents.data.length > 0) {
            setApiState('loaded');
            // This sets the dependents in the form data, but the data is not
            // preserved after starting the form because the save-in-progress
            // data overwrites it
            // dispatch(
            //   setData({
            //     ...formData,
            //     dependents: dependents.data,
            //   }),
            // );
          } else {
            setApiState('no-dependents');
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userLoggedIn, userIdVerified, isFetching, dependents, top],
  );

  switch (apiState) {
    case 'not-verified':
      return top ? <VerifyAlert headingLevel={2} /> : null;
    case 'loading':
      return top ? (
        <va-loading-indicator
          set-focus
          message="Loading dependents..."
          label="Loading"
        />
      ) : null;
    case 'no-dependents':
      return top ? (
        <va-alert status="info" visible>
          <h2 slot="headline">
            We don’t have any dependents information on file for you
          </h2>
          <p>We can’t find any dependents added to your disability award.</p>
          <va-link
            href={getRootParentUrl(manifest.rootUrl)}
            text="Find out how to add a dependent to your disability claim"
          />
        </va-alert>
      ) : null;
    case 'error':
      return top ? (
        <va-alert status="error" visible>
          <h2 slot="headline">Error Loading Dependents</h2>
          <p>
            There was an error loading your dependents. Please try again later
            or contact support.
          </p>
        </va-alert>
      ) : null;
    default:
      return top ? null : (
        <SaveInProgressIntro
          hideUnauthedStartLink
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start your disability benefits dependents verification"
          formConfig={formConfig}
        />
      );
  }
};

Gateway.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  top: PropTypes.bool,
};

export default Gateway;
