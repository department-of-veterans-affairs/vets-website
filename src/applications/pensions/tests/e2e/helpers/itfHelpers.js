import { add, formatISO } from 'date-fns';

export const mockItf = (
  offset = { days: 1 },
  status = 'active',
  type = 'pension',
) => ({
  data: {
    id: '',
    type: 'intent_to_file',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: formatISO(add(new Date(), offset)),
          participantId: 1,
          source: '',
          status,
          type,
        },
      ],
    },
  },
});

export const errorItf = () => ({
  errors: [
    {
      title: 'Bad Request',
      detail: 'Received a bad request response from the upstream server',
      code: '400',
      source: 'PensionCompensationForm::Service',
      status: '400',
      meta: {},
    },
  ],
});

export const postItf = () => ({
  data: {
    attributes: {
      intentToFile: {
        id: '1',
        creationDate: '2018-01-21T19:53:45.810+00:00',
        expirationDate: formatISO(add(new Date(), { years: 1 })),
        participantId: 1,
        source: '',
        status: 'active',
        type: 'intent_to_file',
      },
    },
    id: {},
    type: 'intent_to_files_responses',
  },
});
