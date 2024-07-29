import React from 'react';

const EmploymentIntro = () => (
  <>
    <p>
      Over the next few pages, we’ll ask you questions about your employers.
      <strong>
        {' '}
        Please add your employment information for the past ten years.{' '}
      </strong>
      You’ll have an opportunity to add more than one employer if necessary.
    </p>
    <p>
      In this context, employment encompasses all part-time and full-time
      employment, including self-employment, externships, internships (paid and
      unpaid), clerkships, military service, volunteer work, and temporary
      employment.
    </p>
    <p>For each employer, you’ll need to provide the following information:</p>
    <ul>
      <li>Name of employer</li>
      <li>Position title</li>
      <li>Supervisor name</li>
      <li>Employer address and phone number</li>
      <li>Employment start and end dates (month/year)</li>
    </ul>
  </>
);

export default EmploymentIntro;
