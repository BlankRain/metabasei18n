/* @flow */

import React, { Component } from "react";

import RetinaImage from "react-retina-image";
import Icon from "metabase/components/Icon";
import Toggle from "metabase/components/Toggle";
import CopyWidget from "metabase/components/CopyWidget";
import Confirm from "metabase/components/Confirm";

import { getPublicEmbedHTML } from "metabase/public/lib/code";

import cx from "classnames";

import type { EmbedType } from "./EmbedModalContent";
import type { EmbeddableResource } from "metabase/public/lib/types";

import MetabaseAnalytics from "metabase/lib/analytics";

type Props = {
    resourceType: string,
    resource: EmbeddableResource,
    extensions?: string[],

    isAdmin: bool,

    isPublicSharingEnabled: bool,
    isApplicationEmbeddingEnabled: bool,

    onCreatePublicLink: () => Promise<void>,
    onDisablePublicLink: () => Promise<void>,
    getPublicUrl: (resource: EmbeddableResource, extension: ?string) => string,
    onChangeEmbedType: (embedType: EmbedType) => void,
};

type State = {
    extension: ?string,
};

export default class SharingPane extends Component {
    props: Props;
    state: State = {
        extension: null
    };

    static defaultProps = {
        extensions: []
    };

    render() {
        const {
            resource, resourceType,
            onCreatePublicLink, onDisablePublicLink,
            extensions,
            getPublicUrl,
            onChangeEmbedType,
            isAdmin,
            isPublicSharingEnabled,
            isApplicationEmbeddingEnabled
        } = this.props;

        const publicLink = getPublicUrl(resource, this.state.extension);
        const iframeSource = getPublicEmbedHTML(getPublicUrl(resource));

        return (
            <div className="pt2 ml-auto mr-auto" style={{ maxWidth: 600 }}>
                { isAdmin && isPublicSharingEnabled &&
                    <div className="pb2 mb4 border-bottom flex align-center">
                        <h4>启动共享</h4>
                        <div className="ml-auto">
                            { resource.public_uuid ?
                                <Confirm
                                    title="关闭这个公开链接?"
                                    content="这个会使现有链接停止工作. 你可以重新启用它,但会是另一个新链接."
                                    action={() => {
                                        MetabaseAnalytics.trackEvent("Sharing Modal", "Public Link Disabled", resourceType);
                                        onDisablePublicLink();
                                    }}
                                >
                                    <Toggle value={true} />
                                </Confirm>
                            :
                                <Toggle value={false} onChange={() => {
                                    MetabaseAnalytics.trackEvent("Sharing Modal", "Public Link Enabled", resourceType);
                                    onCreatePublicLink();
                                }}/>
                            }
                        </div>
                    </div>
                }
                <div className={cx("mb4 flex align-center", { disabled: !resource.public_uuid })}>
                    <div style={{ width: 98, height: 63 }} className="bordered rounded shadowed flex layout-centered">
                        <Icon name="link" size={32} />
                    </div>
                    <div className="ml2 flex-full">
                        <h3 className="text-brand mb1">公开 链接</h3>
                        <div className="mb1">共享这个 {resourceType} 到没有metabase的账户,请使用如下URL:</div>
                        <CopyWidget value={publicLink} />
                        { extensions && extensions.length > 0 &&
                            <div className="mt1">
                                {extensions.map(extension =>
                                    <span
                                        className={cx("cursor-pointer text-brand-hover text-bold text-uppercase",
                                            extension === this.state.extension ? "text-brand" : "text-grey-2"
                                        )}
                                        onClick={() => this.setState({ extension: extension === this.state.extension ? null : extension })}
                                    >
                                        {extension}{" "}
                                    </span>
                                )}
                            </div>
                        }
                    </div>
                </div>
                <div className={cx("mb4 flex align-center", { disabled: !resource.public_uuid })}>
                    <RetinaImage
                        width={98}
                        src="app/assets/img/simple_embed.png"
                        forceOriginalDimensions={false}
                    />
                    <div className="ml2 flex-full">
                        <h3 className="text-green mb1">公开 集成</h3>
                        <div className="mb1">要集成这个{resourceType} 在博客或网站中,通过复制粘贴下面代码就可以啦:</div>
                        <CopyWidget value={iframeSource} />
                    </div>
                </div>
                { isAdmin &&
                    <div
                        className={cx("mb4 flex align-center cursor-pointer", { disabled: !isApplicationEmbeddingEnabled })}
                        onClick={() => onChangeEmbedType("application")}
                    >
                        <RetinaImage
                            width={100}
                            src="app/assets/img/secure_embed.png"
                            forceOriginalDimensions={false}
                        />
                        <div className="ml2 flex-full">
                            <h3 className="text-purple mb1">集成这个 {resourceType} 在应用中</h3>
                            <div className="">通过插入服务端代码, 你可以针对特定组或者用户提供一个安全态的 {resourceType}.</div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
