import React from 'react';
import { orientationSteps } from './utils';

const StepComponent = props => {
  const { step } = props;
  const data = orientationSteps[step];
  let content;

  if (data.isVideoStep) {
    content = (
      <>
        <p>{data.desc}</p>
        <ul>
          {data.list.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </>
    );
  } else if (data.isSubwayContent) {
    content = (
      <>
        <h4>{data.desc}</h4>
        <div className="process schemaform-process">
          <ol>
            {data.list.map((entry, index) => {
              return (
                <li
                  key={index}
                  className={`process-step list-${
                    entry.step
                  } vads-u-padding-bottom--0p5`}
                >
                  <h5 className="vads-u-font-size--h4">{entry.title}</h5>
                  <ul>
                    {entry.items.map((item, idx) => {
                      return <li key={idx}>{item}</li>;
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <p>{data.desc}</p>
        <ul>
          {data.list.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
        {data.postText()}
      </>
    );
  }

  return (
    <div>
      <h3
        aria-describedby="orientation-step"
        id="StepTitle"
        className="vads-u-margin-top--0"
      >
        {data.title}
      </h3>
      {content}
    </div>
  );
};

export default StepComponent;

/*
Youtube videos
Re-Employment
<iframe
  width="744"
  height="422"
  src="https://www.youtube.com/embed/1Yh6fTxvBPw"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>;

Rapid Access
<iframe
  width="744"
  height="422"
  src="https://www.youtube.com/embed/4DVbOy8iJbU"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>;

Self-Employment
<iframe
  width="744"
  height="422"
  src="https://www.youtube.com/embed/xkqhMmWzt74"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>;

Long Term Services
<iframe
    width="744"
    height="422"
    src="https://www.youtube.com/embed/IXlJndX93R8"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
/>;

Independent Living
<iframe
    width="744"
    height="422"
    src="https://www.youtube.com/embed/hHgPTZNAMxo"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
/>
*/
