function splitOffLastNCharacters(string, n) {
  const lastChunk = string.substr(-n);
  const unchunkedPart = string.substr(0, string.length - n);

  return [unchunkedPart, lastChunk];
}

function chunksOf3(string) {
  if (string.length <= 0) {
    return [];
  }

  const [unchunkedPart, lastChunk] = splitOffLastNCharacters(string, 3);

  return chunksOf3(unchunkedPart).concat(lastChunk);
}

function sanitizePhoneNumber(unsanitizedPhoneNumber) {
  return unsanitizedPhoneNumber.replace(/[^\d]/g, '');
}

function breakIntoChunks(unsanitizedPhoneNumber) {
  const phoneNumber = sanitizePhoneNumber(unsanitizedPhoneNumber);
  const [unchunkedPart, lastChunk] = splitOffLastNCharacters(phoneNumber, 4);

  const firstChunks = chunksOf3(unchunkedPart);

  return firstChunks.concat(lastChunk);
}

export default function makePhoneNumberAriaLabel(phoneNumber) {
  const chunks = breakIntoChunks(phoneNumber);

  const renderChunk = chunk => `${chunk.split('').join(' ')}.`;

  return chunks.map(renderChunk).join(' ');
}
