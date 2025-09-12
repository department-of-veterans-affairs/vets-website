import React from 'react';
import PropTypes from 'prop-types';
import IntroductionPage from './IntroductionPage';
import ReviewPage from './ReviewPage';
import ConfirmationPage from './ConfirmationPage';

const HeaderPlaceholder = () => (
  <div
    data-widget-type="header"
    data-show="true"
    data-show-mega-menu="true"
    data-show-nav-login="true"
  />
);

const FooterPlaceholder = () => <div id="footerNav" />;

class StaticDemo2App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 'intro' };
  }

  goTo = step => () => this.setState({ step });

  renderIntro = () => <IntroductionPage onNext={this.goTo('review')} />;

  renderReview = () => <ReviewPage onNext={this.goTo('confirmation')} />;

  renderConfirmation = () => <ConfirmationPage />;

  render() {
    const { step } = this.state;

    return (
      <div>
        <HeaderPlaceholder />
        <div className="vads-u-padding-top--2">
          {step === 'intro' && this.renderIntro()}
          {step === 'review' && this.renderReview()}
          {step === 'confirmation' && this.renderConfirmation()}
        </div>
        <FooterPlaceholder />
      </div>
    );
  }
}

StaticDemo2App.propTypes = {
  route: PropTypes.shape({}),
};

export default StaticDemo2App;
