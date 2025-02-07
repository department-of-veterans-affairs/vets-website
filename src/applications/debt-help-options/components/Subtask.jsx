import React, { useState } from 'react';
import RadioOptions from './RadioOptions';
import { SUBTASK_FLOW } from '../subtasks';
// import { navigateForward, navigateBackward } from '../navigation';

const SubtaskFlow = () => {
  const [pageState, setPageState] = useState({
    currentPage: 'intro',
    selected: null,
  });
  const [routeMap, setRouteMap] = useState(['intro']);

  const handleOptionChange = ({ detail } = {}) => {
    const { value } = detail;

    // Record the analytics event
    // recordEvent({
    //   event: 'subtask-formChange',
    //   'form-field-type': 'form-radio-buttons',
    //   'form-field-label': 'Question: ' + pageState.currentPage,
    //   'form-field-value': value,
    // });

    let currentConfig;
    if (pageState.currentPage === 'intro') {
      currentConfig = SUBTASK_FLOW.intro;
    } else {
      currentConfig =
        SUBTASK_FLOW.flows[pageState.currentPage]?.questions?.initial?.options;
    }
    if (!currentConfig) return;

    const selectedOption = currentConfig.find(opt => opt.value === value);
    if (selectedOption) {
      setPageState({
        currentPage: selectedOption.next,
        selected: value,
      });
    }
  };

  const handleContinue = () => {
    if (!pageState.selected) return;
    setRouteMap(prev => [...prev, pageState.currentPage]);
  };

  const handleBack = () => {
    if (routeMap.length > 1) {
      const newRouteMap = routeMap.slice(0, -1);
      setRouteMap(newRouteMap);
      setPageState(prev => ({
        ...prev,
        currentPage: newRouteMap[newRouteMap.length - 1],
        selected: null,
      }));
    }
  };

  let content;
  if (pageState.currentPage === 'intro') {
    content = (
      <RadioOptions
        config={SUBTASK_FLOW.intro}
        title="What's this debt related to?"
        currentStep="intro"
        selectedValues={{}}
        onContinue={handleContinue}
        onBack={handleBack}
        onOptionChange={handleOptionChange}
      />
    );
  } else {
    const flowConfig = SUBTASK_FLOW.flows[pageState.currentPage];
    if (flowConfig && flowConfig.questions && flowConfig.questions.initial) {
      const question = flowConfig.questions.initial;
      content = (
        <RadioOptions
          config={question.options}
          title={question.title}
          currentStep={pageState.currentPage}
          selectedValues={{}}
          onContinue={handleContinue}
          onBack={handleBack}
          onOptionChange={handleOptionChange}
        />
      );
    } else if (
      flowConfig &&
      flowConfig.outcomes &&
      flowConfig.outcomes[pageState.currentPage]
    ) {
      const outcomes = flowConfig.outcomes[pageState.currentPage];
      content = (
        <div>
          {outcomes.map((item, index) => (
            <div key={index}>
              <h3>{item.title}</h3>
              <div>{item.message}</div>
            </div>
          ))}
          <va-button
            onClick={() =>
              setPageState({ currentPage: 'intro', selected: null })
            }
          >
            Start Over
          </va-button>
        </div>
      );
    } else {
      content = (
        <div>
          <h2>Error: Unable to determine next page.</h2>
          <va-button onClick={handleBack}>Back</va-button>
        </div>
      );
    }
  }

  return (
    <div>
      {content}
      <div style={{ marginTop: '1rem' }}>
        <va-button onClick={handleBack} disabled={routeMap.length <= 1}>
          Back
        </va-button>
        <va-button onClick={handleContinue} disabled={!pageState.selected}>
          Continue
        </va-button>
      </div>
      <div>
        {/* Debug: show routeMap */}
        <p>Route History: {routeMap.join(' > ')}</p>
      </div>
    </div>
  );
};

export default SubtaskFlow;
