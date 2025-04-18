import React from 'react';

export const refillProcessStepGuide = {
  title: 'How the refill process works on VA.gov',
  processSteps: [
    {
      header: 'You request a refill',
      content: (
        <>
          <p>
            After you request a refill, the prescription status will change to{' '}
            <strong>Active: Submitted.</strong>
          </p>
          <p>
            It may take our pharmacy up to <strong>7 days</strong> to start
            processing your request.
          </p>
        </>
      ),
    },
    {
      header: 'We process your refill request',
      content: (
        <p>
          When our pharmacy starts processing your request, the status will
          change to <strong>Active: Refill in Process.</strong> We’ll also tell
          you the date when we expect to fill it.
        </p>
      ),
    },
    {
      header: 'We ship your refill to you',
      content: (
        <>
          <p>
            Prescriptions usually arrive within 3 to 5 days after shipping. You
            can find tracking information in your prescription details.
          </p>
          <p>
            <strong>Note:</strong> Remember to request your next refill at least{' '}
            <strong>15 days</strong> before you need more medication.
          </p>
        </>
      ),
    },
  ],
};
