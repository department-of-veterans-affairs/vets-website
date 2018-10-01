import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const introductionText = (
  <div>
    <p>
      We‘ll now ask you questions about the stressful event or events related to your PTSD. We understand that some of the questions maybe difficult to answer. The information you provide here will help us understand your situation and research your claim.
    </p>
    <p>
      As you go through these questions, your responses will be saved. So, if you need to take a break and come back to your application, your information will be here for you.
    </p>
    <p>
      Keep in mind, if you are in crisis, we can support you. Our Veterans Crisis Line is confidential (private), free, and available 24/7. To connect with a Veterans Crisis Line responder any time day or night:
    </p>
    <ul>
      <li>
        Call the Veterans Crisis Line at <a href="tel:1-800-273-8255">1-800-273-8255</a> and press 1, <strong>**or**</strong>
      </li>
      <li>
        Visit the <a href="https://www.veteranscrisisline.net/ChatTermsOfService.aspx?account=Veterans%20Chat/">Veterans
        Crisis Line</a> to start a confidential chat online, <strong>**or**</strong>
      </li>
      <li>
        Send a text message to <a href="sms:838255">838255</a>
        .
      </li>
    </ul>
    <p>
      Support for the deaf and hearing-impaired is also available.
    </p>
  </div>
);

export const ptsdTypeDescription = () => {
  return (
    <div>
      <p>
        First we‘re going to ask you about the type of event or events that
        contributed to your PTSD.
      </p>
      <p>
        What type of event contributed to your PTSD? (Choose all that apply.)
      </p>
    </div>
  );
};

export const ptsdTypeHelp = () => {
  return (
    <AdditionalInfo triggerText="Which should I choose?">
      <h4>Types of Stressful incidents</h4>
      <h5>Combat</h5>
      <p>
        This means you participated in a fight or encounter with a military enemy
        or hostile unit or weapon. It also includes if you were present during these
        events either as a combatant or a Servicemember supporting combatants such
        as providing medical care to the wounded.
      </p>
      <h5>Military Sexual Trauma</h5>
      <p>
        This includes sexual harassment, sexual assault, or rape that happens in
        a military setting.
      </p>
      <h5>Personal Assault</h5>
      <p>
        This means a person, who isn‘t part of an enemy force, committed harm.
        Examples of personal assault include: assault, battery, robbery, mugging,
        stalking, or harassment.
      </p>
      <h5>Non-Combat other than Military Sexual Trama or Personal Assault</h5>
      <p>
        This means you experienced an event such as a car accident, hurricane, or
        plane crash, or witnessing the death, injury, or threat to another person
        or to yourself, caused by something other than a hostile military or
        terrorist activity.
      </p>
    </AdditionalInfo>
  );
};

export const ptsdNameTitle = () => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">PTSD</legend>
  );
};

export const documentDescription = () => {
  return (
    <div>
      <p>
        You can upload your document in a pdf, .jpeg, or .png file format.
        You’ll first need to scan a copy of your document onto your computer or
        mobile phone. You can then upload the document from there. Please note
        that large files can take longer to upload with a slow Internet
        connection. Guidelines for uploading a file:
      </p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p>
        <em>
          Large files can be more difficult to upload with a slow Internet
          connection
        </em>
      </p>
    </div>
  );
};

export const stressfullIncidentDescriptionTitle = () => {
  return (
    <div>
      <h5>Event description</h5>
    </div>
  );
};
