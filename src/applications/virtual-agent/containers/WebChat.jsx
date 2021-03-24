import React, { useMemo, useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

function WebChat({ featureTogglesLoading }) {
  const { ReactWebChat, createDirectLine, createStore } = window.WebChat;
  const [token, setToken] = useState('');

  useEffect(
    () => {
      async function getToken() {
        if (featureTogglesLoading) return;
        const res = await apiRequest('/virtual_agent_token', {
          method: 'POST',
        });
        setToken(res.token);
      }
      getToken();
    },
    [featureTogglesLoading],
  );

  const store = useMemo(() => createStore(), []);

  const directLine = useMemo(
    () =>
      createDirectLine({
        token,
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
      }),
    [token],
  );

  if (featureTogglesLoading) {
    return <LoadingIndicator message={'Loading Chatbot'} />;
  }

  return (
    <div className={'vads-l-grid-container'}>
      <div
        className={'vads-l-row'}
        data-testid={'webchat'}
        style={{ height: '500px' }}
      >
        <ReactWebChat
          styleOptions={{ hideUploadButton: true }}
          directLine={directLine}
          store={store}
          userID="12345"
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    featureTogglesLoading: state.featureToggles.loading,
  };
};

export default connect(mapStateToProps)(WebChat);
