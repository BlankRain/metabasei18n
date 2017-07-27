/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";

import RetinaImage from "react-retina-image";

export default class WhatsAPulse extends Component {
    static propTypes = {
        button: PropTypes.object
    };
    render() {
        return (
            <div className="flex flex-column align-center px4">
                <h2 className="my4 text-brand">
                    让你团队里的每个人和你的数据保持同步.
                </h2>
                <div className="mx4">
                    <RetinaImage
                        width={574}
                        src="app/assets/img/pulse_empty_illustration.png"
                        forceOriginalDimensions={false}
                    />
                </div>
                <div className="h3 my3 text-centered text-grey-2 text-bold" style={{maxWidth: "500px"}}>
                    Pulses 可以让你通过邮件或Slack按某种调度计划来发送数据.
                </div>
                {this.props.button}
            </div>
        );
    }
}
