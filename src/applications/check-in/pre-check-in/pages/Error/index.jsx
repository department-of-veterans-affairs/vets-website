import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import format from 'date-fns/format';
import sub from 'date-fns/sub';

import ErrorMessage from '../../../components/ErrorMessage';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';

import { makeSelectVeteranData } from '../../../selectors';

const Error = () => {
  // try get date of appointment
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  // if date exists, then show date
  const messages = [
    {
      text: 'We’re sorry. Something went wrong on our end. Please try again.',
    },
  ];
  if (appointments && appointments.length > 0 && appointments[0].startTime) {
    const preCheckIn = sub(new Date(appointments[0].startTime), { days: 1 });
    const date = format(new Date(preCheckIn), 'MM/dd/yy');
    messages.push({
      text: `You can pre-check in online until ${date}.`,
      testId: 'date-message',
    });
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5 ">
      <ErrorMessage
        header="We couldn't complete pre-check-in"
        message={
          <>
            {messages.map((message, index) => {
              return (
                <p key={index} data-testid={message.testId}>
                  {message.text}
                </p>
              );
            })}
          </>
        }
      />
      <Footer />
      <BackToHome />
    </div>
  );
};

export default Error;
