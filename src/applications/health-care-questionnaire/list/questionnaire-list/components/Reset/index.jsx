import React, { useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import QuestionnaireResponse from './QuestionnaireResponse';

export default function Reset() {
  const [apiKey, setApiKey] = useState('');
  const [source, setSource] = useState('1008882029V851792');
  const [responses, setResponses] = useState([]);

  const loadQRs = async thisSource => {
    // get all qr
    const url = `/health_quest/v0/questionnaire_responses?source=${thisSource}`;
    const resp = await apiRequest(`${environment.API_URL}${url}`);
    setResponses(resp.entry);
  };

  useEffect(
    () => {
      loadQRs(source);
    },
    [source],
  );

  return (
    <div>
      hello, there,
      <div>
        <input
          type="text"
          placeholder="supply the apikey"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="patient id"
          value={source}
          onChange={e => setSource(e.target.value)}
        />
      </div>
      <div>
        <header>current questionnaires</header>
        <p>total QR: {responses.length}</p>
        <ul>
          {responses.map((qr, i) => {
            return (
              <QuestionnaireResponse
                key={i}
                resource={qr.resource}
                apiKey={apiKey}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
