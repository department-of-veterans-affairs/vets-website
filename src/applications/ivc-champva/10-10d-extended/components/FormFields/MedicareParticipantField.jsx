import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import vaRadioFieldMapping from 'platform/forms-system/src/js/web-component-fields/vaRadioFieldMapping';
import { toHash } from '../../../shared/utilities';
import { formatFullName } from '../../helpers';
import { VaRadio, VaRadioOption } from '../../imports';
import content from '../../locales/en/content.json';

const MSG_NA = content['medicare--participant-default'];

const MedicareParticipantField = props => {
  const { childrenProps } = props;
  const mappedProps = vaRadioFieldMapping(props);
  const applicants = useSelector(state => state.form?.data?.applicants ?? []);
  const medicare = useSelector(state => state.form?.data?.medicare ?? []);
  const currentValue = childrenProps?.formData ?? mappedProps?.value;

  const eligibleApplicants = useMemo(
    () => {
      if (!applicants.length) return [];

      const selectedParticipants = new Set(
        medicare.map(plan => plan?.medicareParticipant).filter(Boolean),
      );

      return applicants
        .map(a => ({
          value: toHash(a.applicantSsn),
          label: formatFullName(a.applicantName),
        }))
        .filter(({ value }) => {
          if (value === currentValue) return true;
          return !selectedParticipants.has(value);
        });
    },
    [applicants, currentValue, medicare],
  );

  return (
    <VaRadio
      {...mappedProps}
      onVaValueChange={e => childrenProps?.onChange(e.detail.value)}
    >
      {eligibleApplicants.length ? (
        eligibleApplicants.map(({ value, label }) => (
          <VaRadioOption
            name={mappedProps.name}
            key={value}
            value={value}
            checked={value === currentValue}
            label={label}
          />
        ))
      ) : (
        <VaRadioOption
          name={mappedProps.name}
          value={undefined}
          label={MSG_NA}
        />
      )}
    </VaRadio>
  );
};

MedicareParticipantField.propTypes = {
  childrenProps: PropTypes.shape({
    formData: PropTypes.string,
    onChange: PropTypes.func,
  }),
};

export default MedicareParticipantField;
