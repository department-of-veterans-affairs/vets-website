import environment from 'platform/utilities/environment';
import { useEffect, useState } from 'react';

export default function useStaticDrupalData(file) {
  const [staticDrupalData, setStaticDrupalData] = useState([]);

  const BASE_ENDPOINT = environment.isLocalhost()
    ? 'http://localhost:3002'
    : environment.BASE_URL;

  useEffect(
    () => {
      fetch(`${BASE_ENDPOINT}/data/cms/${file}.json`)
        .then(res => res.json())
        .then(data => setStaticDrupalData(data));
    },
    [file, BASE_ENDPOINT],
  );

  return staticDrupalData || false;
}
