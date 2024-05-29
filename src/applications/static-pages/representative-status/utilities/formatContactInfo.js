import { parsePhoneNumber } from './phoneNumbers';

export function formatContactInfo(poaAttributes) {
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    stateCode,
    zipCode,
    name,
    email,
    phone,
  } = poaAttributes;

  const { contact, extension } = parsePhoneNumber(phone);

  // address as displayed on contact card + google maps link
  const concatAddress =
    [
      addressLine1,
      addressLine2,
      addressLine3,
      city ? `${city},` : null,
      stateCode,
      zipCode,
    ]
      .filter(Boolean)
      .join(' ') || null;

  // rep contact card
  const vcfData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TEL:${contact}`,
    `EMAIL:${email}`,
    `ADR:;;${concatAddress}`,
    'END:VCARD',
  ].join('\n');

  const blob = new Blob([vcfData], { type: 'text/vcard' });
  const vcfUrl = URL.createObjectURL(blob);

  return {
    concatAddress,
    contact,
    extension,
    vcfUrl,
  };
}
