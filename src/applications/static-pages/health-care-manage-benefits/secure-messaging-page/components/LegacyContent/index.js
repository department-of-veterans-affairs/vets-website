// Node modules.
import React from 'react';
// Relative imports.
import CallToActionWidget from 'platform/site-wide/cta-widget';
import MoreInfoAboutBenefits from '../../../components/MoreInfoAboutBenefits';

export const LegacyContent = () => (
  <>
    <CallToActionWidget appId="messaging" setFocus={false} />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-can-va-secure-messaging-he">
          How can VA Secure Messaging help me manage my health care?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Secure Messaging is a web-based service that protects your
                sensitive information so you can safely and easily communicate
                electronically with your VA health care team.
              </p>
              <p>
                <strong>You can use Secure Messaging to:</strong>
              </p>
              <ul>
                <li>Ask non-urgent, non-emergency health-related questions</li>
                <li>Give your health care team updates on your condition</li>
                <li>
                  Request VA referrals, test results, and prescription renewals
                </li>
                <li>Manage your VA appointments</li>
                <li>
                  Ask routine administrative questions about topics like
                  scheduling appointments or getting directions
                </li>
                <li>
                  Get health education information from the Veterans Health
                  Library
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="am-i-eligible-to-use-secure-me">
          Am I eligible to use Secure Messaging?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can use this tool if you meet all of the requirements listed
                below.
              </p>
              <p>
                <strong>All of these must be true:</strong>
              </p>
              <ul>
                <li>
                  You’re enrolled in VA health care, <strong>and</strong>
                </li>
                <li>
                  You’re registered as a patient at a VA health facility,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  Your VA health care provider has agreed to communicate with
                  you through Secure Messaging
                </li>
              </ul>
              <p>
                <a href="/health-care/how-to-apply/">
                  Find out how to apply for VA health care
                </a>
              </p>
              <p>
                <strong>And you must have one of these free accounts:</strong>
              </p>
              <ul>
                <li>
                  A Premium <strong>My HealtheVet</strong> account,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  A Premium <strong>DS Logon</strong> account (used for
                  eBenefits and milConnect), <strong>or</strong>
                </li>
                <li>
                  A verified <strong>ID.me</strong> account that you can create
                  here on VA.gov
                </li>
              </ul>
              <p>
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/my-healthevet-offers-three-account-types"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn about the 3 different My HealtheVet account types
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-does-secure-messaging-work">
          How does Secure Messaging work within My HealtheVet?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                With Secure Messaging, you can write messages, save drafts,
                review your sent messages, and keep a record of your
                conversations.
              </p>
              <p>
                You can use Secure Messaging to communicate with any VA health
                care team member who has signed up to participate.
              </p>
              <p>
                You can send non-urgent, non-emergency messages at any time of
                the day or night. Your VA health care team should respond within
                3 business days (Monday through Friday, 8:00 a.m. - 5:00 p.m.,
                except federal holidays). If you’d like, you can set up your
                account to send a notification to your personal email when you
                receive a new secure message.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-use-secure-messaging-for">
          Can I use Secure Messaging for medical emergencies or urgent needs?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                No. You shouldn’t use Secure Messaging when you have an urgent
                need, because it may take a few days for you to get a reply.
              </p>
              <p>
                <strong>If you think you have a medical emergency,</strong> call
                911 or go to the nearest emergency room.
              </p>
              <p>
                <strong>
                  If you don’t have an emergency, but you’re not sure what type
                  of care you need,
                </strong>{' '}
                call your nearest VA health facility.
                <br />
                <a href="/find-locations/">
                  Find your nearest VA health facility
                </a>
              </p>
              <p>
                <strong>If you need to talk with someone right away,</strong>{' '}
                contact the Veterans Crisis Line. Whatever you’re struggling
                with—chronic pain, anxiety, depression, trouble sleeping, anger,
                or even homelessness—we can support you. Our Veterans Crisis
                Line is confidential (private), free, and available 24/7.
              </p>
              <p>
                To connect with a Veterans Crisis Line responder anytime, day or
                night:
              </p>
              <ul>
                <li>
                  Call <a href="tel:+18002738255">800-273-8255</a>, then select
                  1.
                </li>
                <li>
                  Start a{' '}
                  <a href="https://www.veteranscrisisline.net/get-help/chat">
                    confidential Veterans Chat
                  </a>
                  .
                </li>
                <li>
                  Text <a href="tel:+1838255">838255</a>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-use-secure-messaging-to-">
          Can I use Secure Messaging to communicate with non-VA providers?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                No. You can communicate only with your VA providers who’ve
                agreed to participate in Secure Messaging.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Yes. This is a secure website. We follow strict security
                policies and practices to protect your personal health
                information. And only you and your VA health care team will have
                access to your secure messages.
              </p>
              <p>
                If you print or download any messages, you’ll need to take
                responsibility for protecting that information.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get tips for protecting your personal health information
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                If you have more questions about Secure Messaging on
                MyHealtheVet, please got to the{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#smGeneralFAQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Secure Messaging FAQs
                </a>{' '}
                on the My HealtheVet web portal.
              </p>
              <p>
                Or contact the My HealtheVet help desk at{' '}
                <a href="tel:+18773270022">877-327-0022</a> (TTY:{' '}
                <a href="tel:+18008778339">800-877-8339</a>. We&apos;re here
                Monday through Friday, 7:00 a.m. to 7:00 p.m. CT.
              </p>
              <p>
                You can also{' '}
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  contact us online
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default LegacyContent;
