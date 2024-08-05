import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const CantFindYourTeam = () => {
  const fullState = useSelector(state => state);
  const [prefLink, setPrefLink] = useState('');

  useEffect(
    () => {
      setPrefLink(mhvUrl(isAuthenticatedWithSSOe(fullState), 'preferences'));
    },
    [fullState],
  );

  return (
    <>
      <VaAdditionalInfo
        trigger="If you can't find your team"
        disable-analytics={false}
        disable-border={false}
        className="vads-u-margin-top--2"
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
          <p>
            <a href={prefLink} target="_blank" rel="noreferrer">
              Edit your message preferences on the previous version of secure
              messaging (opens in new tab)
            </a>
          </p>
          <p>
            If you want to message a team that’s not listed in your contact
            list, contact your VA health facility.
          </p>
          <p>
            <a href="/find-locations/">Find your VA health facility</a>
          </p>
        </section>
      </VaAdditionalInfo>
    </>
  );
};

export default CantFindYourTeam;
