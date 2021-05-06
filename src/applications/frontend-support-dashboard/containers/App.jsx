import React from 'react';

// https://github.com/department-of-veterans-affairs/vets-website/blob/1cee564813462d6fe3896a10e477016f7cac2ebd/jenkins/common.groovy#L316
const vetsWebsiteBuildTexts = {
  dev: 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
  staging:
    'http://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
  prod: 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
};

// https://github.com/department-of-veterans-affairs/content-build/blob/844d3170a92005dbee70a7ecf643362137ba68c3/jenkins/common.groovy#L280
// const contentBuildBuildTexts = {
//   dev: 'https://dev.va.gov/BUILD.txt',
//   staging: 'https://staging.va.gov/BUILD.txt',
//   prod: 'https://www.va.gov/BUILD.txt',
// };

const owner = 'department-of-veterans-affairs';
const repo = 'vets-website';

async function fetchDashboardData() {
  // https://dmitripavlutin.com/javascript-fetch-async-await/#5-parallel-fetch-requests
  const [
    vetsWebsiteDevBuildTextResponse,
    vetsWebsiteStagingBuildTextResponse,
    vetsWebsiteProdBuildTextResponse,
    vetsWebsiteCommitsResponse,
  ] = await Promise.all([
    fetch(vetsWebsiteBuildTexts.dev),
    fetch(vetsWebsiteBuildTexts.staging),
    fetch(vetsWebsiteBuildTexts.prod),
    // last 30 commits from vets-website
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits`),
  ]);

  const vestWebsiteDevBuildText = await vetsWebsiteDevBuildTextResponse.text();
  const vestWebsiteStagingBuildText = await vetsWebsiteStagingBuildTextResponse.text();
  const vestWebsiteProdBuildText = await vetsWebsiteProdBuildTextResponse.text();
  const vetsWebsiteCommits = await vetsWebsiteCommitsResponse.json();

  const result = {
    vestWebsiteDevBuildText,
    vestWebsiteStagingBuildText,
    vestWebsiteProdBuildText,
    vetsWebsiteCommits,
  };
  console.log(result); // eslint-disable-line no-console

  return result;
}

export default function App({ children }) {
  React.useEffect(() => {
    fetchDashboardData()
      .then(allData => {
        // const {
        //   vestWebsiteDevBuildText,
        //   vestWebsiteStagingBuildText,
        //   vestWebsiteProdBuildText,
        //   vetsWebsiteCommits,
        // } = allData;
        console.log({ allData }); // eslint-disable-line no-console
        return allData;
      })
      .catch(error => {
        console.log(error); // eslint-disable-line no-console
      });
  }, []);
  return (
    <div>
      <h1>Frontend Support Dashboard</h1>
      {children}
    </div>
  );
}
