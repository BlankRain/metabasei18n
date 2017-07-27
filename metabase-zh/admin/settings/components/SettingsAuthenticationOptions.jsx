import React, { Component } from 'react'
import { Link } from 'react-router'

class SettingsAuthenticationOptions extends Component {
    render () {
        return (
            <ul className="text-measure">
                <li>
                    <div className="bordered rounded shadowed bg-white p4">
                        <h2>Google登陆</h2>
                        <p>允许已有的Metabase用户使用谷歌邮箱的用户名密码登录.</p>
                        <Link className="Button" to="/admin/settings/authentication/google">配置</Link>
                    </div>
                </li>

                <li className="mt2">
                    <div className="bordered rounded shadowed bg-white p4">
                        <h2>LDAP</h2>
                        <p>允许用户使用LDAP认证,并自动映射LDAP组到Metabase组.</p>
                        <Link className="Button" to="/admin/settings/authentication/ldap">配置</Link>
                    </div>
                </li>
            </ul>
        )
    }
}

export default SettingsAuthenticationOptions
