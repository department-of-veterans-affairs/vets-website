import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { some } from 'lodash';

import { connect } from 'react-redux';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';
import { selectVeteranStatus } from '~/platform/user/selectors';
import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

import LoadFail from '../alerts/LoadFail';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';
import { DISCHARGE_CODE_MAP } from '../../constants';
import { formatFullName } from '../../../common/helpers';

import { transformServiceHistoryEntryIntoTableRow } from '../../helpers';
import {
  NoServiceHistoryAlert,
  NotAVeteranAlert,
  NotInDEERSAlert,
} from '../military-information/MilitaryInformation';

const VeteranStatusContent = ({
  militaryInformation,
  veteranStatus,
  dob,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
  userFullName,
}) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { first, middle, last, suffix } = userFullName;

  const fullName = formatFullName({ first, middle, last, suffix });

  const titleClasses = prefixUtilityClasses([
    'display--none',
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'margin-bottom--2',
    'margin-top--0',
  ]);
  const titleClassesMedium = prefixUtilityClasses(['display--flex'], 'medium');

  const fullNameClasses = prefixUtilityClasses([
    'font-family--serif',
    'font-size--h3',
    'font-weight--bold',
    'line-height--3',
    'margin-top--0',
    'text-align--center',
    'color--base',
  ]);
  const fullNameClassesMedium = prefixUtilityClasses(
    ['text-align--left'],
    'medium',
  );

  const classes = {
    title: [...titleClasses, ...titleClassesMedium].join(' '),
    fullName: [...fullNameClasses, ...fullNameClassesMedium].join(' '),
  };

  const invalidVeteranStatus =
    !veteranStatus?.status || veteranStatus?.status === 'NOT_AUTHORIZED';

  // When the user is not authorized, militaryInformation.serviceHistory is populated with .error
  if (
    invalidVeteranStatus &&
    !militaryInformation?.serviceHistory?.serviceHistory
  ) {
    return <NotAVeteranAlert />;
  }

  const {
    serviceHistory: { serviceHistory, error },
  } = militaryInformation;

  if (error) {
    if (some(error.errors, ['code', '403'])) {
      return <NotInDEERSAlert />;
    }
    return <LoadFail />;
  }

  if (serviceHistory.length === 0) {
    return <NoServiceHistoryAlert />;
  }

  let dishonorableDischarge = false;
  let unknownDischarge = false;
  let showVeteranStatus = false;

  serviceHistory.forEach(service => {
    if (
      service.characterOfDischargeCode &&
      DISCHARGE_CODE_MAP[service.characterOfDischargeCode].indicator === 'Y'
    ) {
      showVeteranStatus = true;
    } else if (
      service.characterOfDischargeCode &&
      DISCHARGE_CODE_MAP[service.characterOfDischargeCode].indicator === 'N'
    ) {
      dishonorableDischarge = true;
    } else {
      unknownDischarge = true;
    }
  });

  return (
    <>
      {dishonorableDischarge &&
        !showVeteranStatus &&
        !unknownDischarge && (
          <div>You are not eligible due to your discharge status.</div>
        )}
      {unknownDischarge &&
        !showVeteranStatus && (
          <div>We cannot verify your discharge status as this time.</div>
        )}
      {showVeteranStatus && (
        <div>
          <dl className="vads-u-margin-y--0">
            <dt className="sr-only">Name: </dt>
            <dd className={classes.fullName}>{fullName}</dd>
            {totalDisabilityRatingServerError && (
              <dd>Unable to retrieve disability information at this time.</dd>
            )}
            {/* TODO: Figure out the "service connected" qualifier */}
            {totalDisabilityRating > 0 && (
              <dd className="vads-u-color--base">
                Disability rating: <b>{totalDisabilityRating}%</b>
              </dd>
            )}
          </dl>
          <hr />
          <dl>
            <dt className={classes.fullName}>Period of service</dt>
            <dd>
              <ul>
                {serviceHistory
                  .map(item => transformServiceHistoryEntryIntoTableRow(item))
                  .map((data, index) => (
                    <li key={index} id={data.id}>
                      {data.title && (
                        <dfn className="vads-u-margin-right--2">
                          <b>{data.title} </b>
                          {data.description && (
                            <span>
                              <b>{data.description} </b>{' '}
                            </span>
                          )}
                          {data.alertMessage && <>{data.alertMessage}</>}
                        </dfn>
                      )}

                      <span>{data.value}</span>
                    </li>
                  ))}
              </ul>
            </dd>
            <hr />
            <dd>
              <b>Date of birth:</b> {dob}
            </dd>
          </dl>
          <hr />
        </div>
      )}

      <div className="vads-u-margin-top--4">
        {showVeteranStatus && (
          <p className="vads-u-padding-bottom--2">
            You can use this Veteran status to prove you served in the United
            States Uniformed Services. This status doesn’t entitle you to any VA
            benefits.
          </p>
        )}

        <va-additional-info trigger="What if I don't think my military service information is correct?">
          <p className="vads-u-padding-bottom--2">
            Some Veterans have reported that their military service information
            in their VA.gov profiles doesn’t seem right. When this happens, it’s
            because there’s an error in the information we’re pulling into
            VA.gov from the Defense Enrollment Eligibility Reporting System
            (DEERS).
          </p>

          <p className="vads-u-padding-bottom--2">
            If you don’t think your military service information is correct
            here, call the Defense Manpower Data Center (DMDC). They’ll work
            with you to update your information in DEERS.
          </p>

          <p>
            You can call the DMDC at{' '}
            <va-telephone contact={CONTACTS.DS_LOGON} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). They’re available Monday through Friday (except federal
            holidays), 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </va-additional-info>
      </div>
    </>
  );
};

