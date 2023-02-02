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
      >
        <va-accordion-item
          header="Why are we doing this pilot with Fitbit?"
          id="dhp-faq-first-section-first-question"
          aria-controls="dhp-faq-first-section-first-question"
          data-testid="faq-first-section-first-question"
        >
          The goal of the Digital Health Platform Fitbit pilot (the “Pilot”) is
          to help the VA understand the best ways for Veterans to connect and
          share their connected device data (i.e., data from a Fitbit) with
          their VA care team. By volunteering to connect your device, you will
          be helping the VA and other Veterans by supporting an early-stage
          evaluation of a new offering from VA. We expect this pilot to take
          about 6 to 12 months, and your ability to connect your device with the
          VA to share data through the Digital Health Platform may be
          discontinued after the pilot is over. There may still be other ways
          for you to keep sharing the data with your care team at that time, and
          we will let you know about any available options after the Pilot is
          over. The Pilot is not meant to replace normal care activities between
          you and your VA care team.
        </va-accordion-item>
        <va-accordion-item
          header="Do I have to participate in this pilot?"
          id="dhp-faq-first-section-second-question"
          aria-controls="dhp-faq-first-section-second-question"
          data-testid="faq-first-section-second-question"
        >
          It is your decision to be part of this Pilot program. It is completely
          voluntary. Your participation is voluntary, and you have the right to
          refuse to participate. You do not have to take part in this Pilot to
          receive treatment at the VA. Your choice will not affect in any way
          your current or future medical care or any other benefits from the VA
          to which you are otherwise entitled.
        </va-accordion-item>
        <va-accordion-item
          header="What is a connected device and why might I use one?"
          id="dhp-faq-first-section-third-question"
          aria-controls="dhp-faq-first-section-third-question"
          data-testid="faq-first-section-third-question"
        >
          A connected device is any device that can connect to the internet so
          that it can communicate with other devices or computers. Examples of
          connected devices including smartphones, wearable fitness trackers
          (like a Fitbit), or a connected blood pressure cuff. Many connected
          devices let you share your data from the device with other people such
          as your care provider. If your VA care team asked you to connect your
          device, they will be able to access the data you choose to share.
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
      >
        <va-accordion-item
          header="How can I connect my device?"
          id="dhp-faq-second-section-first-question"
          aria-controls="dhp-faq-second-section-first-question"
          data-testid="faq-second-section-first-question"
        >
          <strong>Take these steps to connect a device:</strong>
          <p />
          <ol>
            <li>
              Sign in to VA.gov with your DS Logon, My HealtheVet, or ID.me
              account
              <ol type="a">
                <li>
                  <a href="https://www.va.gov/resources/signing-in-to-vagov/">
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
          <a href="https://www.youtube.com/watch?v=37aRcEZ3vyo">video</a> for
          detailed instructions on how to connect your device.
        </va-accordion-item>
        <va-accordion-item
          header="Can I stop sharing my connected device data with VA?"
          id="dhp-faq-second-section-second-question"
          aria-controls="dhp-faq-second-section-second-question"
          data-testid="faq-second-section-second-question"
        >
          Yes. If you no longer want to share your information with VA, you can
          disconnect your device at any time. The device will then no longer
          share new data with VA.
          <p />
          <strong>To disconnect a device:</strong>
          <p />
          <ol>
            <li>
              Sign in to VA.gov with your DS Logon, My HealtheVet, or ID.me
              account
              <ol type="a">
                <li>
                  <a href="https://www.va.gov/resources/signing-in-to-vagov/">
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
              Confirm you would like to disconnect the device by selecting
              Disconnect Device
            </li>
          </ol>
          <p />
          Watch this{' '}
          <a href="https://www.youtube.com/watch?v=37aRcEZ3vyo">video</a> for
          detailed instructions on how to disconnect your device.
        </va-accordion-item>
        <va-accordion-item
          header="What information can VA access from the devices that I have connected on VA.gov?"
          id="dhp-faq-second-section-third-question"
          aria-controls="dhp-faq-second-section-third-question"
          data-testid="faq-second-section-third-question"
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
        >
          VA will keep information about you, including any connected device
          data that you share, strictly confidential to the extent required by
          law. The VA will not sell, rent, or otherwise provide your personal
          information to outside marketers. Information collected via VA.gov,
          including data shared with VA as a part of this Pilot, may be shared
          with employees, contractors, and other service providers as necessary
          to respond to a request, provide a service, or as otherwise authorized
          by law.
        </va-accordion-item>
        <va-accordion-item
          header="Does VA keep my data after I disconnect a device?"
          id="dhp-faq-second-section-sixth-question"
          aria-controls="dhp-faq-second-section-sixth-question"
          data-testid="faq-second-section-sixth-question"
        >
          VA will no longer receive new data from your device after it is
          disconnected. Data shared while your device was connected will not be
          deleted.
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
      >
        <va-accordion-item
          header="I am having issues with my Fitbit or my Fitbit account"
          id="dhp-faq-third-section-first-question"
          aria-controls="dhp-faq-third-section-first-question"
          data-testid="faq-third-section-first-question"
        >
          Please visit the{' '}
          <a href="https://myhelp.fitbit.com/s/support?language=en_US">
            Fitbit support website
          </a>{' '}
          or call{' '}
          <va-telephone
            contact="8776234997"
            aria-label="8 7 7. 6 2 3. 4 9 9 7."
            international
          />{' '}
          for Fitbit related help.
          <ul>
            <li>I cannot log into my Fitbit account</li>
            <li>My Fitbit isn’t syncing</li>
            <li>I want to set up my Fitbit</li>
            <li>How do I restart my Fitbit?</li>
            <li>Etc.</li>
          </ul>
        </va-accordion-item>
        <va-accordion-item
          header="I can’t login or need help with my VA account"
          id="dhp-faq-third-section-second-question"
          aria-controls="dhp-faq-third-section-second-question"
          data-testid="faq-third-section-second-question"
        >
          <a href="https://www.va.gov/resources/signing-in-to-vagov/">
            Signing in to VA.gov guide.
          </a>{' '}
          Please contact the VA help desk that applies to you from the list
          below:
          <ul>
            <li>
              Login.gov - Access the Login.gov help center at{' '}
              <va-telephone
                contact="8448756446"
                aria-label="8 4 4. 8 7 5. 6 4 4 6."
                international
              />
            </li>
            <li>
              ID.me - Go to the ID.me help center at{' '}
              <va-telephone
                contact="8559274363"
                aria-label="8 5 5. 9 2 7. 4 3 6 3."
                international
              />
            </li>
            <li>
              DS Logon - Call the DMDC Support Office at{' '}
              <va-telephone
                contact="8005389552"
                aria-label="8 0 0. 5 3 8. 9 5 5 2."
                international
              />
            </li>
            <li>
              My HealtheVet - Contact the My HealtheVet Help Desk at{' '}
              <va-telephone
                contact="8773270022"
                aria-label="8 7 7. 3 2 7. 0 0 2 2."
                international
              />{' '}
              or{' '}
              <va-telephone
                contact="8008778339"
                aria-label="TTY. 8 0 0. 8 7 7. 8 3 3 9."
                tty
                international
              />{' '}
              (TTY), Monday to 7:00 a.m. — 7:00 p.m. (Central Time)
            </li>
            <ul>
              <li>
                <a href="https://www.myhealth.va.gov/forgot-user-id?action=new">
                  Forgot Your My HealtheVet User ID
                </a>{' '}
                (Continue to My HealtheVet Only)
              </li>
              <li>
                <a href="https://www.myhealth.va.gov/forgot-password?action=new">
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
      >
        <va-accordion-item
          header="I have general questions or feedback about the pilot"
          id="dhp-faq-fourth-section-first-question"
          aria-controls="dhp-faq-fourth-section-first-question"
          data-testid="faq-fourth-section-first-question"
        >
          Contact <a href="mailto:VA-DHP-Pilot@va.gov">VA-DHP-Pilot@va.gov</a>
        </va-accordion-item>
      </va-accordion>
    </>
  );
};
