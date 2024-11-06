import { expect } from 'chai';
import { preProcessHealthServicesData } from '../connect/preProcess';

describe('preprocess', () => {
  const data = [
    [
      'Returning service member care',
      'Post-9/11 Veterans (OEF, OIF, OND) transition and care management services',
      null,
      'transitionCounseling',
      'Social programs and services',
      true,
      false,
      true,
      false,
      451,
    ],
    [
      'Mental health care',
      'Behavioral health',
      'addiction, depression, anxiety, trauma, PTSD, bipolar disorder, schizophrenia, OCD ',
      'mentalHealth',
      'Mental health care',
      true,
      false,
      false,
      false,
      441,
    ],
    [
      'Suicide prevention',
      'Veterans Crisis Line',
      null,
      'suicidePrevention',
      'Mental health care',
      false,
      false,
      true,
      false,
      440,
    ],
    [
      'Register for care',
      null,
      null,
      'registerForCare',
      'Non-clinical services',
      null,
      null,
      true,
      null,
      402,
    ],
    [
      'xyz',
      null,
      null,
      'registerForCare',
      'Non-clinical services',
      false,
      null,
      false,
      true,
      402,
    ],
  ];
  it('returns data', () => {
    const processed = preProcessHealthServicesData(data);

    expect(processed).to.be.an('array');
    expect(data).to.deep.equal(data);
  });
});
