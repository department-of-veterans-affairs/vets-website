import React from 'react';

export function ConsentLabel() {
  return 'I understand the above information and agree to join.';
}
export function ConsentError() {
  return <span>You must accept the consent policy before continuing</span>;
}

export function ConsentNotice() {
  return (
    <span>
      <strong>What is this research about?</strong>
      <p>
        You are invited to participate in a research volunteer list study that
        will be used to help determine your eligibility with COVID-19 related
        research studies. Your safety and privacy are our biggest priorities. We
        want to make sure you understand important information about joining
        this list. Please read below and then check the box to confirm you
        understand and agree to join.
      </p>
      <strong>What is expected of me? (Procedures)</strong>
      <p>
        If you chose to participate in the VA COVID-19 Research Volunteer List,
        answering questions related to your health history, COVID-19 diagnosis
        and symptoms, COVID-19 vaccine status, and other demographic
        information, will help determine your eligibility for COVID-19 related
        research. There are no other procedures as part of joining the COVID-19
        Volunteer List. If we believe you qualify for a COVID-19 related study,
        the study team will contact you to describe the study and what would be
        needed from you.
      </p>
      <strong>What are the possible risks or discomforts?</strong>
      <p>
        There is a slight risk that someone who shouldn’t have your information
        could get access to it, however, all measures are being taken to secure
        the data. We will keep the information you provide indefinitely, or
        until a decision is made to not use this list anymore.
      </p>
      <strong>Will I benefit from the study? </strong>
      <p>
        There are no direct benefits to you for participating in the COVID-19
        Volunteer List.
      </p>
      <strong>What are my alternatives to being in this study?</strong>
      <p>
        There are no alternatives to this study, and you may choose to not
        participate.
      </p>
      <strong>Will I get paid? </strong>
      <p>You will not be paid to participate in this Volunteer List </p>
      <strong>Will I have to pay anything?</strong>
      <p>You will not have to pay anything to be in this study. </p>
      <strong>Do I have to be in this study?</strong>
      <p>
        It’s always your choice to answer any questions we may ask or not
        indicate consent by exiting this page. You do not have to participate in
        this study.{' '}
      </p>
      <strong>Can I change my mind later and stop being in this study? </strong>
      <p>
        You can withdraw your name from this list at any time by emailing
        research@va.gov. Your decision to join or not join this list won’t
        affect your VA health care or any of your VA benefits or services in any
        way. If you submit your responses, we will keep your information as part
        of the Volunteer List indefinitely, or until the project ends or you
        request to be withdrawn.
      </p>
      <strong>Will my information be protected from the public? </strong>
      <p>
        We’ll include your information in our secure electronic database and
        will keep your name and all the information you tell us in this study as
        confidential as possible. We’ll only give database access to people with
        permission. Your information will be made available to researchers who
        need your information for VA COVID-19 studies. We will always check with
        you before sharing your information with researchers looking for
        volunteers.
      </p>
      <p>
        Also, other federal agencies as required, such as the VA Office of
        Research Oversight and the VA Office of the Inspector General may have
        access to your information.{' '}
      </p>
      <strong>
        Who can I talk to if I have questions about the research, problems
        related to the study or if I think I’ve been hurt by being a part of the
        study?
      </strong>
      <p>
        If you have any questions, concerns or complaints about this research
        study, its procedures, risks and benefits, or alternative courses of
        treatment, you can contact the Volunteer List at research@va.gov. You
        should also contact the Volunteer List at any time if you feel you have
        been hurt by being a part of this study.
      </p>
      <p>
        If you are not satisfied with how this study is being conducted, or if
        you have any concerns, complaints, or general questions about the
        research or your rights as a participant, and would like to speak
        someone independent of the research team please contact the Stanford
        Institutional Review Board (IRB) at{' '}
        <va-telephone contact="6507235244" /> or toll free at{' '}
        <va-telephone international contact="8666802906" />. You can also write
        to the Stanford IRB, Stanford University, 1705 El Camino Real, Palo
        Alto, CA 94306.
      </p>
    </span>
  );
}
