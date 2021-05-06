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
    // vetsWebsiteDevBuildTextResponse,
    vetsWebsiteStagingBuildTextResponse,
    vetsWebsiteProdBuildTextResponse,
    vetsWebsiteCommitsResponse,
  ] = await Promise.all([
    // fetch(vetsWebsiteBuildTexts.dev),
    fetch(vetsWebsiteBuildTexts.staging),
    fetch(vetsWebsiteBuildTexts.prod),
    // last 30 commits from vets-website
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits`),
  ]);

  // const vestWebsiteDevBuildText = await vetsWebsiteDevBuildTextResponse.text();
  const vestWebsiteStagingBuildText = await vetsWebsiteStagingBuildTextResponse.text();
  const vestWebsiteProdBuildText = await vetsWebsiteProdBuildTextResponse.text();
  const vetsWebsiteCommits = await vetsWebsiteCommitsResponse.json();

  const result = {
    // vestWebsiteDevBuildText,
    vestWebsiteStagingBuildText,
    vestWebsiteProdBuildText,
    vetsWebsiteCommits,
  };
  console.log(result); // eslint-disable-line no-console

  return result;
}

export default function App({ children }) {
  const [commits, setCommits] = React.useState([]);
  React.useEffect(function fetchComponentData() {
    fetchDashboardData()
      .then(function handleSuccess(allData) {
        // const {
        //   vestWebsiteDevBuildText,
        //   vestWebsiteStagingBuildText,
        //   vestWebsiteProdBuildText,
        //   vetsWebsiteCommits,
        // } = allData;
        console.log({ allData }); // eslint-disable-line no-console
        setCommits(allData.vetsWebsiteCommits);
        return allData;
      })
      .catch(function handleError(error) {
        console.log(error); // eslint-disable-line no-console
      });
  }, []);
  return (
    <div>
      <h1>Frontend Support Dashboard</h1>
      <h2>Commits</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Message</th>
            <th>SHA</th>
            <th>Link</th>
            <th>On Dev?</th>
            <th>On Staging?</th>
            <th>On Prod?</th>
          </tr>
        </thead>
        <tbody>
          {commits.map(x => {
            const { commit = {}, html_url, sha } = x; // eslint-disable-line camelcase
            const { committer = {}, message } = commit;
            const { date } = committer;
            /* 
            if (sha === devRef) isOnDev = true;
            if (sha === stagingRef) isOnStaging = true;
            if (sha === prodRef) isOnProd = true;
            const onDevStyle = isOnDev ? { background: 'green' } : {};
            const onStagingStyle = isOnStaging ? { background: 'green' } : {};
            const onProdStyle = isOnProd ? { background: 'green' } : {};
            */
            return (
              <tr key={sha}>
                <td>{date}</td>
                <td>{message.slice(0, 50)}</td>
                <td>{sha}</td>
                <td>
                  <a href={html_url /* eslint-disable-line camelcase */}>
                    GitHub
                  </a>
                </td>
                {/* 
                <td style={onDevStyle}>{isOnDev ? 'TRUE' : 'FALSE'}</td>
                <td style={onStagingStyle}>{isOnStaging ? 'TRUE' : 'FALSE'}</td>
                <td style={onProdStyle}>{isOnProd ? 'TRUE' : 'FALSE'}</td>
                */}
                <td>TODO</td>
                <td>TODO</td>
                <td>TODO</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {children}
    </div>
  );
}
