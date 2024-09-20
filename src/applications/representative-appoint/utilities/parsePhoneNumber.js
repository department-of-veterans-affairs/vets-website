export default function parsePhoneNumber(phone) {
  if (!phone) {
    return { contact: null, extension: null };
  }
  let sanitizedNumber = phone
    .replace(/[()\s]/g, '') // remove parentheses
    .replace(/(?<=.)([+.*])/g, '-'); // replace .*+ symbols being used as dashes

  // return null for non-US country codes
  if (sanitizedNumber.match(/\+(\d+)[^\d1]/g)) {
    return { contact: null, extension: null };
  }

  // remove US country codes +1 or 1
  sanitizedNumber = sanitizedNumber.replace(/^(\+1|1)\s*/, '');

  // capture first 10 digits + ext if applicable
  const parserRegex = /^(\d{10})(\D*?(\d+))?/;
  const contact = sanitizedNumber.replace(/-/g, '').replace(parserRegex, '$1');
  const extension =
    sanitizedNumber
      .replace(/-/g, '')
      .replace(parserRegex, '$3')
      .replace(/\D/g, '') || null;

  const isValidContactNumberRegex = /^(?:[2-9]\d{2})[2-9]\d{2}\d{4}$/;

  if (isValidContactNumberRegex.test(contact)) {
    return { contact, extension };
  }

  return { contact: null, extension: null };
}
