import React from 'react';

export const FirstFAQSection = () => {
  return (
    <>
      <h3 className="dhp-faq-section-header">DHP Fitbit Pilot</h3>
      <va-accordion
        bordered
        data-testid="faq-first-section"
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
        uswds
      >
        <va-accordion-item
          header="Why are we doing this pilot?"
          id="dhp-faq-first-section-first-question"
          aria-controls="dhp-faq-first-section-first-question"
          data-testid="faq-first-section-first-question"
          uswds
        >
          The VA Digital Health Pathway Fitbit Pilot (i.e., the Pilot) is an
          effort designed to evaluate how VA can provide you with an opportunity
          to share your patient-generated data (PGD) with your VA care team.
          This pilot is not meant to replace normal care activities between you
          and your VA care team. The estimated duration of this pilot is 6-12
          months, after which your ability to connect and share data through the
          Digital Health Pathway may be discontinued.
        </va-accordion-item>
        <va-accordion-item
          header="What can I expect if I participate in this pilot?"
          id="dhp-faq-first-section-second-question"
          aria-controls="dhp-faq-first-section-second-question"
          data-testid="faq-first-section-second-question"
          uswds
        >
          By participating in the pilot, the data you choose to share with the
          VA may be accessed by your VA care team and discussed with you. At any
          time, you can choose to opt out of the pilot and disconnect your
          device in the Connected Devices section. If you choose to opt out of
          the pilot, any data will be retained for a minimum timeframe of 6-12
          months (duration of the pilot). At the end of the pilot, data will be
          retained for a minimum timeframe of 6 to 12 months.
        </va-accordion-item>
        <va-accordion-item
          header="Do I have to participate in this pilot?"
          id="dhp-faq-first-section-third-question"
          aria-controls="dhp-faq-first-section-third-question"
          data-testid="faq-first-section-third-question"
          uswds
        >
          It is your decision to be part of this pilot program. Your
          participation is voluntary and have the right to refuse to
          participate. You do not have to take part in this pilot to receive
          treatment at the VA. Your choice will not affect in any way your
          current or future medical care or any other benefits from VA to which
          you are otherwise entitled.
        </va-accordion-item>
        <va-accordion-item
          header="What is a connected device and why might I use one?"
          id="dhp-faq-first-section-fourth-question"
          aria-controls="dhp-faq-first-section-fourth-question"
          data-testid="faq-first-section-fourth-question"
          uswds
        >
          A connected device is any device that can connect to the internet so
          that it can communicate with other devices or computers. Examples of
          connected devices include smartphones, wearable fitness trackers (like
          a Fitbit), or a connected blood pressure cuff. Many connected devices
          let you share your data from the device with other people such as your
          care provider. If your VA care team asked you to connect your device,
          they will be able to access the data you choose to share.
        </va-accordion-item>
      </va-accordion>
    </>
  );
};

