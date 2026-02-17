import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import { selectMedicationsManagementImprovementsFlag } from '../../util/selectors';

const NeedHelp = ({ page, headingLevel = 3 }) => {
  const isManagementImprovementsEnabled = useSelector(
    selectMedicationsManagementImprovementsFlag,
  );

  // Memoize DataDog action names based on page type to prevent recalculation on every render
  // TODO add handling for in-progress page datadog actions
  const actionNames = useMemo(() => {
    const isListPage = page === pageType.LIST;
    return {
      allergiesLink: isListPage
        ? dataDogActionNames.medicationsListPage
            .GO_TO_ALLERGIES_AND_REACTIONS_LINK
        : dataDogActionNames.refillPage.GO_TO_ALLERGIES_AND_REACTIONS_LINK,
      seiLink: isListPage
        ? dataDogActionNames.medicationsListPage
            .GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK
        : dataDogActionNames.refillPage
            .GO_TO_SELF_ENTERED_HEALTH_INFORMATION_LINK,
      managingMedsLink: isListPage
        ? dataDogActionNames.medicationsListPage
            .LEARN_MORE_ABOUT_MANAGING_MEDICATIONS_ONLINE_LINK
        : dataDogActionNames.refillPage
            .LEARN_MORE_ABOUT_MANAGING_MEDICATIONS_ONLINE_LINK,
      messageLink: isListPage
        ? dataDogActionNames.medicationsListPage.START_A_NEW_MESSAGE_LINK
        : dataDogActionNames.refillPage.START_A_NEW_MESSAGE_LINK,
      notificationLink: isListPage
        ? dataDogActionNames.medicationsListPage
            .GO_TO_UPDATE_NOTIFICATION_SETTINGS_LINK
        : dataDogActionNames.refillPage.GO_TO_UPDATE_NOTIFICATION_SETTINGS_LINK,
      useMedsLink: isListPage
        ? dataDogActionNames.medicationsListPage.GO_TO_USE_MEDICATIONS_LINK
        : dataDogActionNames.refillPage.GO_TO_USE_MEDICATIONS_LINK,
      composeMessageLink: isListPage
        ? dataDogActionNames.medicationsListPage.COMPOSE_A_MESSAGE_LINK
        : dataDogActionNames.refillPage.COMPOSE_A_MESSAGE_LINK,
    };
  }, [page]);

  const HeadingTag = `h${headingLevel}`;

  // Enhanced Need Help content for management improvements
  if (isManagementImprovementsEnabled) {
    return (
      <div
        aria-labelledby="need-help-heading"
        data-testid="rx-need-help-container"
      >
        <HeadingTag
          id="need-help-heading"
          className="vads-u-border-bottom--2px vads-u-border-color--primary vads-u-line-height--5 vads-u-font-size--h3"
        >
          Need help?
        </HeadingTag>

        <p>Need to update your allergies and reactions?</p>
        <va-link
          href="/my-health/medical-records/allergies/"
          text="Go to your list of allergies and reactions"
          data-testid="go-to-allergies-and-reactions-link"
          data-dd-action-name={actionNames.allergiesLink}
        />

        <p>
          Can’t find your self-entered medications? You can still download a
          copy of any self-entered health information.
        </p>
        <va-link
          href="/my-health/medical-records/download?sei=true"
          text="Go to download your self-entered health information"
          data-testid="go-to-self-entered-health-information-link"
          data-dd-action-name={actionNames.seiLink}
        />

        <p>Have questions about managing your medications online?</p>
        <va-link
          href="/health-care/refill-track-prescriptions"
          text="Learn more about managing medications online"
          data-testid="learn-more-about-managing-medications-online-link"
          data-dd-action-name={actionNames.managingMedsLink}
        />

        <p>
          Have questions about your medications and supplies? Send a secure
          message to your care team.
        </p>
        <va-link
          href="/my-health/secure-messages/new-message/"
          text="Start a new message"
          data-testid="start-a-new-message-link"
          data-dd-action-name={actionNames.messageLink}
        />

        <p>Need to update your notification settings?</p>
        <va-link
          href="/profile/notifications/"
          text="Go to update your notification settings"
          data-testid="go-to-update-notification-settings-link"
          data-dd-action-name={actionNames.notificationLink}
        />
      </div>
    );
  }

  // Original Need Help content
  return (
    <div data-testid="rx-need-help-container">
      <HeadingTag className="vads-u-border-bottom--2px vads-u-border-color--primary vads-u-line-height--5 vads-u-font-size--h3">
        Need help?
      </HeadingTag>
      <p>
        Can’t find your self-entered medications? You can still download a copy
        of any self-entered health information.
      </p>
      <va-link
        href="/my-health/medical-records/download?sei=true"
        text="Go to download your self-entered health information"
        data-testid="go-to-self-entered-health-information-link"
        data-dd-action-name={actionNames.seiLink}
      />
      <p>Have questions about managing your medications online?</p>
      <va-link
        href="/health-care/refill-track-prescriptions"
        text="Learn more about managing medications online"
        data-testid="go-to-use-medications-link"
        data-dd-action-name={actionNames.useMedsLink}
      />
      <p>
        Have questions about your medications and supplies? Send a secure
        message to your care team.
      </p>
      <a
        href="/my-health/secure-messages/new-message/"
        rel="noreferrer"
        data-testid="start-a-new-message-link"
        data-dd-action-name={actionNames.composeMessageLink}
      >
        Start a new message
      </a>
    </div>
  );
};

NeedHelp.propTypes = {
  page: PropTypes.string.isRequired,
  headingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

export default NeedHelp;
