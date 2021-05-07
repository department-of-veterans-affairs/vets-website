import React from 'react';

import { vetsWebsiteInfo } from '../definitions/constants';

export default function CommitsTable({
  commits,
  stagingBuildText,
  prodBuildText,
}) {
  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const devRows = appsDevBuildText.split('\n').filter(x => x) || [];
  const stagingRows = stagingBuildText.split('\n').filter(x => x);
  const prodRows = prodBuildText.split('\n').filter(x => x);

  // TODO: Uncomment once requests from localhost to dev are no longer blocked by CORS
  // const devRef = devRows[6]?.slice(4);
  const stagingRef = stagingRows[6]?.slice(4);
  const prodRef = prodRows[6]?.slice(4);
  const isOnDev = false; // TODO: Change from `const` to `let` once requests from localhost to dev are no longer blocked by CORS
  let isOnStaging = false;
  let isOnProd = false;

  return (
    <div>
      <h2>{vetsWebsiteInfo.repo} BUILD.txt files</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h4>
            <a href={vetsWebsiteInfo.devBuildText}>Dev</a>
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
            <a href={vetsWebsiteInfo.stagingBuildText}>Staging</a>
          </h4>
          {stagingRows.map(x => {
            return <div key={x}>{x}</div>;
          })}
        </div>
        <div>
          <h4>
            <a href={vetsWebsiteInfo.prodBuildText}>Prod</a>
          </h4>
          {prodRows.map(x => {
            return <div key={x}>{x}</div>;
          })}
        </div>
      </div>
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
    </div>
  );
}