export const SecondFAQSection = () => {
  return (
    <>
      <h3 className="dhp-faq-section-header">
        Connecting Your Device & Data Sharing
      </h3>
      <va-accordion
        bordered
        data-testid="faq-second-section"
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
        uswds
      >
        <va-accordion-item
          header="How can I connect my device?"
          id="dhp-faq-second-section-first-question"
          aria-controls="dhp-faq-second-section-first-question"
          data-testid="faq-second-section-first-question"
          uswds
        >
          <strong>Take these steps to connect a device:</strong>
          <p />
          <ol>
            <li>
              <strong>Sign in</strong> to VA.gov with your DS Logon, My
              HealtheVet, or ID.me account
              <ol type="a">
                <li>
                  <a
                    href="https://www.va.gov/resources/signing-in-to-vagov/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Signing in to VA.gov guide
                  </a>
                </li>
              </ol>
            </li>
            <li>
              Select the <strong>Connect</strong> link below the device you
              would like to connect
            </li>
            <li>
              Follow the instructions shown on the device vendor’s website
            </li>
          </ol>
          <p />
          Watch this{' '}
          <a
            href="https://www.youtube.com/watch?v=37aRcEZ3vyo"
            aria-label="This video will help Veterans connect their Fitbit device to va.gov"
            target="_blank"
            rel="noreferrer"
          >
            video
          </a>{' '}
          for detailed instructions on how to connect your device.
        </va-accordion-item>
        <va-accordion-item
          header="Can I stop sharing my connected device data with VA?"
          id="dhp-faq-second-section-second-question"
          aria-controls="dhp-faq-second-section-second-question"
          data-testid="faq-second-section-second-question"
          uswds
        >
          Yes. If you no longer want to share your information with VA, you can
          disconnect your device at any time. The device will then no longer
          share new data with VA.
          <p />
          <strong>To disconnect a device:</strong>
          <p />
          <ol>
            <li>
              <strong>Sign in</strong> to VA.gov with your DS Logon, My
              HealtheVet, or ID.me account
              <ol type="a">
                <li>
                  <a
                    href="https://www.va.gov/resources/signing-in-to-vagov/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Signing in to VA.gov guide
                  </a>
                </li>
              </ol>
            </li>
            <li>
              Select the <strong>Disconnect</strong> button below the device
              name
            </li>
            <li>
              Confirm you would like to disconnect the device by selecting{' '}
              <strong>Disconnect Device</strong>
            </li>
          </ol>
          <p />
          Watch this{' '}
          <a
            href="https://www.youtube.com/watch?v=37aRcEZ3vyo"
            aria-label="This video will help Veterans disconnect their Fitbit device to va.gov"
            target="_blank"
            rel="noreferrer"
          >
            video
          </a>{' '}
          for detailed instructions on how to disconnect your device. When you
          connect a device, such as a Fitbit, you will be able to choose the
          type of data (for example, heart rate, exercise, sleep, activity,
          and/or diet data) to share with the VA and your care team as part of
          the Pilot.
        </va-accordion-item>
        <va-accordion-item
          header="What information can VA access from the devices that I have connected on VA.gov?"
          id="dhp-faq-second-section-third-question"
          aria-controls="dhp-faq-second-section-third-question"
          data-testid="faq-second-section-third-question"
          uswds
        >
          When you connect a device, such as a Fitbit , you will be able to
          choose the type of data (for example, heart rate, exercise, sleep,
          activity, and/or diet data) to share with the VA and your care team as
          part of the Pilot.
        </va-accordion-item>
        <va-accordion-item
          header="Who can access data from the devices I have connected on VA.gov?"
          id="dhp-faq-second-section-fourth-question"
          aria-controls="dhp-faq-second-section-fourth-question"
          data-testid="faq-second-section-fourth-question"
          uswds
        >
          The primary individuals who will have access to your device include
          your VA care team. However, any of the information collected via
          VA.gov, including data shared with VA from your connected device as a
          part of this Pilot, may be shared with employees, contractors, and
          other service providers as necessary to respond to a request, provide
          a service, or as otherwise authorized by law.
        </va-accordion-item>
        <va-accordion-item
          header="How will my private information be protected?"
          id="dhp-faq-second-section-fifth-question"
          aria-controls="dhp-faq-second-section-fifth-question"
          data-testid="faq-second-section-fifth-question"
          uswds
        >
          We will keep information about you, including any patient-generated
          data that you share through VA.gov, confidential to the extent
          required by law. VA will not sell, rent, or otherwise provide your
          information to outside marketers. Information collected via VA.gov,
          include data shared with VA as a part of this pilot, may be shared
          with employees, contractors, and other service providers as necessary
          to respond to a request, provide a service, or as otherwise authorized
          by law. For more information on VA.gov protection refer to the{' '}
          <a
            href="https://www.va.gov/privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          .
        </va-accordion-item>
        <va-accordion-item
          header="What will happen if I decide to disconnect my device?"
          id="dhp-faq-second-section-sixth-question"
          aria-controls="dhp-faq-second-section-sixth-question"
          data-testid="faq-second-section-sixth-question"
          uswds
        >
          VA will no longer receive new data from your device after it is
          disconnected. The data shared while your device was connected to
          VA.gov will not be deleted.
        </va-accordion-item>
      </va-accordion>
    </>
  );
};

