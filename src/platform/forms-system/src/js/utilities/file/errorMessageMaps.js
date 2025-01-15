const errormessageMaps = {
  'exceeds the page size limit':
    'Your file can’t have a width and height larger than 78 inches by 101 inches. Follow the instructions for your device on how to resize the file and try again.',
};

export default function reMapErrorMessage(error) {
  const result = Object.keys(errormessageMaps).find(mapKey =>
    error.includes(mapKey),
  );
  return errormessageMaps?.[result] ?? error;
}
