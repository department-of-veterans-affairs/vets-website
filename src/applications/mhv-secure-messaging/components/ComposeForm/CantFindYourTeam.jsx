import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Paths, teamNotListedReasons } from '../../util/constants';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const CantFindYourTeam = () => {
  const { mhvSecureMessagingCuratedListFlow } = useFeatureToggles();
  const { activeFacility } = useSelector(state => state.sm.recipients);

  if (mhvSecureMessagingCuratedListFlow) {
    if (activeFacility?.ehr === 'cerner') {
      return (
        <VaAdditionalInfo
          trigger="If you can't find your care team"
          className="vads-u-margin-top--2"
          data-dd-action-name="If You Can't Find Your Team Dropdown"
        >
          <p>
            If you can’t find your care team, try entering the first few letters
            of your facility’s location, your provider’s name, or a type of
            care.
          </p>
          <br />
          <p>
            If you still can’t find your care team, they may not use secure
            messaging. Or they may be part of a different VA health care system.
          </p>
        </VaAdditionalInfo>
      );
    }

    return (
      <VaAdditionalInfo
        trigger="If you can't find your care team"
        className="vads-u-margin-top--2"
        data-dd-action-name="If You Can't Find Your Team Dropdown"
      >
        <section className="cant-fnd-your-team">
          <p>Your care team may not be listed for these reasons:</p>
          <ul className="vads-u-margin-y--0">
            {teamNotListedReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
          <p>
            You can send messages to other care teams by adding them to your
            contact list.
          </p>
          <p>
            <Link
              to={Paths.CONTACT_LIST}
              data-dd-action-name="Update your contact list link"
            >
              Update your contact list
            </Link>
          </p>
        </section>
      </VaAdditionalInfo>
    );
  }

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
