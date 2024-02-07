import React from 'react';

export default function SizeOfInstitutionsModalContent() {
  return (
    <>
      <p>
        The size of institutions is based on calculation of full-time equivalent
        students (FTEs) which considers both full-time and part-time students.
        Two-year colleges are classified using a different scale than four-year
        and higher institutions.
      </p>
      <p>
        Two-year college sizes
        <ul>
          <li>Very small -- fewer than 500 FTEs attend this institution</li>
          <li>Small -- at least 500 but fewer than 2,000 FTEs attend</li>
          <li>Medium -- at least 2000 but fewer than 5,000 FTEs</li>
          <li>Large -- at least 5,000 but fewer than 10,000 FTEs attend</li>
          <li>Very large -- 10,000 or more FTEs attend</li>
        </ul>
      </p>
      <p>
        Four-year college sizes
        <ul>
          <li>
            Very small -- fewer than 1,000 FTEs attend this four-year
            institution
          </li>
          <li>Small -- at least 1,000 but fewer than 3,000 FTEs attend</li>
          <li>Medium -- at least 3,000 but fewer than 10,000 FTEs attend</li>
          <li>Large -- more than 10,000 FTEs attend</li>
        </ul>
      </p>
    </>
  );
}
