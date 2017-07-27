import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import cx from "classnames";

import AuthScene from "../components/AuthScene.jsx";
import FormField from "metabase/components/form/FormField.jsx";
import FormLabel from "metabase/components/form/FormLabel.jsx";
import FormMessage from "metabase/components/form/FormMessage.jsx";
import LogoIcon from "metabase/components/LogoIcon.jsx";
import Icon from "metabase/components/Icon.jsx";

import MetabaseSettings from "metabase/lib/settings";

import * as authActions from "../auth";


import { SessionApi } from "metabase/services";

const mapStateToProps = (state, props) => {
    return {
        token:            props.params.token,
        resetError:       state.auth && state.auth.resetError,
        resetSuccess:     state.auth && state.auth.resetSuccess,
        newUserJoining:   props.location.hash === "#new"
    }
}

const mapDispatchToProps = {
    ...authActions
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PasswordResetApp extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            credentials: {},
            valid: false,
            tokenValid: false
        }
    }

    validateForm() {
        let { credentials } = this.state;

        let valid = true;

        if (!credentials.password || !credentials.password2) {
            valid = false;
        }

        if (this.state.valid !== valid) {
            this.setState({ valid });
        }
    }

    async componentWillMount() {
        try {
            let result = await SessionApi.password_reset_token_valid({token: this.props.token});
            if (result && result.valid) {
                this.setState({tokenValid: true});
            }
        } catch (error) {
            console.log("error validating token", error);
        }
    }

    componentDidMount() {
        this.validateForm();
    }

    componentDidUpdate() {
        this.validateForm();
    }

    onChange(fieldName, fieldValue) {
        this.setState({ credentials: { ...this.state.credentials, [fieldName]: fieldValue }});
    }

    formSubmitted(e) {
        e.preventDefault();

        let { token, passwordReset } = this.props;
        let { credentials } = this.state;

        passwordReset(token, credentials);
    }

    render() {
        const { resetError, resetSuccess, newUserJoining } = this.props;
        const passwordComplexity = MetabaseSettings.passwordComplexity(false);

        if (!this.state.tokenValid) {
            return (
                <div>
                    <div className="full-height bg-white flex flex-column flex-full md-layout-centered">
                        <div className="wrapper">
                            <div className="Login-wrapper Grid  Grid--full md-Grid--1of2">
                                <div className="Grid-cell flex layout-centered text-brand">
                                    <LogoIcon className="Logo my4 sm-my0" width={66} height={85} />
                                </div>
                                <div className="Grid-cell bordered rounded shadowed">
                                    <h3 className="Login-header Form-offset mt4">呃呃呃,链接过期啦.</h3>
                                    <p className="Form-offset mb4 mr4">
                                        安全起见,重置链接一小会儿就会过期. 如果你依然需要重置密码 <Link to="/auth/forgot_password" className="link">重新发送重置邮件</Link>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AuthScene />
                </div>
            );

        } else {
            return (
                <div className="full-height bg-white flex flex-column flex-full md-layout-centered">
                    <div className="Login-wrapper wrapper Grid  Grid--full md-Grid--1of2">
                          <div className="Grid-cell flex layout-centered text-brand">
                              <LogoIcon className="Logo my4 sm-my0" width={66} height={85} />
                          </div>
                          { !resetSuccess ?
                          <div className="Grid-cell">
                              <form className="ForgotForm Login-wrapper bg-white Form-new bordered rounded shadowed" name="form" onSubmit={(e) => this.formSubmitted(e)} noValidate>
                                  <h3 className="Login-header Form-offset">新密码</h3>

                                  <p className="Form-offset text-grey-3 mb4">为保证数据安全,密码应如: {passwordComplexity}</p>

                                  <FormMessage formError={resetError && resetError.data.message ? resetError : null} ></FormMessage>

                                  <FormField key="password" fieldName="password" formError={resetError}>
                                      <FormLabel title={"创建新密码"}  fieldName={"password"} formError={resetError} />
                                      <input className="Form-input Form-offset full" name="password" placeholder="确保如上介绍般安全" type="password" onChange={(e) => this.onChange("password", e.target.value)} autoFocus />
                                      <span className="Form-charm"></span>
                                  </FormField>

                                  <FormField key="password2" fieldName="password2" formError={resetError}>
                                      <FormLabel title={"确认新密码"}  fieldName={"password2"} formError={resetError} />
                                      <input className="Form-input Form-offset full" name="password2" placeholder="确保和新输入的一致" type="password" onChange={(e) => this.onChange("password2", e.target.value)} />
                                      <span className="Form-charm"></span>
                                  </FormField>

                                  <div className="Form-actions">
                                      <button className={cx("Button", {"Button--primary": this.state.valid})} disabled={!this.state.valid}>
                                          保存密码
                                      </button>
                                  </div>
                              </form>
                          </div>
                          :
                          <div className="Grid-cell">
                              <div className="SuccessGroup bg-white bordered rounded shadowed">
                                  <div className="SuccessMark">
                                      <Icon name="check" />
                                  </div>
                                  <p>你的密码已重置.</p>
                                  <p>
                                      { newUserJoining ?
                                      <Link to="/?new" className="Button Button--primary">使用新密码登陆</Link>
                                      :
                                      <Link to="/" className="Button Button--primary">使用新密码登陆</Link>
                                      }
                                  </p>
                              </div>
                          </div>
                          }
                    </div>
                    <AuthScene />
                </div>
            );
        }
    }
}
