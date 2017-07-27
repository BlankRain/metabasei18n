import React, { Component } from "react";
import ReactDOM from "react-dom";

import _ from "underscore";
import cx from "classnames";

export default class PulseEditName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            valid: true
        };

        _.bindAll(this, "setName", "validate");
    }

    static propTypes = {};
    static defaultProps = {};

    setName(e) {
        let { pulse } = this.props;
        this.props.setPulse({ ...pulse, name: e.target.value });
    }

    validate() {
        this.setState({ valid: !!ReactDOM.findDOMNode(this.refs.name).value });
    }

    render() {
        let { pulse } = this.props;
        return (
            <div className="py1">
                <h2>给你的pulse命名</h2>
                <p className="mt1 h4 text-bold text-grey-3">给你的pulse一个名字,大家好懂你这个是干嘛的。</p>
                <div className="my3">
                    <input
                        ref="name"
                        className={cx("input text-bold", { "border-error": !this.state.valid })}
                        style={{"width":"400px"}}
                        value={pulse.name || ""}
                        onChange={this.setName}
                        onBlur={this.validate}
                        placeholder="导入 metrics"
                        autoFocus
                    />
                </div>
            </div>
        );
    }
}
