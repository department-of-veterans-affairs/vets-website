// components/servers/ProcessOutput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { OutputLineItem } from './OutputLineItem';

const ProcessOutput = ({ output, processName }) => {
  return (
    <div className="vads-u-padding--1 vads-u-border--1px vads-u-margin--0p5">
      <h3 className="vads-u-font-size--h4 vads-u-margin--0 vads-u-margin-bottom--0p25">
        Process Output
      </h3>
      <div
        className="usa-textarea"
        style={{ height: '50vh', overflowY: 'scroll' }}
      >
        <TransitionGroup>
          {output?.flatMap((msg, index) => {
            if (msg.type === 'cache') {
              return msg.data.map((line, cacheIndex) => (
                <OutputLineItem
                  line={line}
                  key={`${processName}-cache-${index}-${cacheIndex}`}
                />
              ));
            }
            return (
              <CSSTransition
                key={msg.id || `${processName}-${index}`}
                timeout={200}
                classNames="fade"
              >
                <OutputLineItem
                  line={`[${msg.friendlyDate}] ${msg.data}`}
                  key={`${processName}-${index}`}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    </div>
  );
};

ProcessOutput.propTypes = {
  output: PropTypes.array.isRequired,
  processName: PropTypes.string.isRequired,
};

export default ProcessOutput;
