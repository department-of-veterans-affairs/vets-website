import React from 'react';

export class RatingRow extends React.Component {
    render() {
        // console.log(props)
        return (
            <div className="rating vads-l-row" key={Date.now()}>
                <div className="vads-l-col--2 vads-u-padding-right--2">
                    <input
                        type="text"
                        min="0"
                        onChange={this.props.handleRatingCalculateChange}
                        className="ratingInput"
                        maxLength="3"
                        value={this.props.value}
                        reference={this.props.reference}

                    />
                </div>
                <div className="vads-l-col--8">
                    <input className="descriptionInput" />
                </div>
                <div className="vads-l-col--2">
                    <button
                        type="button"
                        handleRemoveRating={this.props.handleRemoveRating}
                    >
                        <i className="fas fa-trash-alt" />
                    </button>
                    <a href="#">Delete</a>
                </div>
            </div>
        )
    }
}

