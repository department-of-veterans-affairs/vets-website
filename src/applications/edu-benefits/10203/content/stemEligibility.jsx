import React from 'react';

export const eligiblePrograms = () => {
  return (
    <div>
      <a
        aria-label="See eligible degree programs, opening in new tab"
        href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        See eligible programs
      </a>{' '}
    </div>
  );
};

export const checkBenefit = () => {
  return (
    <div>
      <a
        aria-label="Check your remaining benefits, opening in new tab"
        href="https://www.va.gov/education/gi-bill/post-9-11/ch-33-benefit/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Check your remaining benefits
      </a>{' '}
    </div>
  );
};
