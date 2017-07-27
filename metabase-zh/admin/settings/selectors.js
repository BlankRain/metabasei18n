import _ from "underscore";
import { createSelector } from "reselect";
import MetabaseSettings from "metabase/lib/settings";

import { slugify } from "metabase/lib/formatting";
import CustomGeoJSONWidget from "./components/widgets/CustomGeoJSONWidget.jsx";
import {
    PublicLinksDashboardListing,
    PublicLinksQuestionListing,
    EmbeddedQuestionListing,
    EmbeddedDashboardListing
} from "./components/widgets/PublicLinksListing.jsx";
import SecretKeyWidget from "./components/widgets/SecretKeyWidget.jsx";
import EmbeddingLegalese from "./components/widgets/EmbeddingLegalese";
import LdapGroupMappingsWidget from "./components/widgets/LdapGroupMappingsWidget";

import { UtilApi } from "metabase/services";

const SECTIONS = [
    {
        name: "启动",
        settings: []
    },
    {
        name: "通用",
        settings: [
            {
                key: "site-name",
                display_name: "站点名称",
                type: "string"
            },
            {
                key: "site-url",
                display_name: "站点URL",
                type: "string"
            },
            {
                key: "admin-email",
                display_name: "技术支持邮箱",
                type: "string"
            },
            {
                key: "report-timezone",
                display_name: "上报时区",
                type: "select",
                options: [
                    { name: "默认数据库", value: "" },
                    ...MetabaseSettings.get('timezones')
                ],
                placeholder: "请选择个时区",
                note: "不是所有的数据库都支持时区,所以有些不会生效哦.",
                allowValueCollection: true
            },
            {
                key: "anon-tracking-enabled",
                display_name: "匿名追踪",
                type: "boolean"
            },
            {
                key: "enable-advanced-humanization",
                display_name: "友好的表及字段名",
                type: "boolean"
            }
        ]
    },
    {
        name: "更新",
        settings: [
            {
                key: "check-for-updates",
                display_name: "检查更新",
                type: "boolean"
            }
        ]
    },
    {
        name: "邮箱",
        settings: [
            {
                key: "email-smtp-host",
                display_name: "SMTP 主机",
                placeholder: "smtp.yourservice.com",
                type: "string",
                required: true,
                autoFocus: true
            },
            {
                key: "email-smtp-port",
                display_name: "SMTP 端口",
                placeholder: "587",
                type: "number",
                required: true,
                validations: [["integer", "不是个有效的数字"]]
            },
            {
                key: "email-smtp-security",
                display_name: "SMTP 安全性",
                description: null,
                type: "radio",
                options: { none: "None", ssl: "SSL", tls: "TLS", starttls: "STARTTLS" },
                defaultValue: 'none'
            },
            {
                key: "email-smtp-username",
                display_name: "SMTP 用户名",
                description: null,
                placeholder: "youlooknicetoday",
                type: "string"
            },
            {
                key: "email-smtp-password",
                display_name: "SMTP 密码",
                description: null,
                placeholder: "Shh...",
                type: "password"
            },
            {
                key: "email-from-address",
                display_name: "域名来源",
                placeholder: "metabase@analyticservice.net.com",
                type: "string",
                required: true,
                validations: [["email", "不是一个有效的邮箱"]]
            }
        ]
    },
    {
        name: "Slack",
        settings: [
            {
                key: "slack-token",
                display_name: "Slack API Token",
                description: "",
                placeholder: "输入你的Slack API Token",
                type: "string",
                required: false,
                autoFocus: true
            },
            {
                key: "metabot-enabled",
                display_name: "MetaBot",
                type: "boolean",
                // TODO: why do we have "defaultValue" in addition to "default" in the backend?
                defaultValue: false,
                required: true,
                autoFocus: false
            },
        ]
    },
    {
        name: "SSO单点登陆",
        sidebar: false,
        settings: [
            {
                key: "google-auth-client-id"
            },
            {
                key: "google-auth-auto-create-accounts-domain"
            }
        ]
    },
    {
        name: "认证",
        settings: []
    },
    {
        name: "LDAP",
        sidebar: false,
        settings: [
            {
                key: "ldap-enabled",
                display_name: "LDAP 认证",
                description: null,
                type: "boolean"
            },
            {
                key: "ldap-host",
                display_name: "LDAP 域名",
                placeholder: "ldap.yourdomain.org",
                type: "string",
                required: true,
                autoFocus: true
            },
            {
                key: "ldap-port",
                display_name: "LDAP 端口",
                placeholder: "389",
                type: "string",
                validations: [["integer", "不是一个有效的端口哦"]]
            },
            {
                key: "ldap-security",
                display_name: "LDAP 安全性",
                description: null,
                type: "radio",
                options: { none: "None", ssl: "SSL", starttls: "StartTLS" },
                defaultValue: "none"
            },
            {
                key: "ldap-bind-dn",
                display_name: "用户名 或 DN",
                type: "string"
            },
            {
                key: "ldap-password",
                display_name: "密码",
                type: "password"
            },
            {
                key: "ldap-user-base",
                display_name: "用户搜索基础",
                type: "string",
                required: true
            },
            {
                key: "ldap-user-filter",
                display_name: "用户过滤",
                type: "string",
                validations: [["ldap_filter", "检查你的上级"]]
            },
            {
                key: "ldap-attribute-email",
                display_name: "邮箱属性",
                type: "string"
            },
            {
                key: "ldap-attribute-firstname",
                display_name: "姓属性",
                type: "string"
            },
            {
                key: "ldap-attribute-lastname",
                display_name: "名属性",
                type: "string"
            },
            {
                key: "ldap-group-sync",
                display_name: "同步组成员",
                description: null,
                widget: LdapGroupMappingsWidget
            },
            {
                key: "ldap-group-base",
                display_name: "组搜索基",
                type: "string"
            },
            {
                key: "ldap-group-mappings"
            }
        ]
    },
    {
        name: "地图",
        settings: [
            {
                key: "map-tile-server-url",
                display_name: "地图服务器URL",
                note: "Metabase 默认使用 OpenStreetMaps .",
                type: "string"
            },
            {
                key: "custom-geojson",
                display_name: "自定义地图",
                description: "添加你自己的 GeoJSON 文件 开启不同区域地图可视化",
                widget: CustomGeoJSONWidget,
                noHeader: true
            }
        ]
    },
    {
        name: "公开分享",
        settings: [
            {
                key: "enable-public-sharing",
                display_name: "开启公开分享",
                type: "boolean"
            },
            {
                key: "-public-sharing-dashboards",
                display_name: "分享的Dashboards",
                widget: PublicLinksDashboardListing,
                getHidden: (settings) => !settings["enable-public-sharing"]
            },
            {
                key: "-public-sharing-questions",
                display_name: "分享的Questions",
                widget: PublicLinksQuestionListing,
                getHidden: (settings) => !settings["enable-public-sharing"]
            }
        ]
    },
    {
        name: "集成在其他应用中",
        settings: [
            {
                key: "enable-embedding",
                description: null,
                widget: EmbeddingLegalese,
                getHidden: (settings) => settings["enable-embedding"],
                onChanged: async (oldValue, newValue, settingsValues, onChange) => {
                    if (!oldValue && newValue && !settingsValues["embedding-secret-key"]) {
                        let result = await UtilApi.random_token();
                        await onChange("embedding-secret-key", result.token);
                    }
                }
            },
            {
                key: "enable-embedding",
                display_name: "启动集成 Metabase在其他应用中",
                type: "boolean",
                getHidden: (settings) => !settings["enable-embedding"]
            },
            {
                key: "embedding-secret-key",
                display_name: "集成密钥",
                widget: SecretKeyWidget,
                getHidden: (settings) => !settings["enable-embedding"]
            },
            {
                key: "-embedded-dashboards",
                display_name: "集成的Dashboards",
                widget: EmbeddedDashboardListing,
                getHidden: (settings) => !settings["enable-embedding"]
            },
            {
                key: "-embedded-questions",
                display_name: "集成的提问",
                widget: EmbeddedQuestionListing,
                getHidden: (settings) => !settings["enable-embedding"]
            }
        ]
    },
    {
        name: "数据缓存",
        settings: [
            {
                key: "enable-query-caching",
                display_name: "开启缓存",
                type: "boolean"
            },
            {
                key: "query-caching-min-ttl",
                display_name: "最小查询间隔",
                type: "number",
                getHidden: (settings) => !settings["enable-query-caching"],
                allowValueCollection: true
            },
            {
                key: "query-caching-ttl-ratio",
                display_name: "缓存存活时间",
                type: "number",
                getHidden: (settings) => !settings["enable-query-caching"],
                allowValueCollection: true
            },
            {
                key: "query-caching-max-kb",
                display_name: "最大缓存数",
                type: "number",
                getHidden: (settings) => !settings["enable-query-caching"],
                allowValueCollection: true
            }
        ]
    }
];
for (const section of SECTIONS) {
    section.slug = slugify(section.name);
}

