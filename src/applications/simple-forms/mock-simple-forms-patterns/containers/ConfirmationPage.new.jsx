import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView.v2';

const content = {
  headlineText: 'Your form has been submitted and is pending processing',
  nextStepsText: (
    <p>
      Right now your form is pending processing. We’ll review your submission
      and contact you if we have any questions.
    </p>
  ),
};

const ConfirmationPage = () => {
  const form = {
    data: {
      statementType: 'not-listed',
      fullName: {
        first: 'John',
        last: 'Veteran',
      },
      dateOfBirth: '1980-01-01',
      idNumber: {
        ssn: '321540987',
      },
      mailingAddress: {
        country: 'USA',
        street: '123 Any St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
      },
      phone: '1234567890',
      statement:
        'John stood at the towering gates of bureaucracy, a maze of forms and lines that seemed endless. Clutched in his hand was the VA Form 21-4138, a cryptic relic said to grant access to essential benefits. As he stepped forward, he encountered gatekeepers—the clerks—each with riddles to solve and documents to verify. Armed with a pen and a folder filled with proof, he navigated the maze, dodging a storm of paper, crossing the chasm of deadlines, and fighting the dragon of waiting times. In the end, he emerged triumphant, his form stamped with approval, the quest for benefits achieved. The adventure, though arduous, had its reward.',
    },
    submission: {
      timestamp: 1721999975,
      response: { confirmationNumber: '2106a7e8-27dd-46b4-886a-29b780723f4c' },
    },
  };

  // const form = {
  //   data: { veteran: { fullName: { first: 'John', last: 'Veteran' } } },
  //   submission: {
  //     timestamp: 1721999975,
  //     response: { confirmationNumber: '2106a7e8-27dd-46b4-886a-29b780723f4c' },
  //   },
  // };
  const { timestamp, response = {} } = form.submission;
  const submitterFullName = form.data?.veteran?.fullName;

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={submitterFullName}
      submitDate={timestamp}
      confirmationNumber={response.confirmationNumber}
      content={content}
      childContent={<></>}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteran: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
        }).isRequired,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
  }),
};

export default ConfirmationPage;
