/* eslint-disable no-console */
/*
 * How to run:
 * 
 * 1. Download https://coderepo.mobilehealth.va.gov/projects/VDMS/repos/mobile-facility-service/browse/mobile-facility-service/src/main/resources/Sta6aid-TimezoneId.csv
 * 2. Run node timezoneParse.js <path to file>
 * 
 * Output will be in timezone.json. You can replace the utils/timezones.json file with the output, but
 * you'll need to preserve the last three entries for 983, 984, and 612
 */
const fs = require('fs');

const timezoneList = fs.readFileSync(process.argv[2], 'utf8').split('\n');
const timezoneMap = {};

for (const pair of timezoneList) {
  const [facility, zone] = pair.split(',', 2);

  if (facility.length === 3 || timezoneMap[facility.substr(0, 3)] !== zone) {
    timezoneMap[facility] = zone.trim();
  }
}

fs.writeFileSync('./timezones.json', JSON.stringify(timezoneMap, null, 2));
