import React, { useLayoutEffect, useRef } from 'react';
import { format, isValid, parseISO } from 'date-fns';

export const isValidDate = dateString => {
  const parsedDate = parseISO(dateString);

  return isValid(parsedDate);
};

export const formatDate = dateString => {
  const formatString = 'MMMM d, yyyy';

  // We only care about the date portion of the string here.
  // Including the time portion can lead to off-by-one issues
  // depending on the users time zone
  const [datePart] = dateString.split('T');
  const parsedDate = parseISO(datePart);

  return isValid(parsedDate)
    ? format(parsedDate, formatString)
    : 'Invalid date';
};

export const paymentsReceivedFields = [
  {
    label: 'Date',
    value: 'payCheckDt',
  },
  {
    label: 'Amount',
    value: 'payCheckAmount',
    alignRight: true,
  },
  {
    label: 'Type',
    value: 'payCheckType',
  },
  {
    label: 'Method',
    value: 'paymentMethod',
  },
  {
    label: 'Bank',
    value: 'bankName',
  },
  {
    label: 'Account',
    value: 'accountNumber',
    alignRight: true,
  },
];

export const paymentsReturnedFields = [
  {
    label: 'Issue date',
    value: 'returnedCheckIssueDt',
  },
  {
    label: 'Cancel date',
    value: 'returnedCheckCancelDt',
  },
  {
    label: 'Amount',
    value: 'returnedCheckAmount',
    alignRight: true,
  },
  {
    label: 'Check #',
    value: 'returnedCheckNumber',
    alignRight: true,
  },
  {
    label: 'Type',
    value: 'returnedCheckType',
  },
  {
    label: 'Reason',
    value: 'returnReason',
  },
];

export const clientServerErrorContent = receivedOrReturned => (
  <>
    <h2 slot="headline" className="vads-u-font-size--h3">
      No {receivedOrReturned} payments
    </h2>
    <p className="vads-u-font-size--base">
      We were unable to get {receivedOrReturned} payments for your account.
    </p>
  </>
);

export const paymentsReceivedContent = (
  <>
    <h2 id="paymentsRecievedHeader">Payments you received</h2>
    <p id="paymentsRecievedContent">
      We pay benefits on the first day of the month for the previous month. If
      the first day of the month is a weekend or holiday, we pay benefits on the
      last business day before the first. For example, if May 1 is a Saturday,
      we’d pay benefits on Friday, April 30.
    </p>
  </>
);

export const paymentsReturnedContent = (
  <>
    <h2 id="paymentsReturnedHeader">Payments returned</h2>
    <p id="paymentsReturnedContent">
      Returned payment information is available for 6 years from the date we
      issued the payment.
    </p>
  </>
);

export const filterReturnPayments = payments => {
  return payments.filter(payment => {
    for (const [key] of Object.entries(payment)) {
      if (payment[key] !== null) {
        return true;
      }
    }
    return false;
  });
};

export const reformatReturnPaymentDates = payments => {
  return payments.map(payment => {
    return {
      ...payment,
      returnedCheckCancelDt: isValidDate(payment.returnedCheckCancelDt) ? (
        formatDate(payment.returnedCheckCancelDt)
      ) : (
        <span className="all-lower" aria-label="not available">
          n/a
        </span>
      ),
      returnedCheckIssueDt: isValidDate(payment.returnedCheckIssueDt) ? (
        formatDate(payment.returnedCheckIssueDt)
      ) : (
        <span className="all-lower" aria-label="not available">
          n/a
        </span>
      ),
    };
  });
};

export const reformatPaymentDates = payments => {
  return payments.map(payment => {
    return {
      ...payment,
      payCheckDt: isValidDate(payment.payCheckDt) ? (
        formatDate(payment.payCheckDt)
      ) : (
        <span className="all-lower" aria-label="Not available">
          n/a
        </span>
      ),
    };
  });
};

export const alertMessage = (
  <va-alert close-btn-aria-label="Close notification" status="warning" visible>
    <h3 slot="headline">We’re working to improve what we display here</h3>
    <p className="vads-u-margin-y--0">
      If you receive education benefits, we’ll be removing information about
      payments we send directly to your school. After making this update, your
      list of payments will only include payments sent to you.
    </p>
    <p className="vads-u-margin-y--1">
      Some education benefit payments may appear as "C&P Hardship" or something
      similar. We’re working to fix this.
    </p>
  </va-alert>
);

export const useResizeObserver = callbackFn => {
  const ref = useRef(null);

  useLayoutEffect(
    () => {
      const element = ref?.current;

      if (!window.ResizeObserver && element) return;

      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          callbackFn(element, entry);
        }
      });

      observer.observe(element);

      /* eslint-disable-next-line consistent-return */
      return () => {
        observer.disconnect();
      };
    },
    [callbackFn, ref],
  );

  return ref;
};
