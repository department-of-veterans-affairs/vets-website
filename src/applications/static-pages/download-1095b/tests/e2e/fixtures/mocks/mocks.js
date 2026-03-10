const form = {
  availableForms: [
    {
      year: 2021,
      lastUpdated: '2022-08-03T20:38:29.382Z',
    },
  ],
};

const formUnavailable = {
  availableForms: [],
};

const multiYearForms = {
  availableForms: [
    {
      year: 2022,
      lastUpdated: '2023-08-03T20:38:29.382Z',
    },
    {
      year: 2025,
      lastUpdated: '2026-08-03T20:38:29.382Z',
    },
    {
      year: 2024,
      lastUpdated: '2025-08-03T20:38:29.382Z',
    },
    {
      year: 2023,
      lastUpdated: '2024-08-03T20:38:29.382Z',
    },
  ],
};

module.exports = {
  form,
  formUnavailable,
  multiYearForms,
};
