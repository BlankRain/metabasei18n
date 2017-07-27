/* @flow */

import React from "react";

import Icon from "metabase/components/Icon";
import Button from "metabase/components/Button";
import Parameters from "metabase/parameters/components/Parameters";
import Select, { Option } from "metabase/components/Select";

import DisplayOptionsPane from "./DisplayOptionsPane";

import cx from "classnames";

const getIconForParameter = (parameter) =>
    parameter.type === "category" ? "string" :
    parameter.type.indexOf("date/") === 0 ? "calendar" :
    "unknown";

import type { EmbedType, DisplayOptions } from "./EmbedModalContent";
import type { EmbeddableResource, EmbeddingParams } from "metabase/public/lib/types";
import type { Parameter, ParameterId } from "metabase/meta/types/Parameter";

type Props = {
    className?: string,

    embedType: EmbedType,

    resourceType: string,
    resource: EmbeddableResource,
    resourceParameters:  Parameter[],

    embeddingParams: EmbeddingParams,
    onChangeEmbeddingParameters: (EmbeddingParams) => void,

    displayOptions: DisplayOptions,
    previewParameters: Parameter[],
    parameterValues: { [id: ParameterId]: any },

    onChangeDisplayOptions: (DisplayOptions) => void,
    onChangeParameterValue: (id: ParameterId, value: any) => void,
    onUnpublish: () => Promise<void>
};

const AdvancedSettingsPane = ({
    className,
    embedType,
    resource,
    resourceType, resourceParameters,
    embeddingParams, onChangeEmbeddingParameters,
    displayOptions, onChangeDisplayOptions,
    onUnpublish,
    pane, onChangePane,
    previewParameters, parameterValues, onChangeParameterValue,
}: Props) =>
    <div className={cx(className, "p4 full-height flex flex-column bg-slate-extra-light")} style={{ width: 400 }}>
        <Section title="Style">
            <DisplayOptionsPane
                className="pt1"
                displayOptions={displayOptions}
                onChangeDisplayOptions={onChangeDisplayOptions}
            />
        </Section>
        { embedType === "application" &&
            <Section title="Parameters">
                { resourceParameters.length > 0 ?
                    <p>用户可以使用哪些参数呢?</p>
                :
                    <p>这个 {resourceType} 没有需要配置的参数.</p>
                }
                {resourceParameters.map(parameter =>
                    <div className="flex align-center my1">
                        <Icon name={getIconForParameter(parameter)} className="mr2" style={{ color: "#DFE8EA" }} />
                        <h3>{parameter.name}</h3>
                        <Select
                            className="ml-auto bg-white"
                            value={embeddingParams[parameter.slug] || "disabled"}
                            onChange={(e) => onChangeEmbeddingParameters({ ...embeddingParams, [parameter.slug] : e.target.value })}
                        >
                            <Option icon="close" value="disabled">不可用</Option>
                            <Option icon="pencil" value="enabled">可编辑</Option>
                            <Option icon="lock" value="locked">锁定</Option>
                        </Select>
                    </div>
                )}
            </Section>
        }
        { embedType === "application" && previewParameters.length > 0 &&
            <Section title="Preview Locked Parameters">
                <p>试着给你锁定的参数传值. 你的服务器会在使用的时候给你传递真正的值.</p>
                <Parameters
                    className="mt2"
                    vertical
                    parameters={previewParameters}
                    parameterValues={parameterValues}
                    setParameterValue={onChangeParameterValue}
                />
            </Section>
        }
        { resource.enable_embedding ?
            <Section title="Danger zone">
                <p>这个将会不启用参数 {resourceType}.</p>
                <Button medium warning onClick={onUnpublish}>取消发布</Button>
            </Section>
        : null }
    </div>

const Section = ({ className, title, children }) =>
    <div className={cx(className, "mb3 pb4 border-row-divider border-med")}>
        <h3>{title}</h3>
        {children}
    </div>

export default AdvancedSettingsPane;
