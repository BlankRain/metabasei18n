import React, { Component } from "react";
import PropTypes from "prop-types";

import cx from "classnames";
import _ from "underscore";

import Breadcrumbs from "metabase/components/Breadcrumbs.jsx";
import Input from "metabase/components/Input.jsx";

export default class SettingsSingleSignOnForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.updateClientID    = this.updateClientID.bind(this);
        this.updateDomain      = this.updateDomain.bind(this);
        this.onCheckboxClicked = this.onCheckboxClicked.bind(this),
        this.saveChanges       = this.saveChanges.bind(this),
        this.clientIDChanged   = this.clientIDChanged.bind(this),
        this.domainChanged     = this.domainChanged.bind(this)
    }

    static propTypes = {
        elements: PropTypes.array,
        updateSetting: PropTypes.func.isRequired
    };

    componentWillMount() {
        let { elements } = this.props,
            clientID     = _.findWhere(elements, {key: 'google-auth-client-id'}),
            domain       = _.findWhere(elements, {key: 'google-auth-auto-create-accounts-domain'});

        this.setState({
            clientID:      clientID,
            domain:        domain,
            clientIDValue: clientID.value,
            domainValue:   domain.value,
            recentlySaved: false
        });
    }

    updateClientID(newValue) {
        if (newValue === this.state.clientIDValue) return;

        this.setState({
            clientIDValue: newValue && newValue.length ? newValue : null,
            recentlySaved: false
        });
    }

    updateDomain(newValue) {
        if (newValue === this.state.domain.value) return;

        this.setState({
            domainValue: newValue && newValue.length ? newValue : null,
            recentlySaved: false
        });
    }

    clientIDChanged() {
        return this.state.clientID.value !== this.state.clientIDValue;
    }

    domainChanged() {
        return this.state.domain.value !== this.state.domainValue;
    }

    saveChanges() {
        let { clientID, clientIDValue, domain, domainValue } = this.state;

        if (this.clientIDChanged()) {
            this.props.updateSetting(clientID, clientIDValue);
            this.setState({
                clientID: {
                    value: clientIDValue
                },
                recentlySaved: true
            });
        }

        if (this.domainChanged()) {
            this.props.updateSetting(domain, domainValue);
            this.setState({
                domain: {
                    value: domainValue
                },
                recentlySaved: true
            });
        }
    }

    onCheckboxClicked() {
        // if domain is present, clear it out; otherwise if there's no domain try to set it back to what it was
        this.setState({
            domainValue: this.state.domainValue ? null : this.state.domain.value,
            recentlySaved: false
        });
    }

    render() {
        let hasChanges  = this.domainChanged() || this.clientIDChanged(),
            hasClientID = this.state.clientIDValue;

        return (
            <form noValidate>
                <div
                    className="px2"
                    style={{maxWidth: "585px"}}
                >
                    <Breadcrumbs
                        crumbs={[
                            ["Authentication", "/admin/settings/authentication"],
                            ["Google Sign-In"]
                        ]}
                        className="mb2"
                    />
                    <h2>Google登录</h2>
                    <p className="text-grey-4">
                       允许已有的用户使用其谷歌邮箱用户名密码登陆.
                    </p>
                    <p className="text-grey-4">
                        允许用户使用谷歌登录,你需要提供一个谷歌开发者的应用客户端ID.  <a className="link" href="https://developers.google.com/identity/sign-in/web/devconsole-project" target="_blank">这里.</a> 有简单的介绍,如何创建这个Key.
                    </p>
                    <Input
                        className="SettingsInput AdminInput bordered rounded h3"
                        type="text"
                        value={this.state.clientIDValue}
                        placeholder="你的谷歌客户端ID"
                        onChange={(event) => this.updateClientID(event.target.value)}
                    />
                    <div className="py3">
                        <div className="flex align-center">
                            <p className="text-grey-4">允许登陆,只要这些用户的邮箱地址是来自:</p>
                        </div>
                        <div className="mt1 bordered rounded inline-block">
                            <div className="inline-block px2 h2">@</div>
                            <Input
                                className="SettingsInput inline-block AdminInput h3 border-left"
                                type="text"
                                value={this.state.domainValue}
                                onChange={(event) => this.updateDomain(event.target.value)}
                                disabled={!hasClientID}
                            />
                        </div>
                    </div>

                    <button className={cx("Button mr2", {"Button--primary": hasChanges})}
                            disabled={!hasChanges}
                            onClick={this.saveChanges}>
                        {this.state.recentlySaved ? "已保存!" : "保存修改"}
                    </button>
                </div>
            </form>
        );
    }
}
