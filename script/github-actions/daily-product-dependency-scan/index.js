/* eslint-disable no-console */
const glob = require('glob');

const GitHub = require('./github');
const Products = require('./products');
const PackageDependencies = require('./package-dependencies');
const CrossProductDependencies = require('./cross-product-dependencies');
const DependencyDiffer = require('./dependency-differ');
const Csv = require('./csv');
const Headings = require('./csv/headings');
const Rows = require('./csv/rows');
const { removeCarriageReturn, transformCsvToScsv } = require('./csv/helpers');

async function main() {
  const products = new Products();

  products.addProducts({
    manifestPaths: glob.sync('src/applications/**/*manifest.json'),
  });

  new PackageDependencies({
    products: products.all,
  }).setDependencies();

  new CrossProductDependencies({
    products: products.all,
  }).setDependencies();

  const octokit = new GitHub();
  let response = await octokit.getProductDirectory();

  if (response.status === 200) {
    const { data: csv } = response;
    const csvLines = removeCarriageReturn(transformCsvToScsv(csv).split('\n'));

    const emptyProductDirectory = new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: [] }),
    });

    const productDirectory = new Csv({
      headings: new Headings({ csvLine: csvLines.slice(0, 1)[0] }),
      rows: new Rows({ csvLines: csvLines.slice(1) }),
    });

    const dependencyDiffer = new DependencyDiffer({ emptyProductDirectory });
    dependencyDiffer.diff({ products, productDirectory });

    if (dependencyDiffer.dependenciesChanged) {
      console.log('Dependencies have changed.');
      response = await octokit.getBranch();

      if (response.status === 200) {
        response = await octokit.createBlob({
          content: emptyProductDirectory.generateOutput(),
        });

        if (response.status === 201) {
          response = await octokit.createRef();

          if (response.status === 201) {
            response = await octokit.createTree();

            if (response.status === 201) {
              response = await octokit.createCommit();

              if (response.status === 201) {
                response = await octokit.createPull();

                if (response.status === 201) {
                  console.log('Pull request successully submitted.');
                }
              }
            }
          }
        }
      }
    }
  }

  // fail
}

main();
