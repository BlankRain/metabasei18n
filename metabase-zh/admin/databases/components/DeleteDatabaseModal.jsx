import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalContent from "metabase/components/ModalContent.jsx";

import cx from "classnames";

export default class DeleteDatabaseModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmValue: "",
            error: null
        };
    }

    static propTypes = {
        database: PropTypes.object.isRequired,
        onClose: PropTypes.func,
        onDelete: PropTypes.func
    };

    async deleteDatabase() {
        try {
            this.props.onDelete(this.props.database);
            // immediately call on close because database deletion should be non blocking
            this.props.onClose()
        } catch (error) {
            this.setState({ error });
        }
    }

    render() {
        const { database } = this.props;

        var formError;
        if (this.state.error) {
            var errorMessage = "服务器后台错误";
            if (this.state.error.data &&
                this.state.error.data.message) {
                errorMessage = this.state.error.data.message;
            } else {
                errorMessage = this.state.error.message;
            }

            // TODO: timeout display?
            formError = (
                <span className="text-error px2">{errorMessage}</span>
            );
        }

        let confirmed = this.state.confirmValue.toUpperCase() === "DELETE" || this.state.confirmValue.toUpperCase() === "删除";

        return (
            <ModalContent
                title="删除数据库"
                onClose={this.props.onClose}
            >
                <div className="Form-inputs mb4">
                    { database.is_sample &&
                        <p><strong>友情提醒一下:</strong> 没有示例数据集,查询构建器探索教程就不能工作. 当然,你总是可以重建示例数据集.</p>
                    }
                    <p>
                        你确定要删除该数据库? 所有保存的依赖于此数据库的问题都会丢失. <strong>这操作是不可恢复的</strong>. 如果你确定,请输入 <strong>DELETE</strong> 在下面的盒子里:
                    </p>
                    <input className="Form-input" type="text" onChange={(e) => this.setState({ confirmValue: e.target.value })} autoFocus />
                </div>

                <div className="Form-actions">
                    <button className={cx("Button Button--danger", { "disabled": !confirmed })} onClick={() => this.deleteDatabase()}>删除</button>
                    <button className="Button Button--primary ml1" onClick={this.props.onClose}>取消</button>
                    {formError}
                </div>
            </ModalContent>
        );
    }
}
