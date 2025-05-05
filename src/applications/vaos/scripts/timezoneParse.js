/* eslint-disable no-console */
/*
 * How to run:
 *
 * 1. Download https://coderepo.mobilehealth.va.gov/projects/VDMS/repos/mobile-facility-service/browse/mobile-facility-service/src/main/resources/Sta6aid-TimezoneId.csv
 * 2. Run node timezoneParse.js <path to file>
 *
 * Output will be in timezone.json.
 */
const fs = require('fs');

const timezoneList = fs.readFileSync(process.argv[2], 'utf8').split('\n');
const timezoneMap = {
  '983': 'America/Denver',
  '984': 'America/New_York',
  '612': 'America/Los_Angeles',
};

for (const pair of timezoneList) {
  const [facility, zone] = pair.split(',', 2);

  if (facility.length === 3 || timezoneMap[facility.substr(0, 3)] !== zone) {
    timezoneMap[facility] = zone.trim();
  }
}

fs.writeFileSync('./timezones.json', JSON.stringify(timezoneMap, null, 2));
