import React from 'react';

const HealthEnrollmentDescription = () => (
  <va-additional-info
    trigger="What to know about enrollment in the full medical benefits package"
    class="vads-u-margin-top--3"
  >
    <p>
      Each Veteran’s medical benefits package is unique and includes these
      services and care to help:
    </p>
    <ul>
      <li>Treat illnesses and injuries</li>
      <li>Prevent future health problems</li>
      <li>Improve your ability to function</li>
      <li>Enhance your quality of life</li>
    </ul>
    <p>
      <va-link
        href="/health-care/about-va-health-benefits/"
        text="Learn more about VA health benefits"
      />
    </p>
    <p>
      After we’ve processed your application and you’re enrolled in VA health
      care, we’ll assign you to a priority group.
    </p>
    <p>
      Your priority group may affect how much (if anything) you’ll have to pay
      toward the cost of your care.
    </p>
    <p>We may assign you to one of these priority groups:</p>
    <ul>
      <li>
        <strong>Priority group 2.</strong> We may assign you to priority group 2
        if you have a service-connected disability that we’ve rated as 30% or
        40% disabling.
      </li>
      <li>
        <strong>Priority group 3.</strong> We may assign you to priority group 3
        if you have a service-connected disability that we’ve rated as 10% or
        20% disabling. Or we may assign you to this priority group based on
        other factors (like details about your military service history).
      </li>
    </ul>
    <p>
      <va-link
        href="/health-care/eligibility/priority-groups/"
        text="Learn more about VA priority groups"
      />
    </p>
  </va-additional-info>
);

export default HealthEnrollmentDescription;
