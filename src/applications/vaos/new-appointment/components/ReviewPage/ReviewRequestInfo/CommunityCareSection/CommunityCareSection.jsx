import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ContactDetailSection from '../ContactDetailSection';
import ReasonForAppointmentSection from '../ReasonForAppointmentSection';
import PreferredDatesSection from '../PreferredDatesSection';
import SelectedProviderSection from '../../SelectedProviderSection';
import PreferredLanguageSection from './PreferredLanguageSection';
import SchedulingFacilitySection from './SchedulingFacilitySection';

export default function CommunityCareSection({ data, facility, vaCityState }) {
  return (
    <>
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <SchedulingFacilitySection data={data} facility={facility} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <SelectedProviderSection data={data} vaCityState={vaCityState} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <PreferredLanguageSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr
        data-dd-privacy="mask"
        aria-hidden="true"
        className={classNames('vads-u-margin-y--2', {
          'vads-u-display--none':
            !data.reasonForAppointment && !data.reasonAdditionalInfo,
        })}
      />
      <ContactDetailSection data={data} />
    </>
  );
}

CommunityCareSection.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  vaCityState: PropTypes.string,
};
