import { addSeconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { expect } from 'chai';
import { generateTimestampForFilename } from '../../util/helpers';
import { DATETIME_FORMATS } from '../../util/constants';

describe('generateTimestampForFilename function', () => {
  it('should return a correctly formatted timestamp in eastern time', () => {
    const now = Date.now();
    const oneSecond = addSeconds(now, 1);
    const timeZone = 'America/New_York';

    const formattedNow = formatInTimeZone(
      now,
      timeZone,
      DATETIME_FORMATS.filename,
    );
    const formattedOneSecond = formatInTimeZone(
      oneSecond,
      timeZone,
      DATETIME_FORMATS.filename,
    );

    const formattedTimestamp = generateTimestampForFilename();
    expect(formattedTimestamp).to.be.oneOf([formattedNow, formattedOneSecond]);
  });
});
