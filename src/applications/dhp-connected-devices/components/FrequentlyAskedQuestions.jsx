import React from 'react';

export const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="schemaform-title">
        <h2>Frequently Asked Questions</h2>
      </div>
      <va-accordion
        bordered
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <h3>DHP Fitbit Pilot</h3>
        <va-accordion-item
          header="Why are we doing this pilot with Fitbit?"
          id="dhp-faq-first-section-first-question"
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
      <va-accordion
        bordered
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <h3>Connecting Your Device & Data Sharing</h3>
        <va-accordion-item
          header="How can I connect my device?"
          id="dhp-faq-second-section-first-question"
          data-testid="faq-second-section-first-question"
        >
          <strong>Take these steps to connect a device:</strong>
          <p />
          <ol>
            <li>
              Sign in to VA.gov with your DS Logon, My HealtheVet, or ID.me
              account
              {/* TODO Signing in to VA.gov guide */}
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
          Watch this video for detailed instructions on how to connect your
          device.
        </va-accordion-item>
        <va-accordion-item
          header="Can I stop sharing my connected device data with VA?"
          id="dhp-faq-second-section-second-question"
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
              {/* TODO Signing in to VA.gov guide */}
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
          Watch this video for detailed instructions on how to disconnect your
          device.
          {/* TODO link */}
        </va-accordion-item>
        <va-accordion-item
          header="What information can VA access from the devices that I have connected on VA.gov?"
          id="dhp-faq-second-section-third-question"
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
          data-testid="faq-second-section-sixth-question"
        >
          VA will no longer receive new data from your device after it is
          disconnected. Data shared while your device was connected will not be
          deleted.
        </va-accordion-item>
      </va-accordion>
      <va-accordion
        bordered
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <h3>Troubleshooting</h3>
        <va-accordion-item
          header="I am having issues with my Fitbit or my Fitbit account"
          id="dhp-faq-third-section-first-question"
          data-testid="faq-third-section-first-question"
        >
          Please visit the Fitbit support website or call 877-623-4997 for
          Fitbit related help.
          {/* TODO link to Fitbit support */}
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
          data-testid="faq-third-section-second-question"
        >
          <a href="va.gov">Signing in to VA.gov guide.</a> Please contact the VA
          help desk that applies to you from the list below:
          {/* TODO link to Signing in */}
          <ul>
            <li>
              Login.gov - Access the Login.gov help center at 844-875-6446
            </li>
            <li>ID.me - Go to the ID.me help center at 855-927-4363</li>
            <li>DS Logon - Call the DMDC Support Office at 800-538-9552</li>
            <li>
              My HealtheVet - Contact the My HealtheVet Help Desk at
              877-327-0022 or 800-877-8339 (TTY), Monday to Friday, 7:00 a.m. —
              7:00 p.m. (Central Time)
            </li>
            <li>
              Forgot Your My HealtheVet User ID (Continue to My HealtheVet Only)
            </li>
            <li>
              Forgot Your My HealtheVet Password (Continue to My HealtheVet
              Only)
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>
      <va-accordion
        bordered
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <h3>Feedback</h3>
        <va-accordion-item
          header="I have general questions or feedback about the pilot"
          id="dhp-faq-fourth-section-first-question"
          data-testid="faq-fourth-section-first-question"
        >
          Contact VA-DHP-Pilot@va.gov
        </va-accordion-item>
      </va-accordion>
    </>
  );
};
