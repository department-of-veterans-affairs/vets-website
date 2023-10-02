import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import CallToActionAlert from '../CallToActionAlert';

const NeedsVAPatient = () => {
  const content = {
    heading: 'We couldn’t match your information to our VA patient records',
    alertText: (
      <>
        <p>
          We’re sorry. We couldn’t find a match for you in our VA patient
          records.
        </p>
        <h5>What you can do</h5>
        <p>
          <strong>
            If you’re currently registered as a patient at a VA health facility
          </strong>
        </p>
        <p>
          Call our MyVA411 main information line at (
          <va-telephone contact={CONTACTS.VA_311} />
          ), and select 3 to reach your nearest VA medical center. If you have
          hearing loss, call <va-telephone contact={CONTACTS['711']} tty />.
        </p>
        <p>
          Tell the representative that you tried to sign in to use the health
          tools on VA.gov, but you received an error message telling you that
          the site couldn’t match your information to a VA patient record.
        </p>
        <p>
          <strong>
            If you’re enrolled in VA health care, but not currently registered
            as a patient at a VA health facility
          </strong>
        </p>
        <p>
          Call <va-telephone contact={CONTACTS.VA_311} />, and select 3 to reach
          your nearest VA medical center. If you have hearing loss, call{' '}
          <va-telephone contact={CONTACTS['711']} tty />.
        </p>
        <p>
          Tell the representative that you’re enrolled in VA health care and
          you’d like to register as a VA patient.
        </p>
        <p>
          <strong>If you’re not enrolled in VA health care</strong>
        </p>
        <p>
          You’ll need to apply for VA health care before you can register as a
          VA patient.
        </p>
        <p>
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </p>
      </>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default NeedsVAPatient;
