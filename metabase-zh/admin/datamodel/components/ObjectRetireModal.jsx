import React, { Component } from "react";
import ReactDOM from "react-dom";

import ActionButton from "metabase/components/ActionButton.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";

import { capitalize } from "metabase/lib/formatting";
import cx from "classnames";

export default class ObjectRetireModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            valid: false
        };
    }

    async handleSubmit() {
        const { object, objectType } = this.props;
        let payload = {
            revision_message: ReactDOM.findDOMNode(this.refs.revision_message).value
        };
        payload[objectType+"Id"] = object.id;

        await this.props.onRetire(payload);
        this.props.onClose();
    }

    render() {
        const { objectType } = this.props;
        const { valid } = this.state;
        return (
            <ModalContent
                title={"恢复 这个 " + capitalize(objectType)}
                onClose={this.props.onClose}
            >
                <form className="flex flex-column flex-full">
                    <div className="Form-inputs pb4">
                        <p>保存的问题或其他依赖于此 {objectType} 仍然可以工作, 但是， {objectType} 将无法在查询构建器里选择.</p>
                        <p>如果你确定要恢复 {objectType}, 请简要说明一下原因:</p>
                        <textarea
                            ref="revision_message"
                            className="input full"
                            placeholder={"这个将会显示在活动记录里 and 并且会发份邮件给您队伍中使用到 " + objectType + " 的人员."}
                            onChange={(e) => this.setState({ valid: !!e.target.value })}
                        />
                    </div>

                    <div className="Form-actions">
                        <ActionButton
                            actionFn={this.handleSubmit.bind(this)}
                            className={cx("Button", { "Button--primary": valid, "disabled": !valid })}
                            normalText="恢复"
                            activeText="正则恢复..."
                            failedText="失败了"
                            successText="成功啦"
                        />
                        <a className="Button Button--borderless" onClick={this.props.onClose}>
                            Cancel
                        </a>
                    </div>
                </form>
            </ModalContent>
        );
    }
}
