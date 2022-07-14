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
        <va-accordion-item id="first-dhp-faq">
          <h3 slot="headline">
            What are connected devices and why might I use them?
          </h3>
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
          header="What information can VA access from my devices?"
          id="fourth-dhp-faq"
          data-testid="fourth-faq"
        >
          When you connect a device, you can choose the type of data that will
          be shared with VA.
        </va-accordion-item>
        <va-accordion-item
          header="Who can access data from my connected devices?"
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
    </>
  );
};
