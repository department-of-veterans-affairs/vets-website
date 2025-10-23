import React from 'react';
import PropTypes from 'prop-types';
import { nameWording, privWrapper } from '../../../shared/utilities';

const MedicalEobDescription = ({ formData }) => {
  const name = nameWording(formData, true, false, true);
  const yourOrTheir = name.toLowerCase() === 'your' ? name : 'their';
  const ddSafeName = privWrapper(name);
  return (
    <>
      <p>
        You’ll need to submit a copy of the explanation of benefits from{' '}
        {ddSafeName} insurance provider. This is not the same as the summary of
        benefits for the health insurance policy. The explanation of benefits
        lists what {yourOrTheir} other health insurance already paid for this
        specific claim.
      </p>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="/resources/how-to-file-a-champva-claim/"
        >
          Learn more about what an explanation of benefits is (opens in a new
          tab)
        </a>
      </p>
      <p>
        <strong>
          The explanation of benefits must include all of this information:
        </strong>
      </p>
      <ul>
        <li>
          <strong>Date of service</strong> that matches the date of care.
        </li>
        <li>
          <strong>The health care provider’s:</strong>
          <ul style={{ listStyleType: 'disc' }}>
            <li>Name.</li>
            <li>
              10-digit NPI (National Provider Identifier) code if not shown on
              itemized billing statement.
            </li>
          </ul>
        </li>
        <li>
          <strong>The services</strong> the insurance provider paid for. This
          may be a 5-digit CPT (Current Procedural Terminology) or HCPCS
          (Healthcare Common Procedure Coding System) code or a description of
          the service or medical procedure.
        </li>
        <li>
          <strong>The amount paid</strong> by the insurance provider.
        </li>
      </ul>
      <p>
        <strong>Note:</strong> An explanation of benefits is usually sent by
        mail or email. Contact {ddSafeName} insurance provider if you have more
        questions about where to find this document.
      </p>
      <p>
        You can also submit any other documents you think may be relevant to
        this claim.
      </p>
    </>
  );
};

MedicalEobDescription.propTypes = {
  formData: PropTypes.object,
};

export default MedicalEobDescription;
