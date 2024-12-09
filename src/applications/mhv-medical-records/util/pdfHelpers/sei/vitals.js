import { seiVitalTypes } from '../../constants';

const convertBloodPressureRecord = records => ({
  results: {
    header: 'Blood Pressure',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        { title: 'Systolic', value: item.systolic, inline: true },
        { title: 'Diastolic', value: item.diastolic, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertBloodSugarRecord = records => ({
  results: {
    header: 'Blood Sugar',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        { title: 'Method', value: item.method, inline: true },
        {
          title: 'Blood Sugar Count',
          value: item.bloodSugarCount,
          inline: true,
        },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertBodyTemperatureRecord = records => ({
  results: {
    header: 'Body Temperature',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        {
          title: 'Temperature',
          value: `${item.bodyTemperature} ${item.measure}`,
          inline: true,
        },
        { title: 'Method', value: item.method, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertBodyWeightRecord = records => ({
  results: {
    header: 'Body Weight',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        {
          title: 'Weight',
          value: `${item.bodyWeight} ${item.measure}`,
          inline: true,
        },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertCholesterolRecord = records => ({
  results: {
    header: 'Cholesterol',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        {
          title: 'Total Cholesterol',
          value: item.totalCholesterol,
          inline: true,
        },
        { title: 'HDL', value: item.hdl, inline: true },
        { title: 'LDL', value: item.ldl, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertHeartRateRecord = records => ({
  results: {
    header: 'Heart Rate',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        { title: 'Heart Rate', value: item.heartRate, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertInrRecord = records => ({
  results: {
    header: 'INR',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        { title: 'INR Value', value: item.inrValue, inline: true },
        {
          title: 'Low Target Range',
          value: item.lowendTargetRange,
          inline: true,
        },
        {
          title: 'High Target Range',
          value: item.highendTargetRange,
          inline: true,
        },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertPainRecord = records => ({
  results: {
    header: 'Pain',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        { title: 'Pain Level', value: item.painLevel, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

const convertPulseOximetryRecord = records => ({
  results: {
    header: 'Pulse Oximetry',
    headerType: 'H3',
    headerIndent: 20,
    preface: `Showing ${records.length} records, from newest to oldest`,
    prefaceIndent: 20,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerIndent: 20,
      headerType: 'H4',
      itemsIndent: 40,
      items: [
        { title: 'Time', value: item.time, inline: true },
        {
          title: 'Oximeter Reading',
          value: item.oximeterReading,
          inline: true,
        },
        {
          title: 'Respiratory Rate',
          value: item.respiratoryRate,
          inline: true,
        },
        {
          title: 'Oxygen Device',
          value: item.supplementalOxygenDevice,
          inline: true,
        },
        { title: 'Symptoms', value: item.symptoms, inline: true },
        { title: 'Other Symptoms', value: item.otherSymptoms, inline: true },
        { title: 'Comments', value: item.comments, inline: true, lineGap: 16 },
      ],
    })),
  },
});

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
        recordSets.push(convertFunction(recordsOfType));
      }
    }
  });

  return recordSets;
};
