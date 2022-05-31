import environment from 'platform/utilities/environment';
import { useEffect, useState } from 'react';

export default function useStaticDrupalData(file) {
  const [staticDrupalData, setStaticDrupalData] = useState([]);

  const API_ENDPOINT = environment.isLocalhost()
    ? 'http://localhost:3002'
    : environment.API_URL;

  useEffect(
    () => {
      fetch(`${API_ENDPOINT}/data/cms/${file}.json`)
        .then(res => res.json())
        .then(data => setStaticDrupalData(data));
    },
    [file, API_ENDPOINT],
  );

  return staticDrupalData;
}
