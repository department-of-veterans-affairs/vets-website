import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import PreferredDatesSection from './PreferredDatesSection';
import SelectedProviderSection from './SelectedProviderSection';

export default function CommunityCareSection({ data, vaCityState }) {
  return (
    <>
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <SelectedProviderSection data={data} vaCityState={vaCityState} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ReasonForAppointmentSection data={data} />
      <hr
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
  vaCityState: PropTypes.string,
};
