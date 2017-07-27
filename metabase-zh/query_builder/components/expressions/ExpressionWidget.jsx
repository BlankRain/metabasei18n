import React, { Component } from 'react';
import PropTypes from "prop-types";
import cx from "classnames";
import _ from 'underscore';

import ExpressionEditorTextfield from "./ExpressionEditorTextfield.jsx";
import { isExpression } from "metabase/lib/expressions";


export default class ExpressionWidget extends Component {

    static propTypes = {
        expression: PropTypes.array,
        name: PropTypes.string,
        tableMetadata: PropTypes.object.isRequired,
        onSetExpression: PropTypes.func.isRequired,
        onRemoveExpression: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    static defaultProps = {
        expression: null,
        name: ""
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            name: newProps.name,
            expression: newProps.expression
        });
    }

    isValid() {
        const { name, expression, error } = this.state;
        return (!_.isEmpty(name) && !error && isExpression(expression));
    }

    render() {
        const { expression } = this.state;

        return (
            <div style={{maxWidth: "600px"}}>
                <div className="p2">
                    <div className="h5 text-uppercase text-grey-3 text-bold">字段公式</div>
                    <div>
                        <ExpressionEditorTextfield
                            expression={expression}
                            tableMetadata={this.props.tableMetadata}
                            onChange={(parsedExpression) => this.setState({expression: parsedExpression, error: null})}
                            onError={(errorMessage) => this.setState({error: errorMessage})}
                        />
                        <p className="h5 text-grey-2">
                            就像在Excel里面写公式一样:你可以使用数字和表里的字段,
                             数学符号 +, 还有一些函数.  所以你可以输入, Subtotal - Cost.
                            <a className="link" href="http://www.metabase.com/docs/latest/users-guide/03-asking-questions.html#creating-a-custom-field">了解更多</a>
                        </p>
                    </div>

                    <div className="mt3 h5 text-uppercase text-grey-3 text-bold">给我一个名字吧</div>
                    <div>
                        <input
                            className="my1 input block full"
                            type="text"
                            value={this.state.name}
                            placeholder="一些富有表达力的好东西"
                            onChange={(event) => this.setState({name: event.target.value})}
                        />
                    </div>
                </div>

                <div className="mt2 p2 border-top flex flex-row align-center justify-between">
                    <div>
                        <button
                            className={cx("Button", {"Button--primary": this.isValid()})}
                            onClick={() => this.props.onSetExpression(this.state.name, this.state.expression)}
                            disabled={!this.isValid()}>{this.props.expression ? "Update" : "Done"}</button>
                        <span className="pl1">or</span> <a className="link" onClick={() => this.props.onCancel()}>取消</a>
                    </div>
                    <div>
                        {this.props.expression ?
                         <a className="pr2 text-warning link" onClick={() => this.props.onRemoveExpression(this.props.name)}>移除</a>
                         : null }
                    </div>
                </div>
            </div>
        );
    }
}
