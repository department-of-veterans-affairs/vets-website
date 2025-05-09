import { formatISO, add } from 'date-fns';

export const expirationDate = formatISO(add(new Date(), { years: 1 }));
export const activeItf = {
  id: '3',
  creationDate: formatISO(new Date()),
  expirationDate,
  participantId: 1,
  source: 'EBN',
  status: 'active',
  type: 'compensation',
};

export const nonActiveItf = {
  id: '2',
  creationDate: formatISO(new Date()),
  expirationDate,
  participantId: 1,
  source: 'EBN',
  status: 'duplicate', // non-active status
  type: 'compensation',
};

export const mockItfData = (item = {}) => ({
  data: {
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2018-01-21T19:53:45.810+00:00',
          expirationDate: '2018-02-21T19:53:45.810+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'expired',
          type: 'compensation',
        },
        nonActiveItf,
        item,
      ],
    },
  },
});
