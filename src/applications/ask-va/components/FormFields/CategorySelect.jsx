import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { setCategoryID } from '../../actions';
import { ServerErrorAlert } from '../../config/helpers';
import {
  CHAPTER_1,
  URL,
  envUrl,
  requireSignInCategories,
} from '../../constants';
import RequireSignInModal from '../RequireSignInModal';

const CategorySelect = props => {
  const { id, onChange, value, loggedIn } = props;
  const dispatch = useDispatch();

  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [showModal, setShowModal] = useState({ show: false, selected: '' });

  const onModalNo = () => {
    onChange('');
    setShowModal({ show: false, selected: '' });
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selected = apiData.find(cat => cat.attributes.name === selectedValue);
    dispatch(setCategoryID(selected.id));
    onChange(selectedValue);
    if (requireSignInCategories.includes(selectedValue) && !loggedIn)
      setShowModal({ show: true, selected: `${selectedValue}` });
  };

  const getApiData = url => {
    isLoading(true);
    return apiRequest(url)
      .then(res => {
        setApiData(res.data);
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        hasError(true);
      });
  };

  useEffect(
    () => {
      getApiData(`${envUrl}${URL.GET_CATEGORIES}`);
    },
    [loggedIn],
  );

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return !error ? (
    <>
      <VaSelect
        id={id}
        name="Select category"
        messageAriaDescribedby={CHAPTER_1.PAGE_1.QUESTION_1}
        value={value}
        onVaSelect={handleChange}
        uswds
      >
        {apiData.map(category => (
          <option
            key={category.id}
            value={category.attributes.name}
            id={category.id}
          >
            {category.attributes.name}
          </option>
        ))}
      </VaSelect>

      <RequireSignInModal
        onClose={onModalNo}
        show={showModal.show}
        restrictedItem={showModal.selected}
      />
    </>
  ) : (
    <ServerErrorAlert />
  );
};

CategorySelect.propTypes = {
  id: PropTypes.string,
  loggedIn: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(CategorySelect);
