import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ApplicationSelector } from './ApplicationSelector';
import { OutputLineItem } from './servers/OutputLineItem';
import { useProcessManager } from '../../hooks/useProcessManager';

const DevPanel = () => {
  const { processes, output, startProcess, stopProcess } = useProcessManager();

  const renderProcessColumn = (
    processName,
    displayName,
    startConfig,
    stopPort,
  ) => {
    return (
      <div className="vads-l-col--5 vads-l-grid-container--full vads-u-padding--0">
        <div className="vads-l-row vads-u-align-items--center">
          <h2 className="vads-u-font-size--h4 vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--bold">
            {displayName}
          </h2>
          {processes[processName] ? (
            <>
              <div className="vads-u-padding-x--1 vads-u-font-style--italic">
                Status: Running 🍏
              </div>
              <va-button
                className="usa-button usa-button-secondary"
                onClick={() => stopProcess(processName, stopPort)}
                text="stop process"
                secondary
              />
            </>
          ) : (
            <>
              <div className="vads-u-padding-x--1 vads-u-font-style--italic">
                Status: Stopped 🍎
              </div>
              <va-button
                className="usa-button"
                onClick={() => startProcess(processName, startConfig)}
                text="start process"
                secondary
              />
            </>
          )}
        </div>

        <div className="vads-u-padding--1 vads-u-border--1px vads-u-margin--0p5">
          <h3 className="vads-u-font-size--h4 vads-u-margin--0 vads-u-margin-bottom--0p25">
            Process Output
          </h3>
          <div
            className="usa-textarea"
            style={{ height: '50vh', overflowY: 'scroll' }}
          >
            <TransitionGroup>
              {output[processName]?.flatMap((msg, index) => {
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
      </div>
    );
  };

  return (
    <div className="vads-l-grid-container--full vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--2 vads-l-grid-container vads-u-padding--0">
          <ApplicationSelector />
        </div>
        {renderProcessColumn(
          'fe-dev-server',
          'Frontend Dev Server',
          {
            entry: 'mock-form-ae-design-patterns',
            api: 'http://localhost:3000',
          },
          3001,
        )}
        {renderProcessColumn(
          'mock-server',
          'Mock API Server',
          {
            debug: true,
            responsesPath:
              'src/applications/_mock-form-ae-design-patterns/mocks/server.js',
          },
          3000,
        )}
      </div>
    </div>
  );
};

export default DevPanel;
