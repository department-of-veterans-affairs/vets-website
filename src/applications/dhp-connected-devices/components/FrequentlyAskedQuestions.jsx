import React from 'react';
import {
  FirstFAQSection,
  SecondFAQSection,
  ThirdFAQSection,
  FourthFAQSection,
} from './FAQSections';

export const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="schemaform-title">
        <h2>Frequently Asked Questions</h2>
      </div>
      <FirstFAQSection />
      <SecondFAQSection />
      <ThirdFAQSection />
      <FourthFAQSection />
    </>
  );
};
