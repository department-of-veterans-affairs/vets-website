import { seiVitalTypes } from '../../constants';

const convertBloodPressureRecord = records => ({
  header: 'Blood pressure',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'Time',
            value: item.time,
            inline: true,
          },
          {
            title: 'Systolic',
            value: item.systolic,
            inline: true,
          },
          {
            title: 'Diastolic',
            value: item.diastolic,
            inline: true,
          },
          {
            title: 'Comments',
            value: item.comments,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertBloodSugarRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertBodyTemperatureRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertBodyWeightRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertCholesterolRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertHeartRateRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertInrRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertPainRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

const convertPulseOximetryRecord = records => ({
  header: 'asdf',
  headerType: 'H3',
  headerIndent: 20,
  results: {
    preface: `Showing ${records.length} records, from newest to oldest`,
    items: records.map(item => [
      {
        header: item.date,
        headerIndent: 20,
        headerType: 'H4',
        itemsIndent: 40,
        items: [
          {
            title: 'asdf',
            value: item.asdf,
            inline: true,
          },
        ],
      },
    ]),
  },
});

// Mapping object to reduce redundancy
const conversionFunctions = {
  [seiVitalTypes.BLOOD_PRESSURE]: convertBloodPressureRecord,
  [seiVitalTypes.BLOOD_SUGAR]: convertBloodSugarRecord,
  [seiVitalTypes.BODY_TEMPERATURE]: convertBodyTemperatureRecord,
  [seiVitalTypes.BODY_WEIGHT]: convertBodyWeightRecord,
  [seiVitalTypes.CHOLESTEROL]: convertCholesterolRecord,
  [seiVitalTypes.HEART_RATE]: convertHeartRateRecord,
  [seiVitalTypes.INR]: convertInrRecord,
  [seiVitalTypes.PAIN]: convertPainRecord,
  [seiVitalTypes.PULSE_OXIMETRY]: convertPulseOximetryRecord,
};

export const generateVitalsContent = vitals => {
  const recordSets = [];

  Object.keys(vitals).forEach(type => {
    const recordsOfType = vitals[type];
    if (recordsOfType.length) {
      const convertFunction = conversionFunctions[type];
      if (convertFunction) {
        recordSets.push(recordsOfType.map(record => convertFunction(record)));
      }
    }
  });

  return recordSets;
};
