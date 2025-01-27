// components/servers/ProcessOutput.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { OutputLineItem } from './OutputLineItem';
import { FRONTEND_PROCESS_NAME } from '../../../constants';

const getStatusOfProcess = (output, processName) => {
  if (!output) return 'unknown';

  if (processName === FRONTEND_PROCESS_NAME) {
    // get first message to check if it's finished compiling
    const firstMessage = output[0];

    if (firstMessage?.type === 'cache') {
      const isFinishedCompiling = firstMessage.data.some(line =>
        line.toLowercase().includes('compiled successfully'),
      );
      return isFinishedCompiling
        ? 'finished 🎉'
        : 'compiling...hang in there 🦥';
    }

    if (
      firstMessage?.data.includes('ERROR') ||
      firstMessage?.data.includes('error')
    ) {
      return 'error 🚨';
    }

    return firstMessage?.data?.includes('compiled successfully')
      ? 'finished 🎉'
      : 'compiling...hang in there 🦥';
  }

  return 'unknown';
};

const ProcessOutput = ({ output, processName }) => {
  return (
    <div className="vads-u-padding--1 vads-u-border--1px vads-u-margin--0p5">
      <h3 className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-margin--0 vads-u-margin-bottom--0p25">
        Status: {getStatusOfProcess(output, processName)}
      </h3>
      <div
        className="usa-textarea"
        style={{ height: '50vh', overflowY: 'scroll' }}
        tabIndex="0"
        role="textbox"
        aria-multiline="true"
        aria-readonly="true"
        aria-label={`Process Output for ${processName}`}
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
