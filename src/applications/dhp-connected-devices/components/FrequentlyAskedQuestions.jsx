import React from 'react';

export const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="schemaform-title">
        <h2>Frequently asked questions</h2>
      </div>
      <va-accordion
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
          id="dhp-pilot-first-faq"
          data-testid="pilot-first-faq"
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
          id="dhp-pilot-second-faq"
          data-testid="pilot-second-faq"
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
          id="dhp-pilot-third-faq"
          data-testid="pilot-third-faq"
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
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <h3>Connecting Your Device & Data Sharing</h3>
        <va-accordion-item
          header="What are connected devices and why might I use them?"
          id="third-dhp-faq"
          data-testid="third-faq"
        >
          Connected devices let you share your data from your wearables and
          other health devices with VA. If your VA care team asked you to
          connect your devices, they will be able to access the data you choose
          to share.
        </va-accordion-item>
        <va-accordion-item
          header="How can I connect my devices?"
          id="second-dhp-faq"
          data-testid="second-faq"
        >
          <strong>Take these steps to connect a device:</strong>
          <p />
          <ol>
            <li>
              Sign in to VA.gov with your DS Logon, My HealtheVet, or ID.me
              account
            </li>
            <li>
              Select the <strong>Connect</strong> link below the device you
              would like to connect
            </li>
            <li>
              Follow the instructions shown on the device vendor’s website
            </li>
          </ol>
        </va-accordion-item>
        <va-accordion-item
          header="Can I stop sharing my connected device data with VA?"
          id="third-dhp-faq"
          data-testid="third-faq"
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
            </li>
            <li>
              Select the <strong>Disconnect</strong> button below the device
              name
            </li>
            <li>
              Confirm you would like to disconnect the device by selecting
              <strong> Disconnect Device</strong>
            </li>
          </ol>
        </va-accordion-item>
        <va-accordion-item
          header="What information can VA access from the devices that I have connected on VA.gov?"
          id="fourth-dhp-faq"
          data-testid="fourth-faq"
        >
          When you connect a device, you can choose the type of data that will
          be shared with VA.
        </va-accordion-item>
        <va-accordion-item
          header="Who can access data from the devices I have connected on VA.gov?"
          id="fifth-dhp-faq"
          data-testid="fifth-faq"
        >
          Your VA care team will be able to view the data from your connected
          devices. Authorized researchers at VA may also be able to view data
          from your connected devices, but that data will not be identified as
          yours.
        </va-accordion-item>
        <va-accordion-item
          header="Does VA keep my data after I disconnect a device?"
          id="sixth-dhp-faq"
          data-testid="sixth-faq"
        >
          VA will no longer receive new data from your device after it is
          disconnected. Data shared while your device was connected will not be
          deleted.
        </va-accordion-item>
      </va-accordion>
      <va-accordion
        disable-analytics={{
          value: 'false',
        }}
        section-heading={{
          value: 'null',
        }}
      >
        <va-accordion-item id="first-dhp-faq">
          <h3 slot="headline">
            What are connected devices and why might I use them?
          </h3>
          Connected devices let you share your data from your wearables and
          other health devices with VA. If your VA care team asked you to
          connect your devices, they will be able to access the data you choose
          to share.
        </va-accordion-item>
        <h3>Troubleshooting</h3>
      </va-accordion>
      <va-accordion
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
          id="third-dhp-faq"
          data-testid="third-faq"
        >
          Contact VA-DHP-Pilot@va.gov
        </va-accordion-item>
      </va-accordion>
    </>
  );
};
