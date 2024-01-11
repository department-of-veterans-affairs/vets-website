import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default [
  {
    header: `General disclaimer`,
    content: (
      <>
        <p>
          To sign in to VA.gov and most other VA online services, you must
          accept the VA online services terms of use.
        </p>
        <p>
          <strong>Note:</strong> In these terms of use, “we,” "our,” and “us”
          refer to VA. “You” and “your” refer to you as the person signing in to
          VA online services to manage your benefits and health care.
        </p>
        <p>
          When you sign in to VA.gov or another Department of Veteran Affairs
          (VA) online service, you’re using a United States federal government
          information system.
        </p>
        <p>
          When you accept these terms, you confirm that you understand the rules
          for using this system:
        </p>
        <ul>
          <li>
            You must only access and use information you have the legal
            authority to access and use. We monitor and record your activity on
            the system. And we share this information with auditors and law
            enforcement officials as required.
          </li>
          <li>
            Federal law and VA policy prohibit unauthorized use of this system.
            Unauthorized use may result in criminal, civil, or administrative
            penalties. The related federal laws include{' '}
            <a
              href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-1994-title18-section1030&num=0&edition=1994"
              rel="noopener noreferrer"
              target="_blank"
            >
              18 U.S.C. 1030 (Fraud and Related Activity in Connection with
              Computers)
            </a>{' '}
            and{' '}
            <a
              href="https://uscode.house.gov/view.xhtml?req=(title:18%20section:2701%20edition:prelim"
              rel="noopener noreferrer"
              target="_blank"
            >
              18 U.S.C. 2701 (Unlawful Access to Stored Communications)
            </a>
            .
          </li>
        </ul>
        <p>Unauthorized or prohibited use includes these actions:</p>
        <ul>
          <li>
            Gaining unauthorized access or making unauthorized changes to the
            system or its data.
          </li>
          <li>Harming, destroying, or misusing the system or its data.</li>
          <li>
            Impersonating another person (signing in as or pretending to be
            another person). (<strong>Note:</strong> This does not restrict
            authorized use by a VA-documented representative.)
          </li>
          <li>
            Using secure messaging to promote your personal agenda, for
            solicitation, or to transmit prohibited material. (
            <strong>Note:</strong> You may use messaging only to communicate
            with your VA health care team about your health care and VA benefits
            and services, and with VA staff about your privacy rights.)
          </li>
          <li>
            Sending material that infringes on the patents, trademarks,
            copyrights, trade secrets, privacy, or publicity rights of others.
          </li>
          <li>
            Transmitting material that is excessive, illegal, offensive,
            intimidating, harmful, or threatening to any person (including VA
            staff) or entity as we determine using our discretion.
          </li>
          <li>
            Using deep-links, page-scrapes, spidering, or applications that
            gather, copy, change, replicate, or monitor any portion of VA
            websites or mobile applications.
          </li>
        </ul>
        <p>
          If we suspect any unauthorized use or violation of these terms, we may
          suspend or block your access to this system. If you suspect
          unauthorized or inappropriate use of the system, report it to us.
        </p>
        <p>
          If you don’t accept these terms, you won’t be able to sign in to
          VA.gov or other VA online services covered by these terms. If you have
          concerns or questions, or want to report an issue, call our MyVA411
          main information line at <va-telephone contact={CONTACTS.VA_411} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ).
        </p>
        <p>
          We take the responsibility of protecting your information seriously.
          To learn more about how we collect and use your information, read the
          sections titled <strong>Privacy Act statement</strong> and{' '}
          <strong>Sharing of your information and data</strong>.
        </p>
      </>
    ),
  },
  {
    header: `Use of VA online services`,
    content: (
      <>
        <p>
          Groups of people who use VA.gov and other VA online tools and services
          include those who sign in with an account (such as Login.gov or ID.me)
          and those who don’t sign in. These groups include Veterans, VA
          patients, beneficiaries, Veteran advocates, caregivers, personal legal
          representatives, and the general public.
        </p>
        <p>
          These groups use a range of VA online services, including health
          tools, benefit applications, and information services.
        </p>
      </>
    ),
  },
  {
    header: `Right of access`,
    content: (
      <>
        <p>
          By accepting these terms, you give us permission to release{' '}
          <strong>to you</strong> all or a portion of your personal information
          that we maintain in a Privacy Act System of Records.
        </p>
        <p>
          In other words, you’re giving us permission to give you the personal
          information you request. We deliver your personal information to you
          through secure federal computer systems and networks. We may also
          partner with select external resources to provide additional
          information and services. When you select an external service or
          resource, we’ll tell you that we’re sending you to that partner’s
          secured environment.
        </p>
        <p>
          If you disagree with the content included in your VA records, or you
          suspect an error in your record, call our MyVA411 main information
          line at <va-telephone contact={CONTACTS.VA_411} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ).
        </p>
      </>
    ),
  },
  {
    header: `Privacy Act statement`,
    content: (
      <>
        <p>
          <a
            href="https://www.va.gov/privacy-policy/#on-this-page-76"
            rel="noopener noreferrer"
            target="_blank"
          >
            Read our VA.gov privacy policy
          </a>
          <br />
          <a
            href="https://www.oprm.va.gov/privacy/systems_of_records.aspx"
            rel="noopener noreferrer"
            target="_blank"
          >
            Read our VA systems of records notices
          </a>
        </p>
        <p>
          Federal law authorizes us to collect certain information (38 U.S.C.
          Section 501). The information may be subject to the Privacy Act of
          1974 (5 U.S.C. 552a). As such, VA employees may use it only in the
          performance of their duties. We can disclose the information outside
          of VA only with the proper authority (5 U.S.C. 552a(b)). This includes
          "routine use" disclosures in applicable Privacy Act Systems of
          Records.
        </p>
        <p>Examples of system of records notices includes these notices:</p>
        <ul>
          <li>"My HealtheVet Administrative System of Records" - 130VA10P2</li>
          <li>
            "VA Enterprise Cloud – Mobile Application Platform (VAEC-MAP)" - VA
            173VA005OP2
          </li>
          <li>
            “Compensation, Pension, Education, and Vocational Rehabilitation and
            Employment Records” - VA 58VA21/22/28
          </li>
        </ul>
      </>
    ),
  },
  {
    header: `Sharing of your information and data`,
    content: (
      <>
        <p>
          We may store personal and self-entered information and data that you
          choose to share with us. VA online services use encryption to securely
          store and transmit all data, including personal and self-entered
          information.
        </p>
        <p>
          Our use and release of your information, including your health
          information, must comply with federal laws and regulations. These are
          some ways we may use or share your information:
        </p>
        <ul>
          <li>
            We may do statistical analysis of characteristics of people who use
            our online services to assess areas of interest.
          </li>
          <li>
            We may use data for quality control, approved research, population
            health monitoring, or other VA program needs to improve the system.
          </li>
          <li>
            We may access, share, or use your information as permitted by the
            Principle-Based Ethics Framework for Access to and Use of Veteran
            Data.{' '}
            <a
              href="https://www.regulations.gov/document/VA-2022-OTHER-0017-0001"
              rel="noopener noreferrer"
              target="_blank"
            >
              Read the Veteran data access and use framework
            </a>
          </li>
          <li>
            We may give access to your health information only to an agency or
            an individual as permitted by law and as outlined in the Veterans
            Health Administration (VHA) notice of privacy practices.{' '}
            <a
              href="https://www.va.gov/files/2022-10/10-163p_(004)_-Notices_of_Privacy_Practices-_PRINT_ONLY.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              Read the VHA notice of privacy practices
            </a>
          </li>
        </ul>
        <p>We never share your information for marketing purposes.</p>
      </>
    ),
  },
  {
    header: `Text messaging and short message services (SMS)`,
    content: (
      <>
        <p>
          Some VA programs and services may provide text messaging or short
          message services (SMS). When you agree to get SMS texts from us, you
          confirm that you understand that SMS text messages sent to a mobile
          device are not encrypted.
        </p>
        <p>
          Anyone can read and forward unencrypted text messages. These messages
          remain unencrypted on telecommunication providers' servers and stay
          forever on senders' and receivers' devices. Senders can’t authenticate
          the recipient of text messages. So, the sender can’t be certain that
          the message has been sent to, received by, or opened by the right
          person.
        </p>
        <p>
          We automatically opt you in to some types of text message
          notifications. You can opt out of getting text messages at any time.
          <br />
          <a
            href="https://www.va.gov/resources/vetext-for-va-health-care-reminders-and-updates/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more about VEText for health care reminders and updates
          </a>
        </p>
      </>
    ),
  },
  {
    header: `Medical disclaimer`,
    content: (
      <>
        <p>
          Some VA online services offer interaction with other VA services and
          are intended as Veteran self-management tools. The purpose of these
          self-management tools is to provide individual Veterans with the
          ability to use data to manage their own care. These data include data
          that you enter into mobile health apps to create graphs, charts, and
          dashboards.
        </p>
        <p>
          Self-management tools are not intended to be and should not be used in
          any way as a substitute for professional medical advice or training.
          We can’t guarantee the accuracy of data that you enter yourself or
          that we collect through mobile health apps, wearable devices, or
          Bluetooth devices. When you access your health data, you acknowledge
          that the information is not necessarily meant to diagnose a health
          condition or to develop a health treatment plan.
        </p>
        <p>
          <strong>If you think your life or health is in danger,</strong> call
          the emergency number (911 in the U.S.) or go to the nearest emergency
          room.
        </p>
        <p>
          <strong>If you’re a Veteran in crisis or concerned about one,</strong>{' '}
          connect with our caring, qualified responders for confidential help.
          Call the Veterans Crisis Line at 988. Then select 1.
        </p>
      </>
    ),
  },
  {
    header: `Use of contact information`,
    content: (
      <>
        <p>
          We may contact you at the email address, phone numbers, or addresses
          you provide to us. We may contact you for official VA operations,
          including customer support, outreach, care, and eligibility.
        </p>
        <p>
          Some Internet Service Providers (ISPs) or third-party email providers
          may block email messages from sources that aren’t on their
          pre-approved list. This is a security measure to control spam and
          potentially malicious email. It’s your responsibility to make sure
          that VA.gov is on your ISP pre-approved list. We’re not responsible
          for any consequences resulting from our emails being blocked by your
          ISP. This includes junk mail folders, spam-blocking software, or other
          similar products.
        </p>
      </>
    ),
  },
  {
    header: `Feedback`,
    content: (
      <>
        <p>
          We encourage feedback from the people who use our online services. We
          may use a variety of tools to gather user feedback. We may use this
          information to measure performance, determine how people use our
          services and identify what they want from those services, improve
          designs, and for other authorized uses.
        </p>
        <p>
          We may also ask you to take part in field testing of new VA online
          services. Your participation in testing is voluntary. You don’t have
          to respond to these requests to continue using VA online services.
        </p>
      </>
    ),
  },
  {
    header: `Changes to these terms of use`,
    content: (
      <>
        <p>
          We may revise these terms of use at any time at our discretion. When
          we make a change that affects the collection and use of your personal
          information or when there is a change in law, we’ll provide a summary
          of the changes. We’ll also create a new version of these terms with
          the changes included.
        </p>
        <p>
          When you sign in, we’ll prompt you to read and accept the new terms.
          If you choose not to accept the new terms, you’ll no longer be able to
          sign in to VA.gov or other VA online services.
        </p>
      </>
    ),
  },
  {
    header: `Acceptance of terms`,
    content: (
      <p>
        When you accept these terms, you confirm that the personally
        identifiable information you provide to sign in to VA.gov or another VA
        online service is your information or the information of a person you
        legally represent or are legally authorized to act on behalf of.
      </p>
    ),
  },
];
