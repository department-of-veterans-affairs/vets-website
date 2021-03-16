import React from 'react';
import { orientationSteps } from './utils';

const StepComponent = props => {
  const { step } = props;
  const data = orientationSteps[step];
  let content;

  if (data.isVideoStep) {
    content = (
      <>
        {data.subTitle()}

        <iframe
          width="325px"
          height="185px"
          src={`https://www.youtube.com/embed/${data.path}`}
          title={data.title}
          frameBorder="0"
          allowFullScreen
          key={data.path}
        />
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
        <h3>{data.desc}</h3>
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
                  <h4>{entry.title}</h4>
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
      <h2 id="StepTitle" className="vads-u-margin-top--0">
        {data.title}
      </h2>
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
