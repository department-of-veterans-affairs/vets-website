import React from 'react';

export default function CalcBeneficiaryLocationQuestionModalContent() {
  return (
    <div>
      <p>
        VA pays monthly housing allowance (MHA) based on the campus location
        where you physically attend the majority of your classes.
      </p>

      <p>
        <strong>A campus could include:</strong>
      </p>
      <ul>
        <li>
          A main campus: the location where the primary teaching facilities of
          an educational institution are located
        </li>
        <li>
          A branch campus: the location of an educational institution that is
          geographically apart from and operationally independent of the main
          campus of the educational institution
        </li>
        <li>
          An extension campus: the location that is geographically apart from
          the main or branch campus but is operationally dependent on that
          campus for the performance of administrative tasks
        </li>
      </ul>
      <p>
        Learn more about the{' '}
        <a
          href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11/#what-is-the-location-based-hou"
          target="_blank"
          rel="noopener noreferrer"
        >
          Location-Based Housing Allowance.
        </a>
      </p>
    </div>
  );
}
