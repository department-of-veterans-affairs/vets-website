import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { Link } from 'react-router-dom';
import { Paths } from '../../util/constants';

const CantFindYourTeam = () => {
  const ssoe = useSelector(isAuthenticatedWithSSOe);

  const mhvSecureMessagingEditContactList = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingEditContactList
      ],
  );

  const prefLink = useMemo(() => mhvUrl(ssoe, 'preferences'), [ssoe]);

  return (
    <>
      <VaAdditionalInfo
        trigger="If you can't find your team"
        className="vads-u-margin-top--2"
        data-dd-action-name="If You Can't Find Your Team Dropdown"
      >
        <section className="cant-fnd-your-team">
          <p>
            Here are some reasons a care team may be missing from your contact
            list:
          </p>
          <ul className="vads-u-margin-y--0">
            <li>Your account isn’t connected to the team</li>
            <li>The team doesn’t use secure messaging</li>
            <li>You removed the team from your list</li>
          </ul>
          <p>
            If you want to message a team that’s not in your list, try changing
            your settings to show more teams in your list. Then refresh this
            page to review your updated list.
          </p>
          {mhvSecureMessagingEditContactList ? (
            <p>
              <Link
                to={Paths.CONTACT_LIST}
                data-dd-action-name="Show more teams in your contact list link"
              >
                Show more teams in your contact list
              </Link>
            </p>
          ) : (
            <>
              <p>
                <a
                  href={prefLink}
                  target="_blank"
                  rel="noreferrer"
                  data-dd-action-name="Edit your message preferences link"
                >
                  Edit your message preferences on the previous version of
                  secure messaging (opens in new tab)
                </a>
              </p>
              <p>
                If you want to message a team that’s not listed in your contact
                list, contact your VA health facility.
              </p>
              <p>
                <a
                  href="/find-locations/"
                  data-dd-action-name="Find your VA health facility link"
                >
                  Find your VA health facility
                </a>
              </p>
            </>
          )}
        </section>
      </VaAdditionalInfo>
    </>
  );
};

export default CantFindYourTeam;
