/* eslint-disable camelcase */
const { expect } = require('chai');
const sinon = require('sinon');

const main = require('../main');
const GitHubClient = require('../github-client');
const octokitResponses = require('./mocks/octokit-responses');

describe.skip('daily-product-scan', () => {
  context('success, changes ARE detected', () => {
    let status;
    let message;
    let data;

    beforeEach(async () => {
      const octokit = sinon.createStubInstance(GitHubClient);
      octokit.getProductJson.returns(octokitResponses.outdatedProductDirectory);
      octokit.createPull.returns(octokitResponses.createPull);
      ({ status, message, data } = await main({ octokit }));
    });

    it('sets the status return prop to the correct value', () => {
      expect(status).to.equal('Success');
    });

    it('sets the message return prop to the correct value', () => {
      expect(message).to.equal(
        'Changes were detected. The data prop includes the updated CSV.',
      );
    });

    context('field updates', () => {
      let originalJsonDirectoryByProductId;
      let updatedJsonDirectoryByProductId;

      before(() => {
        const originalJsonDirectory = JSON.parse(
          octokitResponses.outdatedProductDirectory.data,
        );
        const updatedJsonDirectory = JSON.parse(data);

        originalJsonDirectoryByProductId = {};
        originalJsonDirectory.forEach(product => {
          originalJsonDirectoryByProductId[product.product_id] = product;
        });

        updatedJsonDirectoryByProductId = {};
        updatedJsonDirectory.forEach(product => {
          updatedJsonDirectoryByProductId[product.product_id] = product;
        });
      });

      it('successfully compares package_dependencies values when they are not equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].package_dependencies,
          ).not.to.equal(
            updatedJsonDirectoryByProductId[product_id].package_dependencies,
          );
        });
      });

      it('successfully compares cross_product_dependencies values when they are not equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id]
              .cross_product_dependencies,
          ).not.to.equal(
            updatedJsonDirectoryByProductId[product_id]
              .cross_product_dependencies,
          );
        });
      });

      it('successfully compares path_to_code values when they are not equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].path_to_code,
          ).not.to.equal(
            updatedJsonDirectoryByProductId[product_id].path_to_code,
          );
        });
      });

      it('successfully compares has_unit_tests values when they are not equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].has_unit_tests,
          ).not.to.equal(
            updatedJsonDirectoryByProductId[product_id].has_unit_tests,
          );
        });
      });

      it('successfully compares has_e2e_tests values when they are not equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].has_e2e_tests,
          ).not.to.equal(
            updatedJsonDirectoryByProductId[product_id].has_e2e_tests,
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
      octokit.getProductJson.returns(octokitResponses.productDirectory);
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
      let originalJsonDirectoryByProductId;
      let updatedJsonDirectoryByProductId;

      before(() => {
        const originalJsonDirectory = JSON.parse(
          octokitResponses.productDirectory.data,
        );
        const updatedJsonDirectory = JSON.parse(data);

        originalJsonDirectoryByProductId = {};
        originalJsonDirectory.forEach(product => {
          originalJsonDirectoryByProductId[product.product_id] = product;
        });

        updatedJsonDirectoryByProductId = {};
        updatedJsonDirectory.forEach(product => {
          updatedJsonDirectoryByProductId[product.product_id] = product;
        });
      });

      it('successfully compares package_dependencies values when they are equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].package_dependencies,
          ).to.equal(
            updatedJsonDirectoryByProductId[product_id].package_dependencies,
          );
        });
      });

      it('successfully compares cross_product_dependencies values when they are equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id]
              .cross_product_dependencies,
          ).to.equal(
            updatedJsonDirectoryByProductId[product_id]
              .cross_product_dependencies,
          );
        });
      });

      it('successfully compares path_to_code values when they are equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].path_to_code,
          ).to.equal(updatedJsonDirectoryByProductId[product_id].path_to_code);
        });
      });

      it('successfully compares has_unit_tests values when they are equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].has_unit_tests,
          ).to.equal(
            updatedJsonDirectoryByProductId[product_id].has_unit_tests,
          );
        });
      });

      it('successfully compares has_e2e_tests values when they are equal', () => {
        Object.keys(originalJsonDirectoryByProductId).forEach(product_id => {
          expect(
            originalJsonDirectoryByProductId[product_id].has_e2e_tests,
          ).to.equal(updatedJsonDirectoryByProductId[product_id].has_e2e_tests);
        });
      });
    });
  });
});
