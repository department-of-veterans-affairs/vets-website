import { expect } from 'chai';
import sinon from 'sinon';

const main = require('..');
const GitHub = require('../github');
const octokitResponses = require('./mocks/octokit-responses');

const Csv = require('../csv');
const Headings = require('../csv/headings');
const Rows = require('../csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('../csv/helpers');

describe('daily-product-dependency-scan', () => {
  context('success, dependency changes detected', () => {
    let status;
    let message;
    let data;

    before(async () => {
      const octokit = sinon.createStubInstance(GitHub);
      octokit.getProductDirectory.returns(
        octokitResponses.outdatedProductDirectory,
      );
      octokit.createPull.returns(octokitResponses.createPull);
      ({ status, message, data } = await main({ octokit }));
    });

    it('sets the status return prop to the correct value', () => {
      expect(status).to.equal('Success');
    });

    it('sets the message return prop to the correct value', () => {
      expect(message).to.equal(
        'Dependency changes were detected. Data includes the updated CSV.',
      );
    });

    it('', () => {
      const originalCsvLines = removeCarriageReturn(
        transformCsvToScsv(
          octokitResponses.outdatedProductDirectory.data,
        ).split('\n'),
      );

      const originalProductDirectory = new Csv({
        headings: new Headings({ csvLine: originalCsvLines.slice(0, 1)[0] }),
        rows: new Rows({ csvLines: originalCsvLines.slice(1) }),
      });

      const updatedCsvLines = removeCarriageReturn(
        transformCsvToScsv(data).split('\n'),
      );

      const updatedProductDirectory = new Csv({
        headings: new Headings({ csvLine: updatedCsvLines.slice(0, 1)[0] }),
        rows: new Rows({ csvLines: updatedCsvLines.slice(1) }),
      });

      const originalProductDirectoryByProductId = {};
      originalProductDirectory.rows.all.forEach(row => {
        const fields = row.split(';');
        originalProductDirectoryByProductId[fields[0]] = fields;
      });

      const updatedProductDirectoryByProductId = {};
      updatedProductDirectory.rows.all.forEach(row => {
        const fields = row.split(';');
        updatedProductDirectoryByProductId[fields[0]] = fields;
      });

      Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
        // compare package dependencies
        expect(
          originalProductDirectoryByProductId[uuid][
            originalProductDirectory.headings.packageDependencyIndex
          ],
        ).not.to.equal(
          updatedProductDirectoryByProductId[uuid][
            updatedProductDirectory.headings.packageDependencyIndex
          ],
        );

        // compare cross product dependencies
        expect(
          originalProductDirectoryByProductId[uuid][
            originalProductDirectory.headings.crossProductDependencyIndex
          ],
        ).not.to.equal(
          updatedProductDirectoryByProductId[uuid][
            updatedProductDirectory.headings.crossProductDependencyIndex
          ],
        );

        // TODO: delete the following
        // console.log(
        //   'originalProductDirectoryByProductId[uuid][originalProductDirectory.headings.packageDependencyIndex]',
        //   originalProductDirectoryByProductId[uuid][
        //     originalProductDirectory.headings.packageDependencyIndex
        //   ],
        // );

        // console.log(
        //   'updatedProductDirectoryByProductId[uuid][updatedProductDirectory.headings.packageDependencyIndex]',
        //   updatedProductDirectoryByProductId[uuid][
        //     updatedProductDirectory.headings.packageDependencyIndex
        //   ],
        // );

        // console.log('');
      });
    });
  });

  context('success, dependency changes not detected', () => {});
});
