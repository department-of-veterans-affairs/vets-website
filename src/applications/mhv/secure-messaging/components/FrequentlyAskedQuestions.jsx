import React from 'react';
import FeedbackEmail from './shared/FeedbackEmail';
import { openCrisisModal } from '../util/helpers';

const FrequentlyAskedQuestions = ({ prefLink }) => {
  return (
    <div className="secure-messaging-faq">
      <h2 className="vads-u-margin-top--1">Questions about using messages</h2>

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
            send it to. Your list of care teams will depend on where you get
            care.
          </p>
          <p>
            If your care team isn’t in your list of teams to send messages to,
            contact your VA health facility. Ask to connect with the My
            HealtheVet coordinator.
          </p>
          <a href="/find-locations/">Find your nearest VA health facility</a>

          <h4>Getting replies from different providers</h4>
          <p>
            You may get a reply from your regular VA provider. Or you may get a
            reply from a different provider or staff member on your care team.
          </p>
          <p>
            In some cases, we may decide that a different team needs to answer
            your questions. We’ll reassign the conversation to that team so that
            they can reply to you. But only VA providers and staff will be able
            to read your messages.
          </p>
        </va-accordion-item>

        <va-accordion-item>
          <h3 slot="headline">
            What if I have an emergency or an urgent question?
          </h3>
          <p>
            Only use messages for non-urgent needs. After you send a message, it
            can take up to 3 business days to get a reply.
          </p>
          <p>Here’s how to get help for urgent needs:</p>
          <ul>
            <li>
              <strong>
                If you’re in crisis or having thoughts of suicide,{' '}
              </strong>{' '}
              our Veterans Crisis Line offers confidential support anytime day
              or night.
              <br />
              <va-button
                secondary="true"
                text="Connect with the Veterans Crisis Line"
                onClick={openCrisisModal}
              />
            </li>
            <li>
              <strong>If you think your life or health is in danger, </strong>{' '}
              call <va-telephone contact="911" /> or go to the nearest emergency
              room.
            </li>
          </ul>
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
        {/*
        <va-accordion-item>
          <h3 slot="headline">
            Will my messages become part of my VA medical record?
          </h3>
          <p>
            This depends. Your care team may decide to include certain messages
            in your medical record.
          </p>
        </va-accordion-item>
        */}
        <va-accordion-item>
          <h3 slot="headline">
            What happened to my settings from My HealtheVet secure messaging?
          </h3>
          <p>
            Your notification settings and your list of care teams will stay the
            same as they were on the My HealtheVet website.
          </p>
          <p>
            If you want to change your notification setting or your list of care
            teams, you’ll need to go to the My HealtheVet website to make
            changes.
          </p>
          <p>
            <a href={prefLink} target="_blank" rel="noreferrer">
              Go to the My HealtheVet website
            </a>
          </p>
          <p>
            Signature settings aren’t available in this new messaging tool. If
            you have questions about your settings, you can send us an email.
          </p>
          <p>
            Email us at <FeedbackEmail />
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default FrequentlyAskedQuestions;
