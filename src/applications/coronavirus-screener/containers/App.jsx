import React from 'react';
import MetaTags from 'react-meta-tags';
import MultiQuestionForm from '../components/MultiQuestionForm';
import { questions, defaultOptions } from '../config/questions';

export default function App({ params }) {
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
          customId={params.id}
        />
      </div>
    </div>
  );
}
