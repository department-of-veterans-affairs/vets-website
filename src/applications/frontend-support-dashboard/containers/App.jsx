import React, { useState } from 'react';

import CommitsTable from './CommitsTable';
import { vetsWebsiteInfo, contentBuildInfo } from '../definitions/constants';

async function fetchDashboardData(repo) {
  // https://dmitripavlutin.com/javascript-fetch-async-await/#5-parallel-fetch-requests
  const [
    devBuildTextResponse,
    stagingBuildTextResponse,
    prodBuildTextResponse,
    commitsResponse,
  ] = await Promise.all([
    fetch(repo.devBuildText),
    fetch(repo.stagingBuildText),
    fetch(repo.prodBuildText),
    // last 30 commits from vets-website
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits`),
  ]);

  const devBuildText = await devBuildTextResponse.text();
  const stagingBuildText = await stagingBuildTextResponse.text();
  const prodBuildText = await prodBuildTextResponse.text();
  const commits = await commitsResponse.json();

  const result = {
    devBuildText,
    stagingBuildText,
    prodBuildText,
    commits,
  };
  console.log(result); // eslint-disable-line no-console

  return result;
}

export default function App({ children }) {
  const [appsDevBuildText, setAppsDevBuildText] = useState('');
  const [appsStagingBuildText, setAppsStagingBuildText] = useState('');
  const [appsProdBuildText, setAppsProdBuildText] = useState('');
  const [appsCommits, setAppsCommits] = useState([]);
  const [contentDevBuildText, setContentDevBuildText] = useState('');
  const [contentStagingBuildText, setContentStagingBuildText] = useState('');
  const [contentProdBuildText, setContentProdBuildText] = useState('');
  const [contentCommits, setContentCommits] = useState([]);

  // Fetches vets-website
  React.useEffect(function fetchComponentData() {
    fetchDashboardData(vetsWebsiteInfo)
      .then(function handleSuccess(allData) {
        const {
          devBuildText,
          stagingBuildText,
          prodBuildText,
          commits,
        } = allData;
        setAppsDevBuildText(devBuildText);
        setAppsStagingBuildText(stagingBuildText);
        setAppsProdBuildText(prodBuildText);
        setAppsCommits(commits);
        return allData;
      })
      .catch(function handleError(error) {
        console.log(error); // eslint-disable-line no-console
      });
  }, []);

  // Fetches content-build
  React.useEffect(function fetchComponentData() {
    fetchDashboardData(contentBuildInfo)
      .then(function handleSuccess(allData) {
        const {
          devBuildText,
          stagingBuildText,
          prodBuildText,
          commits,
        } = allData;
        setContentDevBuildText(devBuildText);
        setContentStagingBuildText(stagingBuildText);
        setContentProdBuildText(prodBuildText);
        setContentCommits(commits);
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
        repo={vetsWebsiteInfo}
        devBuildText={appsDevBuildText}
        stagingBuildText={appsStagingBuildText}
        prodBuildText={appsProdBuildText}
        commits={appsCommits}
      />

      <CommitsTable
        repo={contentBuildInfo}
        devBuildText={contentDevBuildText}
        stagingBuildText={contentStagingBuildText}
        prodBuildText={contentProdBuildText}
        commits={contentCommits}
      />

      {children}
    </div>
  );
}
