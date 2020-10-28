import React from 'react';

const StepComponent = props => {
  const { step } = props;
  return (
    <div>
      <h3>{step.title}</h3>
      <iframe
        width="100%"
        height="450"
        src={`https://www.youtube.com/embed/${step.path}`}
        title={step.title}
        frameBorder="0"
        allowFullScreen
      />
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
