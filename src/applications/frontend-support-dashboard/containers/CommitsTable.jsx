import React from 'react';

export default function CommitsTable({
  repo,
  devBuildText,
  stagingBuildText,
  prodBuildText,
  commits,
}) {
  const devRows = devBuildText.split('\n').filter(x => x) || [];
  const stagingRows = stagingBuildText.split('\n').filter(x => x);
  const prodRows = prodBuildText.split('\n').filter(x => x);

  const devRef = devRows[6]?.slice(4);
  const stagingRef = stagingRows[6]?.slice(4);
  const prodRef = prodRows[6]?.slice(4);
  let isOnDev = false;
  let isOnStaging = false;
  let isOnProd = false;

  return (
    <div>
      <h2>{repo.repo} BUILD.txt files</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h4>
            <a href={repo.devBuildText}>Dev</a>
          </h4>
          {devRows.map(info => {
            return <div key={info}>{info}</div>;
          })}
        </div>
        <div>
          <h4>
            <a href={repo.stagingBuildText}>Staging</a>
          </h4>
          {stagingRows.map(info => {
            return <div key={info}>{info}</div>;
          })}
        </div>
        <div>
          <h4>
            <a href={repo.prodBuildText}>Prod</a>
          </h4>
          {prodRows.map(info => {
            return <div key={info}>{info}</div>;
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

            if (sha === devRef) isOnDev = true;
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
                <td style={onDevStyle}>{isOnDev ? 'TRUE' : 'FALSE'}</td>
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
