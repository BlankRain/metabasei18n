import React from "react";

import AuthScene from "./AuthScene.jsx";
import LogoIcon from "metabase/components/LogoIcon.jsx";
import BackToLogin from "./BackToLogin.jsx"

const GoogleNoAccount = () =>
    <div className="full-height bg-white flex flex-column flex-full md-layout-centered">
        <div className="wrapper">
            <div className="Login-wrapper Grid  Grid--full md-Grid--1of2">
                <div className="Grid-cell flex layout-centered text-brand">
                    <LogoIcon className="Logo my4 sm-my0" width={66} height={85} />
                </div>
                <div className="Grid-cell text-centered bordered rounded shadowed p4">
                    <h3 className="mt4 mb2">这个Google 帐号没有对应的Metabase帐号.</h3>
                    <p className="mb4 ml-auto mr-auto" style={{maxWidth: 360}}>
                        你需要管理员先给你创建个Metabase用户,在你使用谷歌登录之前.
                    </p>

                    <BackToLogin />
                </div>
            </div>
        </div>
        <AuthScene />
    </div>

export default GoogleNoAccount;
