import { parsePhoneNumber } from './phoneNumbers';

function blobToBase64(_blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(_blob);
  });
}

export async function formatContactInfo(poaAttributes) {
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
  const vcfUrl = window?.Mocha
    ? await blobToBase64(blob)
    : URL.createObjectURL(blob);

  return { concatAddress, contact, extension, vcfUrl };
}
