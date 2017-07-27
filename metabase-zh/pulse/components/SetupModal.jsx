/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";

import SetupMessage from "./SetupMessage.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";

export default class SetupModal extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired
    };

    render() {
        return (
            <ModalContent
                onClose={this.props.onClose}
                title={`要发送pulses, ${ this.props.user.is_superuser ? "你需要" : "管理员需要"} 设置邮箱或者slack交互.`}
            >
                <SetupMessage user={this.props.user} />
            </ModalContent>
        );
    }
}
