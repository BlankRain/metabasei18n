import React, { Component } from "react";
import { Link } from "react-router";

import FormLabel from "../components/FormLabel.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextArea from "../components/FormTextArea.jsx";
import FieldSet from "metabase/components/FieldSet.jsx";
import PartialQueryBuilder from "../components/PartialQueryBuilder.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import { formatValue } from "metabase/lib/formatting";

import { metricFormSelectors } from "../selectors";
import { reduxForm } from "redux-form";

import Query from "metabase/lib/query";

import cx from "classnames";
import Metadata from "metabase-lib/lib/metadata/Metadata";
import Table from "metabase-lib/lib/metadata/Table";

@reduxForm({
    form: "metric",
    fields: ["id", "name", "description", "table_id", "definition", "revision_message", "show_in_getting_started"],
    validate: (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "名称是必须的";
        }
        if (!values.description) {
            errors.description = "描述是必须的";
        }
        if (values.id != null) {
            if (!values.revision_message) {
                errors.revision_message = "修订消息是必须的";
            }
        }
        let aggregations = values.definition && Query.getAggregations(values.definition);
        if (!aggregations || aggregations.length === 0) {
            errors.definition = "Aggregation是必须的";
        }
        return errors;
    }
},
(state, props) => metricFormSelectors(state, props))
export default class MetricForm extends Component {
    updatePreviewSummary(datasetQuery) {
        this.props.updatePreviewSummary({
            ...datasetQuery,
            query: {
                aggregation: ["count"],
                ...datasetQuery.query,
            }
        })
    }

    renderActionButtons() {
        const { invalid, handleSubmit, tableMetadata } = this.props;
        return (
            <div>
                <button className={cx("Button", { "Button--primary": !invalid, "disabled": invalid })} onClick={handleSubmit}>Save changes</button>
                <Link to={"/admin/datamodel/database/" + tableMetadata.db_id + "/table/" + tableMetadata.id} className="Button Button--borderless mx1">Cancel</Link>
            </div>
        )
    }


    render() {
        const { fields: { id, name, description, definition, revision_message }, metric, metadata, tableMetadata, handleSubmit, previewSummary } = this.props;

        return (
            <LoadingAndErrorWrapper loading={!tableMetadata}>
            { () =>
                <form className="full" onSubmit={handleSubmit}>
                    <div className="wrapper py4">
                        <FormLabel
                            title={(metric && metric.id != null ? "编辑" : "创建") + " 您的 Metric"}
                            description={metric && metric.id != null ?
                                "修改你的metric,并请留下一个说明性的文字记录." :
                                "你可以创建并保存metrics,这样就可以给这张表添加一个已知的metric项. 保存后的metrics 包括 aggregation类型, aggregated字段, 或者任何过滤条件. 比如说,你可以把它作为一种正式计算订单平均价格的方法."
                            }
                        >
                        <PartialQueryBuilder
                            features={{
                                filter: true,
                                aggregation: true
                            }}
                            metadata={
                                metadata && tableMetadata && metadata.tables && metadata.tables[tableMetadata.id].fields && Object.assign(new Metadata(), metadata, {
                                    tables: {
                                        ...metadata.tables,
                                        [tableMetadata.id]: Object.assign(new Table(), metadata.tables[tableMetadata.id], {
                                            aggregation_options: tableMetadata.aggregation_options.filter(a => a.short !== "rows"),
                                            metrics: []
                                        })
                                    }
                                })
                            }
                            tableMetadata={tableMetadata}
                            previewSummary={previewSummary == null ? "" : "结果: " + formatValue(previewSummary)}
                            updatePreviewSummary={this.updatePreviewSummary.bind(this)}
                            {...definition}
                        />
                        </FormLabel>
                        <div style={{ maxWidth: "575px" }}>
                            <FormLabel
                                title="给你的Metric起个名字"
                                description="好的metric名字可以让别人更容易找到它."
                            >
                                <FormInput
                                    field={name}
                                    placeholder="简短的描述一下"
                                />
                            </FormLabel>
                            <FormLabel
                                title="描述你的 Metric"
                                description="给你的Metric添加个描述,这样好让大家懂它是做什么的."
                            >
                                <FormTextArea
                                    field={description}
                                    placeholder="这里是个好地方,去更具体的解释那些不是很明显的metric规则"
                                />
                            </FormLabel>
                            { id.value != null &&
                                <FieldSet legend="Reason For Changes">
                                    <FormLabel description="简要说明一下你做了什么改变以及改变的原因.">
                                        <FormTextArea
                                            field={revision_message}
                                            placeholder="这个将会在修订记录里展示,这样大家就可以知道为什么做这样的改变"
                                        />
                                    </FormLabel>
                                    <div className="flex align-center">
                                        {this.renderActionButtons()}
                                    </div>
                                </FieldSet>
                            }
                        </div>
                    </div>

                    { id.value == null &&
                        <div className="border-top py4">
                            <div className="wrapper">
                                {this.renderActionButtons()}
                            </div>
                        </div>
                    }
                </form>
            }
            </LoadingAndErrorWrapper>
        );
    }
}
