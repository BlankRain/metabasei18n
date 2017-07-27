/* @flow */

import React, { Component } from "react";

import ExternalLink from "metabase/components/ExternalLink";
import CodeSample from "./CodeSample";

import { getPublicEmbedOptions, getSignedEmbedOptions, getSignTokenOptions } from "../../lib/code"

import "metabase/lib/ace/theme-metabase";

import "ace/mode-clojure";
import "ace/mode-javascript";
import "ace/mode-ruby";
import "ace/mode-html";
import "ace/mode-jsx";

import type { EmbedType, DisplayOptions } from "./EmbedModalContent";
import type { EmbeddableResource, EmbeddingParams } from "metabase/public/lib/types";

type Props = {
    className: string,
    embedType: EmbedType,
    iframeUrl: string,
    token: string,
    siteUrl: string,
    secretKey: string,
    resource: EmbeddableResource,
    resourceType: string,
    params: EmbeddingParams,
    displayOptions: DisplayOptions
}

export default class EmbedCodePane extends Component {
    props: Props;

    _embedSample: ?CodeSample;

    render() {
        const { className, embedType, iframeUrl, siteUrl, secretKey, resource, resourceType, params, displayOptions } = this.props;
        return (
            <div className={className}>
                { embedType === "application" ?
                    <div key="application">
                    <p>To embed this {resourceType} in your application:</p>
                        <CodeSample
                            title="在服务端插入代码段,以生成集成URL "
                            options={getSignTokenOptions({ siteUrl, secretKey, resourceType, resourceId: resource.id, params, displayOptions })}
                            onChangeOption={(option) => {
                                if (option && option.embedOption && this._embedSample && this._embedSample.setOption) {
                                    this._embedSample.setOption(option.embedOption);
                                }
                            }}
                        />
                        <CodeSample
                            className="mt2"
                            ref={embedSample => this._embedSample = embedSample}
                            title="把代码段插入到你的HTML模板文件或单页系统中."
                            options={getSignedEmbedOptions({ iframeUrl })}
                        />
                    </div>
                :
                    <div key="public">
                        <CodeSample
                            title="集成代码段,为你的前端项目或网页项目"
                            options={getPublicEmbedOptions({ iframeUrl })}
                        />
                    </div>
                }

                <div className="text-centered my2">
                    <h4>更多<ExternalLink href="https://github.com/metabase/embedding_reference_apps">示例在 GitHub</ExternalLink></h4>
                </div>
            </div>
        );
    }
}