export const getSettings = createSelector(
    state => state.settings.settings,
    state => state.admin.settings.warnings,
    (settings, warnings) =>
        settings.map(setting => warnings[setting.key] ?
            { ...setting, warning: warnings[setting.key] } :
            setting
        )
)

export const getSettingValues = createSelector(
    getSettings,
    (settings) => {
        const settingValues = {};
        for (const setting of settings) {
            settingValues[setting.key] = setting.value;
        }
        return settingValues;
    }
)

export const getNewVersionAvailable = createSelector(
    getSettings,
    (settings) => {
        return MetabaseSettings.newVersionAvailable(settings);
    }
);

export const getSections = createSelector(
    getSettings,
    (settings) => {
        if (!settings || _.isEmpty(settings)) {
            return [];
        }

        let settingsByKey = _.groupBy(settings, 'key');
        return SECTIONS.map(function(section) {
            let sectionSettings = section.settings.map(function(setting) {
                const apiSetting = settingsByKey[setting.key] && settingsByKey[setting.key][0];
                if (apiSetting) {
                    return {
                        placeholder: apiSetting.default,
                        ...apiSetting,
                        ...setting
                    };
                } else {
                    return setting;
                }
            });
            return {
                ...section,
                settings: sectionSettings
            };
        });
    }
);

export const getActiveSectionName = (state, props) => props.params.section

export const getActiveSection = createSelector(
    getActiveSectionName,
    getSections,
    (section = "setup", sections) => {
        if (sections) {
            return _.findWhere(sections, { slug: section });
        } else {
            return null;
        }
    }
);
