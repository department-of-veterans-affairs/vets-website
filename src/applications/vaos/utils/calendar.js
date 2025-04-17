import moment from 'moment';
import guid from 'simple-guid';

/*
 * ICS files have a 75 character line limit. Longer fields need to be broken
 * into 75 character chunks with a CRLF in between. They also apparenly need to have a tab
 * character at the start of each new line, which is why I set the limit to 74
 *
 * Additionally, any actual line breaks in the text need to be escaped
 */
export const ICS_LINE_LIMIT = 74;

/**
 * @summary Function that returns a collection of ICS key/value pairs.
 * @description Only a subset of the ICS object specification is used.
 * The following properties/keys are allowed:
 *
 * <ul>
 * <li>BEGIN</li>
 * <li>VERSION</li>
 * <li>PRODID</li>
 * <li>BEGIN</li>
 * <li>UID</li>
 * <li>SUMMARY</li>
 * <li>DESCRIPTION</li>
 * <li>LOCATION</li>
 * <li>DTSTAMP</li>
 * <li>DTSTART</li>
 * <li>DTEND</li>
 * <li>END</li>
 * <li>END</li>
 * </ul>
 *
 * Values are retreived from the returned collection using the defined keys. Values returned from
 * the collection can be of type string or array for keys with multiply values. The following keys have
 * multiple values:
 *
 * <ul>
 * <li>BEGIN</li>
 * <li>END</li>
 * </ul>
 *
 * The following key:
 * <ul>
 * <li>FORMATTED_TEXT</li>
 * </ul>
 *
 * is a special key used to access the formatted description text.
 *
 * @export
 * @param {string} buffer - ICS calendar string
 * @returns Returns a collection of ICS key/value pairs.
 */
export function getICSTokens(buffer) {
  const map = new Map();
  let tokens = buffer.split('\r\n');

  // Split tokens into key/value pairs using lookbehind since it is possible
  // for other text to contain the split character. The regex looks for a ':'
  // preceeded by on the keywords.
  //
  // NOTE: Look behind is not support by Safari browser. Uncomment if the feature
  // is supported in the future.
  //
  // tokens = tokens.map(t =>
  //   t.split(
  //     /(?<=BEGIN):|(?<=VERSION):|(?<=PRODID):|(?<=UID):|(?<=SUMMARY):|(?<=DESCRIPTION):|(?<=LOCATION):|(?<=DTSTAMP):|(?<=DTSTART):|(?<=DTEND):|(?<=END):/g,
  //   ),
  // );
  tokens = tokens.reduce((acc, token) => {
    const results = [
      'BEGIN',
      'VERSION',
      'PRODID',
      'UID',
      'SUMMARY',
      'DESCRIPTION',
      'LOCATION',
      'DTSTAMP',
      'DTSTART',
      'DTEND',
      'END',
      '\t',
    ]
      .map(key => {
        if (key === '\t') {
          const match = token.match(new RegExp(`(^\t)(.*)$`));
          return match ? [match[0], match[0]] : null;
        }
        const match = token.match(new RegExp(`(^${key}:)(.*)$`));
        return match ? [key, match[2]] : null;
      })
      .filter(Boolean);
    return acc.concat(results);
  }, []);

  tokens.forEach(token => {
    // Store duplicate keys values in an array...
    if (map.has(token[0])) {
      const value = map.get(token[0]);
      if (Array.isArray(value)) {
        value.push(token[1]);
      } else {
        map.set(token[0], [value, token[1]]);
      }
    } else if (token[0].startsWith('\t')) {
      if (map.has('DESCRIPTION')) {
        // Prepend to exisiting text
        map.set('DESCRIPTION', `${map.get('DESCRIPTION')}${token[0]}`);
      } else {
        map.set('DESCRIPTION', token[0]);
      }
    } else {
      map.set(token[0], token[1]);
    }
  });
  return map;
}

export function formatDescription(description, location = '') {
  if (!description || !description.text) {
    return 'DESCRIPTION:';
  }

  const chunked = [];
  if (typeof description === 'object') {
    let text = `DESCRIPTION:${description.text}`;
    text = text.replace(/\r/g, '').replace(/\n/g, '\\n');

    while (text.length > ICS_LINE_LIMIT) {
      chunked.push(`${text}\\n`.substring(0, ICS_LINE_LIMIT));
      text = text.substring(ICS_LINE_LIMIT);
    }

    // Add last line of description text
    if (text) {
      chunked.push(text);
    }

    if (description.providerName) {
      chunked.push(`\\n\\n${description.providerName}`);
    }

    if (location) {
      const loc = description.providerName
        ? `\\n${location}`
        : `\\n\\n${location}`;
      const index = loc.indexOf(',');

      if (index !== -1) {
        chunked.push(`${loc.substring(0, index)}\\n`);
        chunked.push(`${loc.substring(index + 1).trimStart()}\\n`);
      } else {
        chunked.push(`${loc}\\n`);
      }
    }

    const phone = description.phone?.replace(/\r/g, '').replace(/\n/g, '\\n');
    if (phone && phone !== 'undefined') {
      chunked.push(`${phone}\\n`);
    }

    if (description.additionalText) {
      description.additionalText.forEach(val => {
        let line = `\\n${val}`;
        while (line.length > ICS_LINE_LIMIT) {
          chunked.push(`${line}\\n`.substring(0, ICS_LINE_LIMIT));
          line = line.substring(ICS_LINE_LIMIT);
        }
        chunked.push(`${line}\\n`);
      });
    }
  }

  return chunked.join('\r\n\t').replace(/,/g, '\\,');
}

export function generateICS(
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
) {
  const startDate = moment(startDateTime)
    .utc()
    .format('YYYYMMDDTHHmmss[Z]');
  const endDate = moment(endDateTime)
    .utc()
    .format('YYYYMMDDTHHmmss[Z]');

  let loc = '';
  if (location) {
    loc = location.replace(/,/g, '\\,');
  }
  return [
    `BEGIN:VCALENDAR`,
    `VERSION:2.0`,
    `PRODID:VA`,
    `BEGIN:VEVENT`,
    `UID:${guid()}`,
    `SUMMARY:${summary}`,
    `${formatDescription(description, location)}`,
    `LOCATION:${summary.startsWith('Phone') ? 'Phone call' : loc}`,
    `DTSTAMP:${startDate}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `END:VEVENT`,
    `END:VCALENDAR`,
  ].join('\r\n');
}
