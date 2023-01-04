import React from 'react';

const FrequentlyAskedQuestions = () => {
  return (
    <div className="secure-messaging-faq vads-u-padding-bottom--9">
      <h2 className="vads-u-margin-top--1">
        Questions about this messaging tool
      </h2>

      <va-accordion open-single>
        <va-accordion-item>
          <h3 slot="headline">Who can I communicate with in messages?</h3>
          <p>
            You can communicate with VA providers on your care team. Most VA
            providers use this tool—but some don’t. Ask your care team if
            sending messages is the best way to communicate with them.
          </p>
          <p>
            You can’t use this tool with community care providers or other
            non-VA providers.
          </p>

          <h4>Sending messages to your care team</h4>
          <p>
            When you start a new message, you’ll need to select a care team to
            send it to. Depending on where you get care, you may be able to
            select several different teams to send messages to (such as 2
            different departments at your VA health facility).
          </p>
          <p>
            If your care team isn’t in your list of teams to send messages to,
            contact your VA health facility and ask to speak to the My
            HealtheVet coordinator.
          </p>
          <a href="/find-locations/">Find your VA health facility</a>

          <h4>Getting replies from different providers</h4>
          <p>
            You may get a reply from your regular VA provider. Or you may get a
            reply from a different provider or staff member on your care team.
          </p>
          <p>
            In some cases, we may decide that a different team can better answer
            your questions. We’ll reassign the conversation to that team so that
            they can reply to you.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h3 slot="headline">
            What if I have an emergency or an urgent question?
          </h3>
          <p>
            Don’t use this messaging tool for emergencies or urgent needs. After
            you send a message, it can take up to 3 business days to get a
            reply.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h3 slot="headline">
            Will VA protect my personal health information?
          </h3>
          <p>
            Yes. This is a secure website. We follow strict security policies
            and practices to protect your personal health information. Only you
            and your VA care team will have access to your messages.
          </p>
          <p>
            If you print or download any messages, you’ll need to take
            responsibility for protecting that information.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h3 slot="headline">
            Will my messages become part of my VA medical record?
          </h3>
          <p>
            This depends. Your care team may decide to include certain messages
            in your medical record.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h3 slot="headline">
            What happened to my settings from My HealtheVet secure messaging?
          </h3>
          <p />
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
