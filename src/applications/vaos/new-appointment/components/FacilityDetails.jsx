import React from 'react';
import PropTypes from 'prop-types';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function FacilityDetails({ facility }) {
  const contact = facility?.telecom?.find(tele => tele.system === 'phone')
    ?.value;

  return (
    <p>
      <strong>{facility.name}</strong>
      <br />
      <strong>Main phone: </strong>
      <VaTelephone contact={contact} />
      <span>
        &nbsp;(
        <VaTelephone contact="711" tty data-testid="tty-telephone" />)
      </span>
    </p>
  );
}

FacilityDetails.propTypes = {
  facility: PropTypes.object.isRequired,
};
