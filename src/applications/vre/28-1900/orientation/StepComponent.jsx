import React from 'react';
import SegmentedProgressBar from '@department-of-veterans-affairs/formation-react/SegmentedProgressBar';
import { orientationSteps } from './utils';

const StepComponent = props => {
  const { step } = props;
  const stepTotal = orientationSteps.length;
  const data = orientationSteps[step];
  return (
    <div>
      <h3 className="vads-u-margin-top--0">
        {data.number}. {data.title}
      </h3>
      <h4 className="vads-u-font-weight--normal vads-u-margin-top--0">
        Veteran Readiness and Employment orientation
      </h4>
      <div className="vads-u-margin-bottom--3">
        <SegmentedProgressBar current={data.number} total={stepTotal} />
      </div>
      <iframe
        width="325px"
        height="185px"
        src={`https://www.youtube.com/embed/${data.path}`}
        title={data.title}
        frameBorder="0"
        allowFullScreen
      />
      <p>{data.desc}</p>
      <ul>
        {data.list.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
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
