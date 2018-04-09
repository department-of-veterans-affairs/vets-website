import Raven from 'raven-js';

const diagnosticCodeMap = {
  '123': 'PTSD', // eslint-disable-line
  '1234': 'Some Disability' // eslint-disable-line
};

export function getDiagnosticCodeName(code) {
  const text = diagnosticCodeMap[code];

  if (!text) {
    Raven.captureMessage(`Unknown diagnostic code: ${code}`);
  }

  return text || 'Unknown Condition';
}


// TODO: This should return the text from a list, but that list is...nowhere to be found right now
export function getDiagnosticText(text) {
  return text;
}

