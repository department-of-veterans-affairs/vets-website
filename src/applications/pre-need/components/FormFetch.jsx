import React, { useState, useEffect, useRef } from 'react';
import { fetchFormSubmissions } from '../utils/helpers';

const snakeCaseToText = str => {
  return str.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
};

const FormFetch = () => {
  const [inputValue, setInputValue] = useState('');

  const [content, setContent] = useState(null);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = async e => {
    e.preventDefault();

    const data = await fetchFormSubmissions(inputValue);

    if (isMounted.current) {
      setContent(data);
    }
  };

  const renderContent = data => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          {renderContent(item)}
        </div>
      ));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '0.5rem' }}>
          <strong>{snakeCaseToText(key)}: </strong>
          {typeof value === 'object' ? renderContent(value) : value.toString()}
        </div>
      ));
    }
    return <div>{data}</div>;
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Enter something"
      />
      <button onClick={handleClick}>Display veteran application</button>
      <div>{content ? renderContent(content) : 'No data available'}</div>
    </div>
  );
};

export default FormFetch;
