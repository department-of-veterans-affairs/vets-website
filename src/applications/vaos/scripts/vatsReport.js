/* eslint-disable no-console */
/*
 * How to run:
 *
 * 1. Download https://veteran.apps.va.gov/facilities/v1/request-eligibility-criteria
 * 2. Run node vatsReport.js <path to request criteria json>
 *
 * Output will be in vats.csv
 */
const fs = require('fs');

const vatsSettings = fs.readFileSync(process.argv[2], 'utf8');
const data = JSON.parse(vatsSettings);

function typeSort(a, b) {
  if (a.typeOfCare < b.typeOfCare) {
    return -1;
  }
  if (a.typeOfCare > b.typeOfCare) {
    return 1;
  }

  return 0;
}

function isTurnedOn(setting) {
  return !!setting.patientHistoryRequired;
}

const typesList = data[0].requestSettings.sort(typeSort).map(f => f.typeOfCare);
const header = ['Facility'].concat(typesList);

const output = data
  .map(facility => {
    const row = [facility.id];

    // verify that the type of care settings list matches our header
    if (
      facility.requestSettings
        .sort(typeSort)
        .map(f => f.typeOfCare)
        .join(',') !== typesList.join(',')
    ) {
      throw new Error(`Bad data in ${facility.id}`);
    }

    return row.concat(facility.requestSettings.sort(typeSort).map(isTurnedOn));
  })
  .sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }

    return 0;
  });

function printTypeOfCareStats(label, rows, index) {
  const typeOfCareOn = rows.filter(row => row[index]).length;
  console.log(
    `${label} requests allowed: ${typeOfCareOn} out of ${rows.length} (${(
      (typeOfCareOn / rows.length) *
      100
    ).toFixed(1)}%)`,
  );
}

function printShutoffSites(label, rows, index) {
  const siteMap = new Map();

  rows.forEach(row => {
    const site = row[0].substring(0, 3);
    if (!siteMap.has(site)) {
      siteMap.set(site, row[index]);
    } else {
      siteMap.set(site, row[index] || siteMap.get(site));
    }
  });

  console.log(`Sites without any facilities allowing ${label} requests:`);
  console.log(
    Array.from(siteMap)
      .filter(site => !site[1])
      .map(site => site[0])
      .join('\n'),
  );
  console.log('');
}

printTypeOfCareStats('Primary care', output, 10);
printTypeOfCareStats('Mental health', output, 9);
console.log('');
console.log('---');
console.log('');
printShutoffSites('primary care', output, 10);
printShutoffSites('mental health', output, 9);

fs.writeFileSync(
  './vats.csv',
  [header.join(',')]
    .concat(
      output.map(row => {
        return row.join(',');
      }),
    )
    .join('\n'),
);
