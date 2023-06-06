import { daysAgo } from '../helpers';

const appealsSuccess = (updatedDaysAgo = 10, active = true) => {
  return {
    data: [
      {
        id: '2765759',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['2765759'],
          updated: '2021-03-04T19:55:21-05:00',
          incompleteHistory: false,
          type: 'original',
          // this determines if the appeal is open or closed
          active,
          description: 'Benefits as a result of VA error (Section 1151)',
          aod: false,
          location: 'bva',
          aoj: 'vba',
          programArea: 'compensation',
          status: { type: 'on_docket', details: {} },
          alerts: [],
          docket: {
            front: false,
            total: 140135,
            ahead: 101381,
            ready: 16432,
            month: '2012-04-01',
            docketMonth: '2011-01-01',
            eta: null,
          },
          issues: [
            {
              description: 'Benefits as a result of VA error (Section 1151)',
              diagnosticCode: null,
              active: true,
              lastAction: null,
              date: null,
            },
          ],
          events: [
            { type: 'nod', date: '2012-02-02' },
            { type: 'soc', date: '2012-03-03' },
            { type: 'form9', date: '2012-04-04' },
            { type: 'hearing_held', date: daysAgo(updatedDaysAgo) },
          ],
          evidence: [],
        },
      },
    ],
  };
};

export default appealsSuccess;
