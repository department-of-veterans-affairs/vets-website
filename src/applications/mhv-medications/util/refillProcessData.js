import React from 'react';

export const refillProcessStepGuide = {
  title: 'How the refill process works on VA.gov',
  processSteps: [
    {
      header: 'You request a refill',
      content: (
        <p>
          After you request a refill, the prescription status will change to{' '}
          <strong>In progress</strong>. It may take up to 7 days to start
          processing your request.
        </p>
      ),
    },
    {
      header: 'We process your refill request',
      content: (
        <p>
          Once our pharmacy starts processing your request, it may take up to 7
          days to fill and ship your prescription.
        </p>
      ),
    },
    {
      header: 'We ship your refill to you',
      content: (
        <p>
          Once we ship the prescription to you, the status will change to{' '}
          <strong>Shipped</strong>. Prescriptions usually arrive within 3 to 5
          days after shipping. You can find tracking information in your
          medication details page.
        </p>
      ),
    },
  ],
};
