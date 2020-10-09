import React, { useEffect } from 'react';
import { Element } from 'react-scroll';
import moment from 'moment';
import classnames from 'classnames';
import { scrollerTo } from '../lib';
import { resultText } from '../config/text';

function Complete({ children, selectedLanguage }) {
  return (
    <div>
      {children}
      <div className="covid-screener-date vads-u-font-weight--bold">
        <div className="vads-u-font-size--xl">
          {resultText.validtext[selectedLanguage]}
        </div>
        <div className="covid-screener-400">{moment().format('dddd')}</div>
        <div className="covid-screener-500">{moment().format('MMM D')}</div>
        <div className="vads-u-font-size--xl">{moment().format('h:mm a')}</div>
      </div>
      {resultText.completeText[selectedLanguage]}
    </div>
  );
}

export default function FormResult({ formState, selectedLanguage }) {
  const scrollElementName = 'multi-question-form-result-scroll-element';

  const Incomplete = () => (
    <div>{resultText.incompleteText[selectedLanguage]}</div>
  );

  const Pass = () => (
    <Complete selectedLanguage={selectedLanguage}>
      <i aria-hidden="true" role="presentation" className="fas fa-check" />
      <h2 className="vads-u-font-size--2xl">
        {resultText.passText[selectedLanguage]}
      </h2>
    </Complete>
  );

  const MoreScreening = () => (
    <Complete selectedLanguage={selectedLanguage}>
      <h2 className="vads-u-font-size--2xl">
        {resultText.moreScreeningText[selectedLanguage]}
      </h2>
    </Complete>
  );

  useEffect(() => {
    // only scroll when form is complete
    if (formState.status !== 'incomplete') {
      scrollerTo(scrollElementName);
    }
  });

  const resultList = {
    pass: {
      content: <Pass />,
      class: 'pass',
    },
    'more-screening': {
      content: <MoreScreening />,
      class: 'more-screening',
    },
    incomplete: {
      content: <Incomplete />,
      class: 'incomplete',
    },
  };

  const resultContent = resultList[formState.status].content;

  return (
    <div
      className={classnames(
        'feature',
        'covid-screener-results',
        `covid-screener-results-${resultList[formState.status].class}`,
      )}
    >
      <Element name={scrollElementName} />
      <div>{resultContent}</div>
    </div>
  );
}
