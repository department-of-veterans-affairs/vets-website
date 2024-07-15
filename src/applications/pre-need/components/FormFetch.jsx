import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { fetchFormSubmissions } from '../utils/helpers';
import Signature from './Signature';

const snakeCaseToText = str => {
  return str.replace(/_/g, ' ').replace(/^./, char => char.toUpperCase());
};

function FormFetch({ formData }) {
  const [inputValue, setInputValue] = useState('');
  const [content, setContent] = useState(null);
  const [showReviewer, setShowReviewer] = useState(false);
  const isMounted = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = async e => {
    e.preventDefault();
    const data = await fetchFormSubmissions(inputValue);

    if (isMounted.current && data?.length > 0) {
      const fetchedFormData = data[0]?.form_data || {};
      setContent(data);
      setShowReviewer(!!data);

      // Function to normalize keys
      const normalizeKeys = formSection => {
        const normalizedData = {};
        if (formSection) {
          Object.entries(formSection).forEach(([key, value]) => {
            const normalizedKey = key.replace(/_([a-z])/g, (match, letter) =>
              letter.toUpperCase(),
            );
            normalizedData[normalizedKey] = value;
          });
        }
        return normalizedData;
      };

      // Normalize keys in fetchedFormData
      const normalizedFormData = {
        ...fetchedFormData,
        application: {
          ...fetchedFormData.application,
          applicant: normalizeKeys(fetchedFormData.application?.applicant),
          claimant: normalizeKeys(fetchedFormData.application?.claimant),
          veteran: normalizeKeys(fetchedFormData.application?.veteran),
        },
      };

      // Merge normalized fetchedFormData into formData
      const updatedFormData = {
        ...formData,
        application: {
          ...formData.application,
          ...normalizedFormData.application,
          applicant: {
            ...formData.application.applicant,
            ...normalizedFormData.application.applicant,
          },
          claimant: {
            ...formData.application.claimant,
            ...normalizedFormData.application.claimant,
          },
          veteran: {
            ...formData.application.veteran,
            ...normalizedFormData.application.veteran,
          },
        },
        statementOfTruthSignature: fetchedFormData.statement_of_truth_signature,
        statementOfTruthCertified: fetchedFormData.statement_of_truth_certified,
      };
      dispatch(setData(updatedFormData));
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
      {showReviewer && (
        <Signature
          formData={formData}
          signatureKey="reviewer_signature"
          certifiedKey="reviewer_signature_certified"
          label="Reviewer Signature"
        />
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(FormFetch);
