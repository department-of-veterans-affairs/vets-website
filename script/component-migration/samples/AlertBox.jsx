import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export function Sample() {
  const myStatus = 'info';
  const someContent = 'Testing Testing';
  const myHeadline = 'Pay attention!';

  return (
    <AlertBox status={myStatus} headline={myHeadline} content={someContent} />
  );
}

export function OtherSample() {
  return (
    <div>
      <div>
        <div>
          <AlertBox
            status="error"
            headline="This is a multiline component"
            level="2"
            content={
              <div>
                <p>I'm some child content</p>
                <span>Blah blah</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
