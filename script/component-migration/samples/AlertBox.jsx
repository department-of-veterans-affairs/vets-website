import React from 'react';

export function Sample() {
  const myStatus = 'info';
  const someContent = 'Testing Testing';
  const myHeadline = 'Pay attention!';

  return (
    <va-alert status={myStatus} visible>
      <h3 slot="headline">{myHeadline}</h3>
      {someContent}
    </va-alert>
  );
}

export function OtherSample() {
  return (
    <div>
      <div>
        <div>
          <va-alert status="error" visible>
            <h3 slot="headline">This is a multiline component</h3>
            <p>I'm some child content</p>
            <span>Blah blah</span>
          </va-alert>
        </div>
      </div>
    </div>
  );
}

export function NamedClosing() {
  const myHeadline = 'Another headline';

  return (
    <va-alert visible status="info">
      <h3 slot="headline">{myHeadline}</h3>
      <div>I'm the child content!</div>
      <ul>
        <li>Dog</li>
        <li>Cat</li>
        <li>Mouse</li>
      </ul>
    </va-alert>
  );
}