VeteranStatusContent.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
  userFullName: PropTypes.object,
  dob: PropTypes.string,
  militaryInformation: PropTypes.object,
  veteranStatus: PropTypes.object,
};

const VeteranStatusInformation = ({
  militaryInformation,
  veteranStatus,
  dob,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
  userFullName,
}) => {
  useEffect(() => {
    document.title = `Veteran Status | Veterans Affairs`;
  }, []);

  return (
    <>
      <Headline>Proof of veteran status</Headline>
      <DowntimeNotification
        appTitle="Proof of veteran status"
        render={handleDowntimeForSection('military service')}
        dependencies={[externalServices.emis]}
      >
        <VeteranStatusContent
          militaryInformation={militaryInformation}
          veteranStatus={veteranStatus}
          dob={dob}
          totalDisabilityRating={totalDisabilityRating}
          totalDisabilityRatingServerError={totalDisabilityRatingServerError}
          userFullName={userFullName}
        />
      </DowntimeNotification>

      <va-featured-content>
        <div className="vads-u-margin-y--0">
          <h3 className="vads-u-margin-top--0" slot="headline">
            Request your military records (DD214)
          </h3>
          <a href="/records/get-military-service-records">
            Learn how to request your DD214 and other military records
          </a>
        </div>
      </va-featured-content>
    </>
  );
};

const mapStateToProps = state => {
  return {
    dob: state.vaProfile?.personalInformation?.birthDate,
    militaryInformation: state.vaProfile?.militaryInformation,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
    userFullName: state.vaProfile?.hero?.userFullName,
    veteranStatus: selectVeteranStatus(state),
  };
};

VeteranStatusInformation.propTypes = {
  dob: PropTypes.string,
  militaryInformation: PropTypes.shape({
    serviceHistory: PropTypes.shape({
      serviceHistory: PropTypes.arrayOf(
        PropTypes.shape({
          branchOfService: PropTypes.string,
          beginDate: PropTypes.string,
          endDate: PropTypes.string,
        }),
      ),
    }).isRequired,
  }).isRequired,
  totalDisabilityRating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  totalDisabilityRatingServerError: PropTypes.bool,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
  veteranStatus: PropTypes.shape({
    isVeteran: PropTypes.bool,
    status: PropTypes.string,
    servedInMilitary: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps)(VeteranStatusInformation);
