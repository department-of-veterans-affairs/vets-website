import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { ChatbotComponent } from './ChatbotComponent';

export class ChatbotWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = this.props.store.subscribe(() =>
      this.setState({
        loading: this.props.store.getState().featureToggles.loading,
      }),
    );
    this.state = {
      loading: this.props.store.getState().featureToggles.loading,
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message={'Loading coronavirus chatbot...'} />;
    }
    return <ChatbotComponent />;
  }
}
