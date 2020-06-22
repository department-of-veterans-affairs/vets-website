/**
 * This script processes all of the domains listed in proxy-rewrite-whitelist.json
 * and the pages listed in crossDomainRedirects.json to verify that those pages
 * do contain the JavaScript bundle "proxy-rewrite", which means in fact we can
 * inject our header/footer or perform a redirect.
 */

/* eslint-disable no-console */

const fetch = require('node-fetch');
const chalk = require('chalk');

const {
  proxyRewriteWhitelist: headerFooterTargets,
} = require('../proxy-rewrite-whitelist.json');
const redirects = require('../redirects/crossDomainRedirects.json');

// This string is technically the prod S3 bucket domain plus the path to this JavaScript bundle
// generated via Webpack so we can technically derive this from shared constants.
// However, it's hardcoded into TeamSite bundles as this URL, so hardcoding it instead adds that extra
// validation in case one of the constants changed one day.

const INJECTION_ENTRY_SCRIPT =
  'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/proxy-rewrite.entry.js';

async function verifyPageContainsProxyRewrite(page, failures) {
  try {
    const response = await fetch(page);
    const pageContents = await response.text();
    const redirectEntryIncluded = pageContents.includes(INJECTION_ENTRY_SCRIPT);

    if (redirectEntryIncluded) {
      console.log(chalk.blue(`${page} contains the proxy-rewrite script`));
    } else {
      failures.push(page);
      console.log(
        chalk.red(`${page} does not contain the proxy-rewrite script`),
      );
    }
  } catch (err) {
    failures.push(page);
    console.log(chalk.red(`${page} could not be verified`));
  }
}

async function main() {
  const pages = [
    ...headerFooterTargets.map(
      site => `https://${site.hostname}${site.pathnameBeginning}`,
    ),
    ...redirects.map(redirect => `https://${redirect.domain}${redirect.src}`),
  ];

  const failures = [];

  await Promise.all(
    pages.map(page => verifyPageContainsProxyRewrite(page, failures)),
  );

  if (failures.length > 0) {
    console.log(
      'The following pages either do not contain the proxy-rewrite script or could not be verified',
    );
    console.log(failures.join('\n'));
    process.exitCode = 1;
  }
}

main();
