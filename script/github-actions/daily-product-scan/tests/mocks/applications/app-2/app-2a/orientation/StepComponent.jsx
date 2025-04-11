import React from 'react';
import { Link } from 'react-router';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { orientationSteps } from './utils';

const StepComponent = props => {
  const { step, clickHandler } = props;
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
        <h4>{data.desc}</h4>
        <div className="process schemaform-process">
          <ol>
            {data.list.map((entry, index) => {
              return (
                <li
                  key={index}
                  className={`process-step list-${entry.step} vads-u-padding-bottom--0p5`}
                >
                  <h5 className="vads-u-font-size--h4">{entry.title}</h5>
                  <ul>
                    {entry.items.map((item, idx) => {
                      return (
                        <li className="vads-u-padding-bottom--2" key={idx}>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </>
    );
  } else if (step === orientationSteps.length - 1) {
    content = (
      <div className="vads-u-margin-bottom--3">
        <Link
          to="/"
          className="vads-c-action-link--green"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-complete-orientation',
            });
            clickHandler(WIZARD_STATUS_COMPLETE);
          }}
        >
          Apply for Veteran Readiness and Employment now
        </Link>
      </div>
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
