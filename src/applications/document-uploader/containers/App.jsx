import React from 'react';
import { connect } from 'react-redux';
import { DocumentUploader } from '../components/DocumentUploader.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div><DocumentUploader /></div>
    )
  }
}

export default App;
