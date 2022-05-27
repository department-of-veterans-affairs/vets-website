/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const sinon = require('sinon');

const main = require('../main');
const GitHubClient = require('../github-client');
const Csv = require('../csv');
const Headings = require('../csv/headings');
const Rows = require('../csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('../csv/helpers');
const octokitResponses = require('./mocks/octokit-responses');

describe('daily-product-scan', () => {
  context('success, changes ARE detected', () => {
    let status;
    let message;
    let data;

    beforeEach(async () => {
      const octokit = sinon.createStubInstance(GitHubClient);
      octokit.getProductCsv.returns(octokitResponses.outdatedProductDirectory);
      octokit.createPull.returns(octokitResponses.createPull);
      ({ status, message, data } = await main({ octokit }));
    });

    it('sets the status return prop to the correct value', () => {
      expect(status).to.equal('Suss');
    });

    it('sets the message return prop to the correct value', () => {
      expect(message).to.equal(
        'Changes were detected. The data prop includes the updated CSV.',
      );
    });

    context('field updates', () => {
      let originalProductDirectory;
      let updatedProductDirectory;
      let originalProductDirectoryByProductId;
      let updatedProductDirectoryByProductId;

      before(() => {
        const originalCsvLines = removeCarriageReturn(
          transformCsvToScsv(
            octokitResponses.outdatedProductDirectory.data,
          ).split('\n'),
        );

        const updatedCsvLines = removeCarriageReturn(
          transformCsvToScsv(data).split('\n'),
        );

        originalProductDirectory = new Csv({
          headings: new Headings({ csvLine: originalCsvLines.slice(0, 1)[0] }),
          rows: new Rows({ csvLines: originalCsvLines.slice(1) }),
        });

        updatedProductDirectory = new Csv({
          headings: new Headings({ csvLine: updatedCsvLines.slice(0, 1)[0] }),
          rows: new Rows({ csvLines: updatedCsvLines.slice(1) }),
        });

        originalProductDirectoryByProductId = {};
        originalProductDirectory.rows.all.forEach(row => {
          const fields = row.split(';');
          originalProductDirectoryByProductId[fields[0]] = fields;
        });

        updatedProductDirectoryByProductId = {};
        updatedProductDirectory.rows.all.forEach(row => {
          const fields = row.split(';');
          updatedProductDirectoryByProductId[fields[0]] = fields;
        });
      });

      it('successfully compares package_dependencies values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.packageDependenciesIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.packageDependenciesIndex
            ],
          );
        });
      });

      it('successfully compares cross_product_dependencies values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.crossProductDependenciesIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.crossProductDependenciesIndex
            ],
          );
        });
      });

      it('successfully compares path_to_code values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.pathToCodeIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.pathToCodeIndex
            ],
          );
        });
      });

      it('successfully compares has_unit_tests values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasUnitTestsIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasUnitTestsIndex
            ],
          );
        });
      });

      it('successfully compares has_e2e_tests values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasE2eTestsIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasE2eTestsIndex
            ],
          );
        });
      });

      it('successfully compares has_contract_tests values when they are not equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasContractTestsIndex
            ],
          ).not.to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasContractTestsIndex
            ],
          );
        });
      });
    });
  });

  context('success, but changes ARE NOT detected', () => {
    let status;
    let message;
    let data;

    beforeEach(async () => {
      const octokit = sinon.createStubInstance(GitHubClient);
      octokit.getProductCsv.returns(octokitResponses.productDirectory);
      octokit.createPull.returns(octokitResponses.createPull);
      ({ status, message, data } = await main({ octokit }));
    });

    it('sets the status return prop to the correct value', () => {
      expect(status).to.equal('Success');
    });

    it('sets the message return prop to the correct value', () => {
      expect(message).to.equal(
        'No changes were detected. The data prop includes the unchanged CSV.',
      );
    });

    context('field updates', () => {
      let originalProductDirectory;
      let updatedProductDirectory;
      let originalProductDirectoryByProductId;
      let updatedProductDirectoryByProductId;

      before(() => {
        const originalCsvLines = removeCarriageReturn(
          transformCsvToScsv(octokitResponses.productDirectory.data).split(
            '\n',
          ),
        );

        const updatedCsvLines = removeCarriageReturn(
          transformCsvToScsv(data).split('\n'),
        );

        originalProductDirectory = new Csv({
          headings: new Headings({ csvLine: originalCsvLines.slice(0, 1)[0] }),
          rows: new Rows({ csvLines: originalCsvLines.slice(1) }),
        });

        updatedProductDirectory = new Csv({
          headings: new Headings({ csvLine: updatedCsvLines.slice(0, 1)[0] }),
          rows: new Rows({ csvLines: updatedCsvLines.slice(1) }),
        });

        originalProductDirectoryByProductId = {};
        originalProductDirectory.rows.all.forEach(row => {
          const fields = row.split(';');
          originalProductDirectoryByProductId[fields[0]] = fields;
        });

        updatedProductDirectoryByProductId = {};
        updatedProductDirectory.rows.all.forEach(row => {
          const fields = row.split(';');
          updatedProductDirectoryByProductId[fields[0]] = fields;
        });
      });

      it('successfully compares package_dependencies values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.packageDependenciesIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.packageDependenciesIndex
            ],
          );
        });
      });

      it('successfully compares cross_product_dependencies values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.crossProductDependenciesIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.crossProductDependenciesIndex
            ],
          );
        });
      });

      it('successfully compares path_to_code values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.pathToCodeIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.pathToCodeIndex
            ],
          );
        });
      });

      it('successfully compares has_unit_tests values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasUnitTestsIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasUnitTestsIndex
            ],
          );
        });
      });

      it('successfully compares has_e2e_tests values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasE2eTestsIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasE2eTestsIndex
            ],
          );
        });
      });

      it('successfully compares has_contract_tests values when they are equal', () => {
        Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
          expect(
            originalProductDirectoryByProductId[uuid][
              originalProductDirectory.headings.hasContractTestsIndex
            ],
          ).to.equal(
            updatedProductDirectoryByProductId[uuid][
              updatedProductDirectory.headings.hasContractTestsIndex
            ],
          );
        });
      });
    });
  });

  context(
    'failure, received a 403 when requesting the Product Directory from GitHub',
    () => {
      let status;
      let message;
      let data;

      beforeEach(async () => {
        const octokit = sinon.createStubInstance(GitHubClient);
        octokit.getProductCsv.returns(
          octokitResponses.productDirectoryForbidden,
        );
        octokit.createPull.returns(octokitResponses.createPull);
        ({ status, message, data } = await main({ octokit }));
      });

      it('sets the status return prop to the correct value', () => {
        expect(status).to.equal('Failure');
      });

      it('sets the message return prop to the correct value', () => {
        expect(message).to.equal('There was an error with GitHub.');
      });

      it('returns a response with status code 403', () => {
        const responseObject = JSON.parse(data);
        expect(responseObject.status).to.equal(403);
      });
    },
  );

  context(
    'failure, received a 404 when requesting the Product Directory from GitHub',
    () => {
      let status;
      let message;
      let data;

      beforeEach(async () => {
        const octokit = sinon.createStubInstance(GitHubClient);
        octokit.getProductCsv.returns(
          octokitResponses.productDirectoryResourceNotFound,
        );
        octokit.createPull.returns(octokitResponses.createPull);
        ({ status, message, data } = await main({ octokit }));
      });

      it('sets the status return prop to the correct value', () => {
        expect(status).to.equal('Failure');
      });

      it('sets the message return prop to the correct value', () => {
        expect(message).to.equal('There was an error with GitHub.');
      });

      it('returns a response with status code 404', () => {
        const responseObject = JSON.parse(data);
        expect(responseObject.status).to.equal(404);
      });
    },
  );
});
