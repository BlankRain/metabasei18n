import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalContent from "metabase/components/ModalContent.jsx";

import inflection from "inflection";

export default class DeleteQuestionModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null
        };
    }

    static propTypes = {
        card: PropTypes.object.isRequired,
        deleteCardFn: PropTypes.func.isRequired,
        onClose: PropTypes.func
    };

    async deleteCard() {
        try {
            await this.props.deleteCardFn(this.props.card);
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        var formError;
        if (this.state.error) {
            var errorMessage = "服务端错误";
            if (this.state.error.data &&
                this.state.error.data.message) {
                errorMessage = this.error.errors.data.message;
            }

            // TODO: timeout display?
            formError = (
                <span className="text-error px2">{errorMessage}</span>
            );
        }

        var dashboardCount = this.props.card.dashboard_count + " " + inflection.inflect("dashboard", this.props.card.dashboard_count);

        return (
            <ModalContent
                title="移除提问"
                onClose={this.props.onClose}
            >
                <div className="Form-inputs mb4">
                    <p>你确定要这么做?</p>
                    { this.props.card.dashboard_count > 0 ?
                        <p>将会从metabase里移除这个提问, 并且也会从 {dashboardCount} 移除.</p>
                    : null }
                </div>

                <div className="Form-actions">
                    <button className="Button Button--danger" onClick={() => this.deleteCard()}>是的</button>
                    <button className="Button Button--primary ml1" onClick={this.props.onClose}>不</button>
                    {formError}
                </div>
            </ModalContent>
        );
    }
}
