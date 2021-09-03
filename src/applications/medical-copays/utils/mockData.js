// Mock data used until API data is available

export const mockCopayBalanceData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c973f66afa6',
    amount: 300,
    facility: 'James A. Haley Veterans’ Hospital',
    city: 'Tampa',
    dueDate: 'July 9, 2021',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
    amount: 230,
    facility: 'San Diego VA Medical Center',
    city: 'San Diego',
    dueDate: 'July 2, 2021',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66acw3',
    amount: 0,
    facility: 'Philadelphia VA Medical Center',
    city: 'Philadelphia',
    dueDate: null,
  },
];

export const mockTableData = [
  {
    date: `June 3, 2021`,
    desc: `Prescription copay (service connected)`,
    amount: 10,
  },
  {
    date: `June 3, 2021`,
    desc: `Inpatient Community Care Network copay`,
    amount: 290,
  },
  {
    date: `May 3, 2021`,
    desc: `Payments made from April 3, 2021 to May 3, 2021`,
    amount: -102,
  },
  {
    date: `April 3, 2021`,
    desc: `Inpatient Community Care Network copay`,
    amount: 60,
  },
  {
    date: `April 3, 2021`,
    desc: `Inpatient Community Care Network per diem`,
    amount: 40,
  },
  {
    date: `April 3, 2021`,
    desc: `Late fee`,
    amount: 2,
  },
  {
    date: `June 3, 2021`,
    desc: `Inpatient Community Care Network copay for May 5, 2021`,
    amount: 290,
  },
  {
    date: `May 3, 2021`,
    desc: `Payments made from April 3, 2021 to May 3, 2021`,
    amount: 102,
  },
  {
    date: `June 3, 2021`,
    desc: `Prescription copay (service connected)`,
    amount: 10,
  },
  {
    date: `April 3, 2021`,
    desc: `Inpatient Community Care Network per diem for May 3, 2021 to May 5, 2021`,
    amount: 40,
  },
  {
    date: `April 3, 2021`,
    desc: `Inpatient Community Care Network copay for May 3, 2021 to May 5, 2021`,
    amount: 60,
  },
  {
    date: `April 3, 2021`,
    desc: `Late fee`,
    amount: 2,
  },
];
