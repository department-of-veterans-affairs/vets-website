import { seiVitalTypes } from '../../constants';

const vitalHeaders = {
  [seiVitalTypes.BLOOD_PRESSURE]: 'Blood Pressure',
  [seiVitalTypes.BLOOD_SUGAR]: 'Blood Sugar',
  [seiVitalTypes.BODY_TEMPERATURE]: 'Body Temperature',
  [seiVitalTypes.BODY_WEIGHT]: 'Body Weight',
  [seiVitalTypes.CHOLESTEROL]: 'Cholesterol',
  [seiVitalTypes.HEART_RATE]: 'Heart Rate',
  [seiVitalTypes.INR]: 'INR',
  [seiVitalTypes.PAIN]: 'Pain',
  [seiVitalTypes.PULSE_OXIMETRY]: 'Pulse Oximetry',
};

const mapRecordItems = (type, record) => {
  const commonItems = {
    [seiVitalTypes.BLOOD_PRESSURE]: [
      { title: 'Time', value: record.time, inline: true },
      { title: 'Systolic', value: record.systolic, inline: true },
      { title: 'Diastolic', value: record.diastolic, inline: true },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.BLOOD_SUGAR]: [
      { title: 'Time', value: record.time, inline: true },
      { title: 'Method', value: record.method, inline: true },
      {
        title: 'Blood Sugar Count',
        value: record.bloodSugarCount,
        inline: true,
      },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.BODY_TEMPERATURE]: [
      { title: 'Time', value: record.time, inline: true },
      {
        title: 'Temperature',
        value: `${record.bodyTemperature} ${record.measure}`,
        inline: true,
      },
      { title: 'Method', value: record.method, inline: true },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.BODY_WEIGHT]: [
      { title: 'Time', value: record.time, inline: true },
      {
        title: 'Weight',
        value: `${record.bodyWeight} ${record.measure}`,
        inline: true,
      },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.CHOLESTEROL]: [
      { title: 'Time', value: record.time, inline: true },
      {
        title: 'Total Cholesterol',
        value: record.totalCholesterol,
        inline: true,
      },
      { title: 'HDL', value: record.hdl, inline: true },
      { title: 'LDL', value: record.ldl, inline: true },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.HEART_RATE]: [
      { title: 'Time', value: record.time, inline: true },
      { title: 'Heart Rate', value: record.heartRate, inline: true },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.INR]: [
      { title: 'Time', value: record.time, inline: true },
      { title: 'INR Value', value: record.inrValue, inline: true },
      {
        title: 'Low Target Range',
        value: record.lowendTargetRange,
        inline: true,
      },
      {
        title: 'High Target Range',
        value: record.highendTargetRange,
        inline: true,
      },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.PAIN]: [
      { title: 'Time', value: record.time, inline: true },
      { title: 'Pain Level', value: record.painLevel, inline: true },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
    [seiVitalTypes.PULSE_OXIMETRY]: [
      { title: 'Time', value: record.time, inline: true },
      {
        title: 'Oximeter Reading',
        value: record.oximeterReading,
        inline: true,
      },
      {
        title: 'Respiratory Rate',
        value: record.respiratoryRate,
        inline: true,
      },
      {
        title: 'Oxygen Device',
        value: record.supplementalOxygenDevice,
        inline: true,
      },
      { title: 'Symptoms', value: record.symptoms, inline: true },
      {
        title: 'Other Symptoms',
        value: record.otherSymptoms || 'None entered',
        inline: true,
      },
      {
        title: 'Comments',
        value: record.comments || 'None entered',
        inline: true,
        lineGap: 16,
      },
    ],
  };

  return commonItems[type];
};

const convertVitalRecords = (type, records) => ({
  results: {
    header: vitalHeaders[type],
    headerType: 'H3',
    headerIndent: 30,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 30,
    sectionSeparators: false,
    items: records.map(record => ({
      header: record.date,
      headerIndent: 45,
      headerType: 'H4',
      items: mapRecordItems(type, record),
    })),
  },
});

const conversionFunctions = Object.fromEntries(
  Object.keys(vitalHeaders).map(type => [
    type,
    records => convertVitalRecords(type, records),
  ]),
);

export const generateVitalsContent = vitals => {
  const recordSets = [];

  Object.keys(vitals).forEach(type => {
    const recordsOfType = vitals[type];
    if (recordsOfType.length) {
      const convertFunction = conversionFunctions[type];
      if (convertFunction) {
        recordSets.push(convertFunction(recordsOfType));
      }
    }
  });

  return recordSets;
};
