/* @flow */

import React, { Component } from "react";

import SettingInput from "./SettingInput";
import Button from "metabase/components/Button";
import Confirm from "metabase/components/Confirm";

import { UtilApi } from "metabase/services";

type Props = {
    updateSetting: (value: any) => void,
    setting: {}
};

export default class SecretKeyWidget extends Component {
    props: Props;

    _generateToken = async () => {
        const { updateSetting } = this.props;
        const result = await UtilApi.random_token();
        updateSetting(result.token);
    }

    render() {
        const { setting } = this.props;
        return (
            <div className="flex align-center">
                <SettingInput {...this.props} />
                { setting.value ?
                    <Confirm
                        title="生成一个新key?"
                        ontent="已集成的将会停止工作直到用新生成的key更新."
                        action={this._generateToken}
                    >
                        <Button className="ml1" primary medium>重新生成Key</Button>
                    </Confirm>
                :
                    <Button className="ml1" primary medium onClick={this._generateToken}>生成Key</Button>
                }
            </div>
        );
    }
}
