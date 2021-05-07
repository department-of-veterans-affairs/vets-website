import React, { useState } from 'react';

import CommitsTable from './CommitsTable';

import { vetsWebsiteInfo } from '../definitions/constants';

async function fetchDashboardData(repo) {
  // https://dmitripavlutin.com/javascript-fetch-async-await/#5-parallel-fetch-requests
  const [
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // devBuildTextResponse,
    stagingBuildTextResponse,
    prodBuildTextResponse,
    commitsResponse,
  ] = await Promise.all([
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // fetch(repo.devBuildText),
    fetch(repo.stagingBuildText),
    fetch(repo.prodBuildText),
    // last 30 commits from vets-website
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits`),
  ]);

  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const devBuildText = await devBuildTextResponse.text();
  const stagingBuildText = await stagingBuildTextResponse.text();
  const prodBuildText = await prodBuildTextResponse.text();
  const commits = await commitsResponse.json();

  const result = {
    // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
    // devBuildText,
    stagingBuildText,
    prodBuildText,
    commits,
  };
  console.log(result); // eslint-disable-line no-console

  return result;
}

export default function App({ children }) {
  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const [appsDevBuildText, setAppsDevBuildText] = useState('');
  const [appsStagingBuildText, setAppsStagingBuildText] = useState('');
  const [appsProdBuildText, setAppsProdBuildText] = useState('');
  const [appsCommits, setAppsCommits] = useState([]);

  React.useEffect(function fetchComponentData() {
    fetchDashboardData(vetsWebsiteInfo)
      .then(function handleSuccess(allData) {
        const {
          // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
          // devBuildText,
          stagingBuildText,
          prodBuildText,
          commits,
        } = allData;
        // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
        // setAppsDevBuildText(devBuildText);
        setAppsStagingBuildText(stagingBuildText);
        setAppsProdBuildText(prodBuildText);
        setAppsCommits(commits);
        return allData;
      })
      .catch(function handleError(error) {
        console.log(error); // eslint-disable-line no-console
      });
  }, []);

  return (
    <div className="row">
      <h1>Frontend Support Dashboard</h1>

      <CommitsTable
        commits={appsCommits}
        stagingBuildText={appsStagingBuildText}
        prodBuildText={appsProdBuildText}
      />

      {children}
    </div>
  );
}
