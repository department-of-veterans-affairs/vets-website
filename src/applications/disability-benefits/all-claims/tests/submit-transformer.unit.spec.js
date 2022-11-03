import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { expect } from 'chai';

import formConfig from '../config/form';
import { CHAR_LIMITS } from '../constants';

import { transform } from '../submit-transformer';

import maximalData from './fixtures/data/maximal-test.json';

describe('transform', () => {
  const servicePeriodsBDD = [
    {
      serviceBranch: 'Air Force Reserves',
      dateRange: {
        from: '2001-03-21',
        to: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD'),
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
        let transformedData;
        try {
          transformedData = fs.readFileSync(
            path.join(dataDir, 'transformed-data', fileName),
            'utf8',
          );
        } catch (e) {
          // Show the contents of the transformed data so we can make a file for it
          // eslint-disable-next-line no-console
          console.error(
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
            condition: 'phlebitis',
            'view:descriptionInfo': {},
          },
          {
            cause: 'WORSENED',
            'view:worsenedFollowUp': {
              worsenedDescription: longString,
              worsenedEffects: longString,
            },
            condition: 'knee replacement',
            'view:descriptionInfo': {},
          },
          {
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentDescription: longString,
              vaMistreatmentLocation: longString,
              vaMistreatmentDate: longString,
            },
            condition: 'myocardial infarction (MI)',
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
        classificationCode: '540',
      },
      {
        cause: 'WORSENED',
        worsenedDescription: getString('worsenedDescription'),
        worsenedEffects: getString('worsenedEffects'),
        condition: 'knee replacement',
        specialIssues: ['POW'],
        classificationCode: '8919',
      },
      {
        cause: 'VA',
        vaMistreatmentDescription: getString('vaMistreatmentDescription'),
        vaMistreatmentLocation: getString('vaMistreatmentLocation'),
        vaMistreatmentDate: getString('vaMistreatmentDate'),
        condition: 'myocardial infarction (MI)',
        specialIssues: ['POW'],
        classificationCode: '4440',
      },
      {
        condition: 'phlebitis',
        cause: 'NEW',
        classificationCode: '5300',
        primaryDescription: `${phlebitisPrefix}${getString(
          'primaryDescription',
          -phlebitisPrefix.length,
        )}`,
      },
    ]);
  });
});
