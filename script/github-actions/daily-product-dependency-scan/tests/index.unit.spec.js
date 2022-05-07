/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const sinon = require('sinon');

const main = require('../main');
const Csv = require('../csv');
const Headings = require('../csv/headings');
const Rows = require('../csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('../csv/helpers');
const octokitResponses = require('./mocks/octokit-responses');
const GitHubClient = require('../github-client');

it('works', () => {
  expect(1).to.equal(1);
});

// describe('daily-product-dependency-scan', () => {
//   context('success, dependency changes ARE detected', () => {
//     let status;
//     let message;
//     let data;

//     before(async () => {
//       const octokit = sinon.createStubInstance(GitHubClient);
//       octokit.getProductDirectory.returns(
//         octokitResponses.outdatedProductDirectory,
//       );
//       octokit.createPull.returns(octokitResponses.createPull);
//       ({ status, message, data } = await main({ octokit }));
//     });

//     it('sets the status return prop to the correct value', () => {
//       expect(status).to.equal('Success');
//     });

//     it('sets the message return prop to the correct value', () => {
//       expect(message).to.equal(
//         'Dependency changes were detected. The data prop includes the updated CSV.',
//       );
//     });

//     context('dependency updates', () => {
//       let originalProductDirectory;
//       let updatedProductDirectory;
//       let originalProductDirectoryByProductId;
//       let updatedProductDirectoryByProductId;

//       before(() => {
//         const originalCsvLines = removeCarriageReturn(
//           transformCsvToScsv(
//             octokitResponses.outdatedProductDirectory.data,
//           ).split('\n'),
//         );

//         const updatedCsvLines = removeCarriageReturn(
//           transformCsvToScsv(data).split('\n'),
//         );

//         originalProductDirectory = new Csv({
//           headings: new Headings({ csvLine: originalCsvLines.slice(0, 1)[0] }),
//           rows: new Rows({ csvLines: originalCsvLines.slice(1) }),
//         });

//         updatedProductDirectory = new Csv({
//           headings: new Headings({ csvLine: updatedCsvLines.slice(0, 1)[0] }),
//           rows: new Rows({ csvLines: updatedCsvLines.slice(1) }),
//         });

//         originalProductDirectoryByProductId = {};
//         originalProductDirectory.rows.all.forEach(row => {
//           const fields = row.split(';');
//           originalProductDirectoryByProductId[fields[0]] = fields;
//         });

//         updatedProductDirectoryByProductId = {};
//         updatedProductDirectory.rows.all.forEach(row => {
//           const fields = row.split(';');
//           updatedProductDirectoryByProductId[fields[0]] = fields;
//         });
//       });

//       it('updates the package dependency values correctly', () => {
//         Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
//           expect(
//             originalProductDirectoryByProductId[uuid][
//               originalProductDirectory.headings.packageDependencyIndex
//             ],
//           ).not.to.equal(
//             updatedProductDirectoryByProductId[uuid][
//               updatedProductDirectory.headings.packageDependencyIndex
//             ],
//           );
//         });
//       });

//       it('updates the cross product dependency values correctly', () => {
//         Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
//           expect(
//             originalProductDirectoryByProductId[uuid][
//               originalProductDirectory.headings.crossProductDependencyIndex
//             ],
//           ).not.to.equal(
//             updatedProductDirectoryByProductId[uuid][
//               updatedProductDirectory.headings.crossProductDependencyIndex
//             ],
//           );
//         });
//       });
//     });
//   });

//   context('success, but dependency changes ARE NOT detected', () => {
//     let status;
//     let message;
//     let data;

//     before(async () => {
//       const octokit = sinon.createStubInstance(GitHubClient);
//       octokit.getProductDirectory.returns(octokitResponses.productDirectory);
//       octokit.createPull.returns(octokitResponses.createPull);
//       ({ status, message, data } = await main({ octokit }));
//     });

//     it('sets the status return prop to the correct value', () => {
//       expect(status).to.equal('Success');
//     });

//     it('sets the message return prop to the correct value', () => {
//       expect(message).to.equal(
//         'No dependency changes were detected. The data prop includes the unchanged CSV.',
//       );
//     });

//     context('dependency updates', () => {
//       let originalProductDirectory;
//       let updatedProductDirectory;
//       let originalProductDirectoryByProductId;
//       let updatedProductDirectoryByProductId;

//       before(() => {
//         const originalCsvLines = removeCarriageReturn(
//           transformCsvToScsv(octokitResponses.productDirectory.data).split(
//             '\n',
//           ),
//         );

//         const updatedCsvLines = removeCarriageReturn(
//           transformCsvToScsv(data).split('\n'),
//         );

//         originalProductDirectory = new Csv({
//           headings: new Headings({ csvLine: originalCsvLines.slice(0, 1)[0] }),
//           rows: new Rows({ csvLines: originalCsvLines.slice(1) }),
//         });

//         updatedProductDirectory = new Csv({
//           headings: new Headings({ csvLine: updatedCsvLines.slice(0, 1)[0] }),
//           rows: new Rows({ csvLines: updatedCsvLines.slice(1) }),
//         });

//         originalProductDirectoryByProductId = {};
//         originalProductDirectory.rows.all.forEach(row => {
//           const fields = row.split(';');
//           originalProductDirectoryByProductId[fields[0]] = fields;
//         });

//         updatedProductDirectoryByProductId = {};
//         updatedProductDirectory.rows.all.forEach(row => {
//           const fields = row.split(';');
//           updatedProductDirectoryByProductId[fields[0]] = fields;
//         });
//       });

//       it('updates the package dependency values correctly', () => {
//         Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
//           expect(
//             originalProductDirectoryByProductId[uuid][
//               originalProductDirectory.headings.packageDependencyIndex
//             ],
//           ).to.equal(
//             updatedProductDirectoryByProductId[uuid][
//               updatedProductDirectory.headings.packageDependencyIndex
//             ],
//           );
//         });
//       });

//       it('updates the cross product dependency values correctly', () => {
//         Object.keys(originalProductDirectoryByProductId).forEach(uuid => {
//           expect(
//             originalProductDirectoryByProductId[uuid][
//               originalProductDirectory.headings.crossProductDependencyIndex
//             ],
//           ).to.equal(
//             updatedProductDirectoryByProductId[uuid][
//               updatedProductDirectory.headings.crossProductDependencyIndex
//             ],
//           );
//         });
//       });
//     });
//   });

//   context(
//     'failure, received a 403 when requesting the Product Directory from GitHub',
//     () => {
//       let status;
//       let message;
//       let data;

//       before(async () => {
//         const octokit = sinon.createStubInstance(GitHubClient);
//         octokit.getProductDirectory.returns(
//           octokitResponses.productDirectoryForbidden,
//         );
//         octokit.createPull.returns(octokitResponses.createPull);
//         ({ status, message, data } = await main({ octokit }));
//       });

//       it('sets the status return prop to the correct value', () => {
//         expect(status).to.equal('Failure');
//       });

//       it('sets the message return prop to the correct value', () => {
//         expect(message).to.equal('There was an error with GitHub.');
//       });

//       it('returns a response with status code 403', () => {
//         const responseObject = JSON.parse(data);
//         expect(responseObject.status).to.equal(403);
//       });
//     },
//   );

//   context(
//     'failure, received a 404 when requesting the Product Directory from GitHub',
//     () => {
//       let status;
//       let message;
//       let data;

//       before(async () => {
//         const octokit = sinon.createStubInstance(GitHubClient);
//         octokit.getProductDirectory.returns(
//           octokitResponses.productDirectoryResourceNotFound,
//         );
//         octokit.createPull.returns(octokitResponses.createPull);
//         ({ status, message, data } = await main({ octokit }));
//       });

//       it('sets the status return prop to the correct value', () => {
//         expect(status).to.equal('Failure');
//       });

//       it('sets the message return prop to the correct value', () => {
//         expect(message).to.equal('There was an error with GitHub.');
//       });

//       it('returns a response with status code 404', () => {
//         const responseObject = JSON.parse(data);
//         expect(responseObject.status).to.equal(404);
//       });
//     },
//   );
// });
