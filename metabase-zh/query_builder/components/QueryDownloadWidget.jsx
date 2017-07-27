import React from "react";
import PropTypes from "prop-types";

import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import Icon from "metabase/components/Icon.jsx";
import DownloadButton from "metabase/components/DownloadButton.jsx";
import Tooltip from "metabase/components/Tooltip.jsx";

import FieldSet from "metabase/components/FieldSet.jsx";

import * as Urls from "metabase/lib/urls";

import _ from "underscore";
import cx from "classnames";

const EXPORT_FORMATS = ["csv", "xlsx", "json"];

const QueryDownloadWidget = ({ className, card, result, uuid, token }) =>
    <PopoverWithTrigger
        triggerElement={
            <Tooltip tooltip="下载">
                <Icon title="下载这个数据" name="downarrow" size={16} />
            </Tooltip>
        }
        triggerClasses={cx(className, "text-brand-hover")}
    >
        <div className="p2" style={{ maxWidth: 320 }}>
            <h4>下载</h4>
            { result.data.rows_truncated != null &&
                <FieldSet className="my2 text-gold border-gold" legend="Warning">
                    <div className="my1">你的答案数据量太大,可能得稍等一会儿才能下载下来.</div>
                    <div>最大的下载行数是1 million行.</div>
                </FieldSet>
            }
            <div className="flex flex-row mt2">
                {EXPORT_FORMATS.map(type =>
                    uuid ?
                        <PublicQueryButton key={type} type={type} uuid={uuid} className="mr1 text-uppercase text-default" />
                    : token ?
                        <EmbedQueryButton key={type} type={type} token={token} className="mr1 text-uppercase text-default" />
                    : card && card.id ?
                        <SavedQueryButton key={type} type={type} card={card} result={result} className="mr1 text-uppercase text-default" />
                    : card && !card.id ?
                        <UnsavedQueryButton key={type} type={type} card={card} result={result} className="mr1 text-uppercase text-default" />
                    :
                      null
                )}
            </div>
        </div>
    </PopoverWithTrigger>

const UnsavedQueryButton = ({ className, type, result: { json_query }, card }) =>
    <DownloadButton
        className={className}
        url={`api/dataset/${type}`}
        params={{ query: JSON.stringify(_.omit(json_query, "constraints")) }}
        extensions={[type]}
    >
        {type}
    </DownloadButton>

const SavedQueryButton = ({ className, type, result: { json_query }, card }) =>
    <DownloadButton
        className={className}
        url={`api/card/${card.id}/query/${type}`}
        params={{ parameters: JSON.stringify(json_query.parameters) }}
        extensions={[type]}
    >
        {type}
    </DownloadButton>

const PublicQueryButton = ({ className, type, uuid }) =>
    <DownloadButton
        className={className}
        method="GET"
        url={Urls.publicCard(uuid, type)}
        extensions={[type]}
    >
        {type}
    </DownloadButton>

const EmbedQueryButton = ({ className, type, token }) =>
    <DownloadButton
        className={className}
        method="GET"
        url={Urls.embedCard(token, type)}
        extensions={[type]}
    >
        {type}
    </DownloadButton>

QueryDownloadWidget.propTypes = {
    className: PropTypes.string,
    card: PropTypes.object,
    result: PropTypes.object,
    uuid: PropTypes.string
};

export default QueryDownloadWidget;
