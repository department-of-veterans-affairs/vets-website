import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import If from '../../components/If';

export class Programs extends React.Component {

  programs(institution) {
    return {
      yr: {
        modal: 'yribbon',
        text: 'Yellow Ribbon',
        link: {
          href: `http://www.benefits.va.gov/gibill/yellow_ribbon/2015/states/${institution.state}.asp`,
          text: 'See rates',
        }
      },
      student_veteran: {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: institution.student_veteran_link,
          text: 'Site',
        }
      },
      poe: {
        modal: 'poe',
        text: 'Principles of Excellence',
        link: false
      },
      eight_keys: {
        modal: 'eightKeys',
        text: '8 Keys to Veteran Success',
        link: false
      },
      vet_success_name: {
        modal: false,
        text: 'VetSuccess on Campus',
        link: {
          href: institution.vet_success_email ? `mailto:${institution.vet_success_email}` : false,
          text: `Email ${institution.vet_success_name}`,
        }
      },
      dodmou: {
        modal: 'ta',
        text: 'Military Tuition Assistance (TA)',
        link: false
      },
    };
  }

  renderProgramLabel(programKey, available) {
    const program = this.programs(this.props.profile.attributes)[programKey];
    const icon = available ? 'fa fa-check' : 'fa fa-remove';
    let link = '';
    if (program.link && program.link.href) {
      link = <span>&nbsp;(<a href={program.link.href} target="_blank">{program.link.text}</a>)</span>;
    }
    let label = '';
    if (program.modal) {
      label = <a onClick={this.props.showModal.bind(this, program.modal)}>{program.text}</a>;
    } else {
      label = program.text;
    }
    return <p key={programKey}><i className={icon}/> {label} {link}</p>;
  }

  render() {
    const it = this.props.profile.attributes;
    const available = Object.keys(this.programs(it)).filter((key) => !!it[key] === true);
    const notAvailable = Object.keys(this.programs(it)).filter((key) => !!it[key] === false);
    return (
      <div className="programs row">
        <If condition={available.length > 0}>
          <div className="medium-6 large-6 column">
            <h3>Veteran programs available at this campus</h3>
            {available.map(( (program) => this.renderProgramLabel.bind(this, program, true)() ))}
            <br/>
          </div>
        </If>
        <If condition={notAvailable.length > 0}>
          <div className="medium-6 large-6 column">
            <h3>Not available at this campus</h3>
            {notAvailable.map(( (program) => this.renderProgramLabel.bind(this, program, false)() ))}
          </div>
        </If>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Programs);
