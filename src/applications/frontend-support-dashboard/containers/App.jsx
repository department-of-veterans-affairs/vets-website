import React, { useState } from 'react';

// https://github.com/department-of-veterans-affairs/vets-website/blob/1cee564813462d6fe3896a10e477016f7cac2ebd/jenkins/common.groovy#L316
const vetsWebsiteBuildTexts = {
  dev: 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
  staging:
    'http://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
  prod: 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/BUILD.txt',
};

// https://github.com/department-of-veterans-affairs/content-build/blob/844d3170a92005dbee70a7ecf643362137ba68c3/jenkins/common.groovy#L280
// TODO: Uncomment when we're ready to add the content-build BUILD.txt info
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
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // vetsWebsiteDevBuildTextResponse,
    vetsWebsiteStagingBuildTextResponse,
    vetsWebsiteProdBuildTextResponse,
    vetsWebsiteCommitsResponse,
  ] = await Promise.all([
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // fetch(vetsWebsiteBuildTexts.dev),
    fetch(vetsWebsiteBuildTexts.staging),
    fetch(vetsWebsiteBuildTexts.prod),
    // last 30 commits from vets-website
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits`),
  ]);

  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const vestWebsiteDevBuildText = await vetsWebsiteDevBuildTextResponse.text();
  const vestWebsiteStagingBuildText = await vetsWebsiteStagingBuildTextResponse.text();
  const vestWebsiteProdBuildText = await vetsWebsiteProdBuildTextResponse.text();
  const vetsWebsiteCommits = await vetsWebsiteCommitsResponse.json();

  const result = {
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // vestWebsiteDevBuildText,
    vestWebsiteStagingBuildText,
    vestWebsiteProdBuildText,
    vetsWebsiteCommits,
  };
  console.log(result); // eslint-disable-line no-console

  return result;
}

export default function App({ children }) {
  const [commits, setCommits] = useState([]);
  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const [appsDevBuildText, setAppsDevBuildText] = useState('');
  const [appsStagingBuildText, setAppsStagingBuildText] = useState('');
  const [appsProdBuildText, setAppsProdBuildText] = useState('');

  React.useEffect(function fetchComponentData() {
    fetchDashboardData()
      .then(function handleSuccess(allData) {
        const {
          // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
          // vestWebsiteDevBuildText,
          vestWebsiteStagingBuildText,
          vestWebsiteProdBuildText,
          vetsWebsiteCommits,
        } = allData;
        setCommits(vetsWebsiteCommits);
        // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
        // setAppsDevBuildText(vestWebsiteDevBuildText);
        setAppsStagingBuildText(vestWebsiteStagingBuildText);
        setAppsProdBuildText(vestWebsiteProdBuildText);
        return allData;
      })
      .catch(function handleError(error) {
        console.log(error); // eslint-disable-line no-console
      });
  }, []);

  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const devRows = appsDevBuildText.split('\n').filter(x => x) || [];
  const stagingRows = appsStagingBuildText.split('\n').filter(x => x);
  const prodRows = appsProdBuildText.split('\n').filter(x => x);

  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const devRef = devRows[6]?.slice(4);
  const stagingRef = stagingRows[6]?.slice(4);
  const prodRef = prodRows[6]?.slice(4);
  const isOnDev = false; // TODO: Change from `const` to `let` once requests from localhost to dev are no longer blocked by CORS
  let isOnStaging = false;
  let isOnProd = false;

  return (
    <div className="row">
      <h1>Frontend Support Dashboard</h1>
      <h2>vets-website BUILD.txt files</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h4>
            <a href={vetsWebsiteBuildTexts.dev}>Dev</a>
          </h4>
          {/* 
          TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
          {devRows.map(x => {
            return <div key={x}>{x}</div>;
          })}
          */}
          <div>COMING SOON</div>
        </div>
        <div>
          <h4>
            <a href={vetsWebsiteBuildTexts.staging}>Staging</a>
          </h4>
          {stagingRows.map(x => {
            return <div key={x}>{x}</div>;
          })}
        </div>
        <div>
          <h4>
            <a href={vetsWebsiteBuildTexts.prod}>Prod</a>
          </h4>
          {prodRows.map(x => {
            return <div key={x}>{x}</div>;
          })}
        </div>
      </div>
      <h2>content-build BUILD.txt files</h2>
      <div>COMING SOON</div>
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
            const { committer = {}, message = '' } = commit;
            const { date } = committer;

            // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
            // if (sha === devRef) isOnDev = true;
            if (sha === stagingRef) isOnStaging = true;
            if (sha === prodRef) isOnProd = true;
            const onDevStyle = isOnDev ? { background: 'green' } : {};
            const onStagingStyle = isOnStaging ? { background: 'green' } : {};
            const onProdStyle = isOnProd ? { background: 'green' } : {};

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

                {/* Replace TODO with actual value once requests from localhost to dev are no longer blocked by CORS */}
                <td style={onDevStyle}>COMING SOON</td>
                <td style={onStagingStyle}>{isOnStaging ? 'TRUE' : 'FALSE'}</td>
                <td style={onProdStyle}>{isOnProd ? 'TRUE' : 'FALSE'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {children}
    </div>
  );
}
