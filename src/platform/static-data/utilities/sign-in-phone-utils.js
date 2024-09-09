// Used for src/platform/static-data/SubmitSignInForm.jsx
// Utilities taken (and shortened) from https://github.com/department-of-veterans-affairs/component-library/blob/1b83decc698f91f2c4d0ce10a1f91a3225ea22f7/packages/web-components/src/components/va-telephone/va-telephone.tsx#L134
const cleanContact = contact => {
  return (contact || '').replace(/[^\d]/g, '');
};

const splitContact = contact => {
  const cleanedContact = cleanContact(contact);

  if (cleanedContact.length === 10) {
    const regex = /^(\d{3})(\d{3})(\d{4})$/g;
    const result = [...regex.exec(cleanedContact)];

    return result.length === 4 ? result.slice(-3) : [cleanedContact];
  }

  return [cleanedContact];
};

export const formatPhoneNumber = (num, tty = false) => {
  const splitNumber = splitContact(num);
  let formattedNum = splitNumber.join('');

  if (formattedNum.length === 10) {
    const [area, local, last4] = splitNumber;

    formattedNum = `${area}-${local}-${last4}`;
  }

  if (tty) {
    formattedNum = `TTY: ${formattedNum}`;
  }

  return formattedNum;
};

export const createHref = contact => {
  const cleanedContact = cleanContact(contact);
  const isN11 = cleanedContact.length === 3;

  if (isN11) {
    return `tel:${cleanedContact}`;
  }
  return `tel:+1${cleanedContact}`;
};

export const formatAriaLabel = (contact, tty = false) => {
  const spaceCharsOut = chars => chars.split('').join(' ');
  const labelPieces = splitContact(contact).map(spaceCharsOut);

  if (tty) {
    labelPieces.unshift('TTY');
  }

  return labelPieces.join('. ');
};
