import React from 'react';
import MessageTemplate from '../MessageTemplate';

const NeedsVAPatient = () => {
  const content = {
    heading: 'We couldn’t match your information to our VA patient records',
    alertContent: (
      <>
        We’re sorry. We couldn’t find a match for you in our VA patient records.
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h4>What you can do</h4>
        <p>
          <strong>
            If you’re currently registered as a patient at a VA health facility
          </strong>
        </p>
        <p>
          Call VA311 (<a href="tel:844-698-2311">844-698-2311</a>
          ), and select 3 to reach your nearest VA medical center. If you have
          hearing loss, call TTY: 711.
        </p>
        <p>
          Tell the representative that you tried to sign in to use health tools
          on VA.gov, but you received an error message telling you that the site
          couldn’t match your information to a VA patient record.
        </p>
        <p>
          <strong>
            If you’re enrolled in VA health care, but not currently registered
            as a patient at a VA health facility
          </strong>
        </p>
        <p>
          Call <a href="tel:844-698-2311">844-698-2311</a>, and select 3 to
          reach your nearest VA medical center. If you have hearing loss, call
          TTY: 711.
        </p>
        <p>
          Tell the representative that you’re enrolled in VA health care and
          you’d like to register as a VA patient.
        </p>
        <p>
          <strong>If you’re not enrolled in VA health care</strong>
        </p>
        <p>
          You’ll need to apply for VA health care benefits before you can
          register as a VA patient.
        </p>
        <p>
          <a href="/health-care/how-to-apply/">
            Find out how to apply for VA health care
          </a>
        </p>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default NeedsVAPatient;