export const ThirdFAQSection = () => {
  return (
    <>
      <h3 className="dhp-faq-section-header">Troubleshooting</h3>
      <va-accordion
        bordered
        data-testid="faq-third-section"
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
        uswds
      >
        <va-accordion-item
          header="I am having issues with my Fitbit or my Fitbit account"
          id="dhp-faq-third-section-first-question"
          aria-controls="dhp-faq-third-section-first-question"
          data-testid="faq-third-section-first-question"
          uswds
        >
          Please visit the{' '}
          <a
            href="https://myhelp.fitbit.com/s/support?language=en_US"
            target="_blank"
            rel="noreferrer"
          >
            Fitbit support website
          </a>{' '}
          or call <va-telephone contact="8776234997" international /> for Fitbit
          related help.
          <ul>
            <li>I cannot log into my Fitbit account</li>
            <li>My Fitbit isn’t syncing</li>
            <li>I want to set up my Fitbit</li>
            <li>How do I restart my Fitbit?</li>
            <li>Etc.</li>
          </ul>
        </va-accordion-item>
        <va-accordion-item
          header="I can’t log in or need help with my VA account"
          id="dhp-faq-third-section-second-question"
          aria-controls="dhp-faq-third-section-second-question"
          data-testid="faq-third-section-second-question"
          uswds
        >
          <a
            href="https://www.va.gov/resources/signing-in-to-vagov/"
            target="_blank"
            rel="noreferrer"
          >
            Signing in to VA.gov guide.
          </a>{' '}
          Please contact the VA help desk that applies to you from the list
          below:
          <ul>
            <li>
              <strong>Login.gov</strong> - Access the Login.gov help center at{' '}
              <va-telephone contact="8448756446" international />
            </li>
            <li>
              <strong>ID.me</strong> - Go to the ID.me help center at{' '}
              <a href="https://help.id.me/" target="_blank" rel="noreferrer">
                https://help.id.me
              </a>
            </li>
            <li>
              <strong>DS Logon</strong> - Call the DMDC Support Office at{' '}
              <va-telephone contact="8005389552" international />
            </li>
            <li>
              <strong>My HealtheVet</strong> - Contact the My HealtheVet Help
              Desk at <va-telephone contact="8773270022" international /> or{' '}
              <va-telephone contact="8008778339" tty international /> (TTY),
              Monday to 7:00 a.m. — 7:00 p.m. (Central Time)
            </li>
            <ul>
              <li>
                <a
                  href="https://www.myhealth.va.gov/forgot-user-id?action=new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Forgot Your My HealtheVet User ID
                </a>{' '}
                (Continue to My HealtheVet Only)
              </li>
              <li>
                <a
                  href="https://www.myhealth.va.gov/forgot-password?action=new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Forgot Your My HealtheVet Password
                </a>{' '}
                (Continue to My HealtheVet Only)
              </li>
            </ul>
          </ul>
        </va-accordion-item>
      </va-accordion>
    </>
  );
};

export const FourthFAQSection = () => {
  return (
    <>
      <h3 className="dhp-faq-section-header">Feedback</h3>
      <va-accordion
        bordered
        data-testid="faq-fourth-section"
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
        uswds
      >
        <va-accordion-item
          header="I have general questions or feedback about the pilot"
          id="dhp-faq-fourth-section-first-question"
          aria-controls="dhp-faq-fourth-section-first-question"
          data-testid="faq-fourth-section-first-question"
          uswds
        >
          Contact{' '}
          <a href="mailto:VA-DHP-Pilot@va.gov" target="_blank" rel="noreferrer">
            VA-DHP-Pilot@va.gov
          </a>
        </va-accordion-item>
      </va-accordion>
    </>
  );
};
