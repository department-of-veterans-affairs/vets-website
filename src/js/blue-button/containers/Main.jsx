import React from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import { reportTypes } from '../config';

class Main extends React.Component {
  renderInformationTypes() {
    return Object.keys(reportTypes).map(k => {
      const rt = reportTypes[k];
      return (
        <div key={k}>
          <h5>{rt.title}</h5>
          {rt.children.map(c => {
            return (
              <div key={c.value}>
                <ErrorableCheckbox
                    name={c.value}
                    label={c.label}
                    onValueChange={() => {}}/>
              </div>
            );
          })}
        </div>
      );
    });
  }

  render() {
    // TODO: clean this up and hook up to action/reducer
    const radioButtonProps = {
      label: '',
      options: [
        { label: '3 months', value: '3mo' },
        { label: '6 months', value: '6mo' },
        { label: '1 year', value: '1yr' },
        { label: 'Custom date range', value: 'custom' },
      ],
      onValueChange: () => {},
      value: {
        value: 'dateRange',
      }
    };

    return (
      <div>
        <Breadcrumbs location={this.props.location}/>
        <div>
          <h4 className="highlight">Select Date Range</h4>
          <ErrorableRadioButtons
              {...radioButtonProps}/>
        </div>
        <div>
          <h4 className="highlight">Select Types of Information</h4>
          {this.renderInformationTypes()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
