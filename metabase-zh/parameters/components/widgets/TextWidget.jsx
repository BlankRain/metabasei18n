/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { KEYCODE_ENTER, KEYCODE_ESCAPE } from "metabase/lib/keyboard";

export default class TextWidget extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: props.value,
            isFocused: false
        };
    }

    static propTypes = {
        value: PropTypes.any,
        setValue: PropTypes.func.isRequired,
        className: PropTypes.string,
        isEditing: PropTypes.bool,
        commitImmediately: PropTypes.bool,
        placeholder: PropTypes.string,
        focusChanged: PropTypes.func
    };

    static defaultProps = {
        commitImmediately: false,
    };

    static noPopover = true;

    static format = (value) => value;

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({ value: nextProps.value });
        }
    }

    render() {
        const { setValue, className, isEditing, focusChanged: parentFocusChanged } = this.props;
        const defaultPlaceholder = this.state.isFocused ? "" : (this.props.placeholder || "输入一个值...");

        const focusChanged = (isFocused) => {
            if (parentFocusChanged) parentFocusChanged(isFocused);
            this.setState({isFocused})
        };

        return (
            <input
                className={className}
                type="text"
                value={this.state.value || ""}
                onChange={(e) => {
                    this.setState({ value: e.target.value })
                    if (this.props.commitImmediately) {
                        this.props.setValue(e.target.value || null);
                    }
                }}
                onKeyUp={(e) => {
                    if (e.keyCode === KEYCODE_ESCAPE) {
                        e.target.blur();
                    } else if (e.keyCode === KEYCODE_ENTER) {
                        setValue(this.state.value || null);
                        e.target.blur();
                    }
                }}
                onFocus={() => {focusChanged(true)}}
                onBlur={() => {
                    focusChanged(false);
                    this.setState({ value: this.props.value });
                }}
                placeholder={isEditing ? "输入默认值..." : defaultPlaceholder}
            />
        );
    }
}
