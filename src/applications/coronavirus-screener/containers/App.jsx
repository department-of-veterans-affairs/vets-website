import React from 'react';
import MetaTags from 'react-meta-tags';
import MultiQuestionForm from '../components/MultiQuestionForm';
import { questions, defaultOptions } from '../config/questions';
import { introText } from '../config/text';

const introductionText = (
  <>
    <h1>COVID-19 screening tool</h1>
    <div className="va-introtext">
      <p>
        Please answer the questions listed below. Share your results with the
        staff member at the facility entrance.
      </p>
      <p>We won't store or share your data.</p>
    </div>
  </>
);

export default function App({ params }) {
  let selectedLanguage = 'en';
  let alternateLangauge = 'es';
  let alternateRefBase = '/covid19screen/';
  // Control for facility ids that have letters in them e.g. 459GE.
  let customId = params.id?.slice(0, 3);

  // If the first value is not a number, then there is no custom site id.
  if (isNaN(customId)) {
    customId = undefined;
  } else {
    // If the first three chars of the first value is a number,
    // then there is a custom site id.
    alternateRefBase = `/covid19screen/${params.id}/`;
  }
  // If the last two chars of the first or second value is ES,
  // then change the langauge to Spanish.
  if (
    params.id?.toUpperCase() === 'ES' ||
    params.languageId?.toUpperCase() === 'ES'
  ) {
    selectedLanguage = 'es';
    alternateLangauge = 'en';
  }

  const alternateRef = `${alternateRefBase}${alternateLangauge}`;

  return (
    <div className="covid-screener">
      <MetaTags>
        <meta name="robots" content="noindex" />
      </MetaTags>
      {introductionText}
      <div className="vads-l-grid-container">
        <h1>{introText.h1[selectedLanguage]}</h1>
        <div className="va-introtext">
          <p>{introText.vaIntroText[selectedLanguage]}</p>
          <p>{introText.privacyText[selectedLanguage]}</p>
          <p>
            <a href={alternateRef}>
              <strong>{introText.languageSelectText[selectedLanguage]}</strong>
            </a>
          </p>
        </div>
        <MultiQuestionForm
          questions={questions}
          defaultOptions={defaultOptions}
          customId={customId?.toUpperCase()}
          selectedLanguage={selectedLanguage}
        />
      </div>
    </div>
  );
}
