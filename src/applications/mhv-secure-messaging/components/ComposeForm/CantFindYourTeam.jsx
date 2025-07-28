import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router-dom-v5-compat';
import { Paths } from '../../util/constants';

const CantFindYourTeam = () => {
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
          <p>
            <Link
              to={Paths.CONTACT_LIST}
              data-dd-action-name="Show more teams in your contact list link"
            >
              Show more teams in your contact list
            </Link>
          </p>
        </section>
      </VaAdditionalInfo>
    </>
  );
};

export default CantFindYourTeam;
