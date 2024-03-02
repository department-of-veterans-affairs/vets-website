import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { hasMultipleFacilities } from '../../../utils/appointment';
import { makeSelectCurrentContext } from '../../../selectors';
import Wrapper from '../../../components/layout/Wrapper';
import BackButton from '../../../components/BackButton';

import { useFormRouting } from '../../../hooks/useFormRouting';

const TravelMileage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const {
    goToNextPage,
    goToPreviousPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { eligibleToFile } = useSelector(selectCurrentContext);

  const multipleFacilities = hasMultipleFacilities(eligibleToFile);

  const buttonClick = useCallback(
    () => {
      goToNextPage();
    },
    [goToNextPage],
  );

  let header = t('file-mileage-only-claim-todays-appointment', {
    count: eligibleToFile.length,
  });
  let body = (
    <div className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-padding-y--1 vads-u-margin-y--2 vads-u-border-color--gray-light">
      <span className="vads-u-font-weight--bold">
        {eligibleToFile[0].facility}
      </span>
      <div className="vads-u-margin-y--1">
        {eligibleToFile.map(appointment => (
          <p className="vads-u-margin--0" key={appointment.appointmentIen}>
            {appointment.clinicStopCodeName
              ? `${appointment.clinicStopCodeName} ${t('appointment')}`
              : t('VA-appointment')}
            {appointment.doctorName && ` with ${appointment.doctorName}`}
          </p>
        ))}
      </div>
    </div>
  );
  if (multipleFacilities) {
    header = t('select-appointments-to-file-today');
    body = <p>multi</p>;
  }
  return (
    <>
      <BackButton
        router={router}
        action={goToPreviousPage}
        prevUrl={getPreviousPageFromRouter()}
      />
      <Wrapper pageTitle={header} classNames="travel-page" withBackButton>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-itmes--stretch small-screen:vads-u-flex-direction--row">
          {body}
          <va-additional-info
            trigger={t('if-you-have-other-expenses-to-claim')}
            uswds
          >
            <Trans
              i18nKey="if-you-need-submit-receipts-other-expenses"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </va-additional-info>
          <va-button
            uswds
            big
            onClick={buttonClick}
            text={t('yes')}
            data-testid="yes-button"
            class="vads-u-margin-top--2"
            value="yes"
          />
        </div>
      </Wrapper>
    </>
  );
};

TravelMileage.propTypes = {
  router: PropTypes.object,
};

export default TravelMileage;
