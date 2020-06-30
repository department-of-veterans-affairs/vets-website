import React from 'react';
import MetaTags from 'react-meta-tags';
import MultiQuestionForm from '../components/MultiQuestionForm';
import { questions, defaultOptions } from '../config/questions';
import { useParams } from 'react-router-dom';

// produces error "Uncaught TypeError: Cannot read property 'match' of undefined"
// https://stackoverflow.com/a/59153982

export default function App() {
  const { id } = useParams();
  console.log(id);

  return (
    <div className="covid-screener">
      <MetaTags>
        <meta name="robots" content="noindex" />
      </MetaTags>
      <div className="vads-l-grid-container">
        <h1>COVID-19 screening tool</h1>
        <div className="va-introtext">
          <p>
            Please answer the questions listed below. Share your results with
            the staff member at the facility entrance.
          </p>
          <p>We won't store or share your data.</p>
        </div>
        <MultiQuestionForm
          questions={questions}
          defaultOptions={defaultOptions}
          customId={id}
        />
      </div>
    </div>
  );
}
