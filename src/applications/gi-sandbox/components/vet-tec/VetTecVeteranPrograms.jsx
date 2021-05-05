import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

export class VetTecVeteranPrograms extends React.Component {
  programs = () => {
    const { institution } = this.props;

    const firstProgram = _.get(institution, 'programs[0]', {});

    return [
      {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: firstProgram.studentVetGroupWebsite,
          text: 'Site',
        },
        available: !!firstProgram.studentVetGroup,
      },
      {
        modal: 'vsoc',
        text: 'VetSuccess on Campus',
        link: {
          href:
            firstProgram.vetSuccessEmail &&
            `mailto:${firstProgram.vetSuccessEmail}`,
          text: `Email ${firstProgram.vetSuccessName}`,
        },
        available: !!firstProgram.vetSuccessName,
      },
    ];
  };

  renderProgramLabel = (program, index) => {
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
        <i className={icon} aria-hidden="true" /> {label} {link}
      </div>
    );
  };

  render() {
    const programs = this.programs();
    const availablePrograms = programs.filter(program => program.available);

    return (
      <div className="programs row">
        {availablePrograms.length > 0 ? (
          <div className="usa-width-one-half medium-6 large-6 column vads-u-margin-top--2">
            {availablePrograms.map((program, index) =>
              this.renderProgramLabel(program, index),
            )}
            <br />
          </div>
        ) : (
          <p>
            Please contact the school or their military office directly for
            information on the Veteran programs they offer.
          </p>
        )}
      </div>
    );
  }
}

VetTecVeteranPrograms.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default VetTecVeteranPrograms;
