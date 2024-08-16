import React from 'react';
import PhoneView from '../components/phone/PhoneView';
import CallContextProvider from '../contexts/CallContextProvider';

const App = () => (
  <div className="vads-l-grid-container vads-u-margin-y--3">
    <h1>Call Veterans Crisis Line over the Internet</h1>
    <p>
      Call the VA from your web browser over Wi-Fi or using your cellular data
      connection.
    </p>

    <CallContextProvider
      // sipServer="ws://6.tcp.ngrok.io:14164"
      sipServer="ws://localhost:5062"
      iceServerUrls={['stun:stun.l.google.com:19302']}
      callerSipUri="sip:alice@sip.local"
      callerSipPassword="12345"
    >
      <PhoneView
        calleeSipUri="sip:bob@sip.local"
        calleeName="Veterans Crisis Line"
        extraHeaders={['X-Custom-Header: value']}
      />
    </CallContextProvider>
  </div>
);

export default App;
