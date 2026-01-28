import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import { daysFromToday } from '../utils/dates/formatting';

import formConfig from '../config/form';
import { CHAR_LIMITS } from '../constants';

import { transform } from '../submit-transformer';

import maximalData from './fixtures/data/maximal-test.json';

describe('transform', () => {
  beforeEach(() => {
    global.formData = {
      disabilityCompensationNewConditionsWorkflow: false,
    };
  });

  const servicePeriodsBDD = [
    {
      serviceBranch: 'Air Force Reserves',
      dateRange: {
        from: '2001-03-21',
        to: daysFromToday(90),
      },
    },
  ];

  // Read all the data files
  const dataDir = path.join(__dirname, './fixtures/data/');

  fs.readdirSync(dataDir)
    .filter(fileName => fileName.endsWith('.json'))
    .forEach(fileName => {
      // Loop through them
      it(`should transform ${fileName} correctly`, () => {
        const rawData = JSON.parse(
          fs.readFileSync(path.join(dataDir, fileName), 'utf8'),
        );

        // special logic for 2022 forms. this comes from prefill on the BE and is not something the user inputs
        if (fileName === 'maximal-toxic-exposure-test.json') {
          rawData.data.startedFormVersion = '2022';
        }

        // special logic for 0781 forms.
        if (fileName === 'maximal-modern-0781-test.json') {
          rawData.data.syncModern0781Flow = true;
        }

        let transformedData;
        try {
          transformedData = fs.readFileSync(
            path.join(dataDir, 'transformed-data', fileName),
            'utf8',
          );
        } catch (e) {
          // Show the contents of the transformed data so we can make a file for it
          // eslint-disable-next-line no-console
          console.log(
            `Transformed ${fileName}:`,
            transform(formConfig, rawData),
          );
          throw new Error(`Could not find transformed data for ${fileName}`);
        }
        transformedData = JSON.parse(transformedData);

        if (fileName.includes('bdd')) {
          rawData.data.serviceInformation.servicePeriods = servicePeriodsBDD;
          transformedData.form526.serviceInformation.servicePeriods = servicePeriodsBDD;
        }
        expect(JSON.parse(transform(formConfig, rawData))).to.deep.equal(
          transformedData,
        );
      });
    });
});

describe('Test internal transform functions', () => {
  it('will truncate long descriptions', () => {
    const getString = (key, diff = 0) =>
      new Array(42)
        .fill('1234567890')
        .join('')
        .substring(0, CHAR_LIMITS[key] + diff);
    const longString = getString('primaryDescription', 20);
    const phlebitisPrefix = 'Secondary to Diabetes Mellitus0\n';
    const form = {
      data: {
        ...maximalData.data,
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: longString,
            condition: 'asthma',
            'view:descriptionInfo': {},
          },
          {
            cause: 'SECONDARY',
            'view:secondaryFollowUp': {
              causedByDisability: 'Diabetes Mellitus0',
              causedByDisabilityDescription: longString,
            },
            condition:
              'Cranial nerve paralysis or cranial neuritis (inflammation of cranial nerves)',
            'view:descriptionInfo': {},
          },
          {
            cause: 'WORSENED',
            'view:worsenedFollowUp': {
              worsenedDescription: longString,
              worsenedEffects: longString,
            },
            condition: 'ankylosis in knee, bilateral',
            'view:descriptionInfo': {},
          },
          {
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentDescription: longString,
              vaMistreatmentLocation: longString,
              vaMistreatmentDate: longString,
            },
            condition: 'heart attack (myocardial infarction)',
            'view:descriptionInfo': {},
          },
        ],
      },
    };
    expect(
      JSON.parse(transform(formConfig, form)).form526.newPrimaryDisabilities,
    ).to.deep.equal([
      {
        cause: 'NEW',
        primaryDescription: getString('primaryDescription'),
        condition: 'asthma',
      },
      {
        cause: 'WORSENED',
        worsenedDescription: getString('worsenedDescription'),
        worsenedEffects: getString('worsenedEffects'),
        condition: 'ankylosis in knee, bilateral',
        specialIssues: ['POW'],
      },
      {
        cause: 'VA',
        vaMistreatmentDescription: getString('vaMistreatmentDescription'),
        vaMistreatmentLocation: getString('vaMistreatmentLocation'),
        vaMistreatmentDate: getString('vaMistreatmentDate'),
        condition: 'heart attack (myocardial infarction)',
        specialIssues: ['POW'],
      },
      {
        condition:
          'Cranial nerve paralysis or cranial neuritis (inflammation of cranial nerves)',
        cause: 'NEW',
        primaryDescription: `${phlebitisPrefix}${getString(
          'primaryDescription',
          -phlebitisPrefix.length,
        )}`,
      },
    ]);
  });
});

describe('Country code transformation in submit transformer', () => {
  it('should keep USA country code as-is (not convert to "United States")', () => {
    const form = {
      data: {
        ...maximalData.data,
        mailingAddress: {
          country: 'USA',
          addressLine1: '123 Any Street',
          city: 'Anyville',
          state: 'AK',
          zipCode: '12345',
        },
      },
    };

    const result = JSON.parse(transform(formConfig, form));
    expect(result.form526.mailingAddress.country).to.equal('USA');
  });

  it('should transform country code "CAN" to "Canada" for submission', () => {
    const form = {
      data: {
        ...maximalData.data,
        mailingAddress: {
          country: 'CAN',
          addressLine1: '123 Maple Street',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M1M 1M1',
        },
      },
    };

    const result = JSON.parse(transform(formConfig, form));
    expect(result.form526.mailingAddress.country).to.equal('Canada');
  });

  it('should transform country code "GBR" to "United Kingdom" for submission', () => {
    const form = {
      data: {
        ...maximalData.data,
        mailingAddress: {
          country: 'GBR',
          addressLine1: '123 High Street',
          city: 'London',
          state: 'England',
          zipCode: 'SW1A 1AA',
        },
      },
    };

    const result = JSON.parse(transform(formConfig, form));
    expect(result.form526.mailingAddress.country).to.equal('United Kingdom');
  });

  it('should leave full country name as-is when no code mapping exists', () => {
    const form = {
      data: {
        ...maximalData.data,
        mailingAddress: {
          country: 'Some Unknown Country',
          addressLine1: '123 Unknown Street',
          city: 'Unknown City',
          state: 'UK',
          zipCode: '00000',
        },
      },
    };

    const result = JSON.parse(transform(formConfig, form));
    expect(result.form526.mailingAddress.country).to.equal(
      'Some Unknown Country',
    );
  });
});
