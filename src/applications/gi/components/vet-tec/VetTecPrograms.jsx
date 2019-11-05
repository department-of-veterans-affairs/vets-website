import PropTypes from 'prop-types';
import React from 'react';

export class VetTecPrograms extends React.Component {
  constructor(props) {
    super(props);
    this.renderProgramLabel = this.renderProgramLabel.bind(this);
    const { institution } = props;

    const program =
      institution.programs.length > 0 ? institution.programs[0] : {};

    this.programs = [
      {
        modal: 'yribbon',
        text: 'Yellow Ribbon',
        link: false,
        available: false,
      },
      {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: program.studentVetGroupWebsite,
          text: 'Site',
        },
        available: !!program.studentVetGroup,
      },
      {
        modal: 'poe',
        text: 'Principles of Excellence',
        link: false,
        available: false,
      },
      {
        modal: 'eightKeys',
        text: '8 Keys to Veteran Success',
        link: false,
        available: false,
      },
      {
        modal: 'vsoc',
        text: 'VetSuccess on Campus',
        link: {
          href: program.vetSuccessEmail && `mailto:${program.vetSuccessEmail}`,
          text: `Email ${program.vetSuccessName}`,
        },
        available: !!program.vetSuccessName,
      },

      {
        modal: 'ta',
        text: 'Military Tuition Assistance (TA)',
        link: false,
        available: false,
      },

      {
        modal: 'priEnroll',
        text: 'Priority Enrollment',
        link: false,
        available: false,
      },

      {
        modal: 'onlineOnlyDistanceLearning',
        text: 'Online Only',
        link: false,
        available: false,
      },

      {
        modal: 'onlineOnlyDistanceLearning',
        text: 'Distance Learning',
        link: false,
        available: false,
      },
    ];
  }

  renderProgramLabel(program, index) {
    const icon = program.available ? 'fa fa-check' : 'fa fa-remove';

    const link =
      (program.available &&
        program.link &&
        program.link.href && (
          <span>
            &nbsp;(
            <a
              href={program.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {program.link.text}
            </a>
            )
          </span>
        )) ||
      '';
    const label = program.modal ? (
      <button
        type="button"
        className="va-button-link learn-more-button"
        onClick={this.props.onShowModal.bind(this, program.modal)}
      >
        {program.text}
      </button>
    ) : (
      program.text
    );
    return (
      <div key={index}>
        <i className={icon} /> {label} {link}
      </div>
    );
  }

  render() {
    return (
      <div className="programs row">
        {this.programs.findIndex(program => program.available === true) !==
          -1 && (
          <div className="usa-width-one-half medium-6 large-6 column">
            <h3>Available at this campus</h3>
            {this.programs.map(
              (program, index) =>
                program.available
                  ? this.renderProgramLabel(program, index)
                  : '',
            )}
            <br />
          </div>
        )}
        {this.programs.length > 0 && (
          <div className="usa-width-one-half medium-6 large-6 column">
            <h3>Not available at this campus</h3>
            {this.programs.map(
              (program, index) =>
                !program.available
                  ? this.renderProgramLabel(program, index)
                  : '',
            )}
          </div>
        )}
      </div>
    );
  }
}

VetTecPrograms.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default VetTecPrograms;
