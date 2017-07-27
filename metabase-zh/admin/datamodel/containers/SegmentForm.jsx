import React, { Component } from "react";
import { Link } from "react-router";

import FormLabel from "../components/FormLabel.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextArea from "../components/FormTextArea.jsx";
import FieldSet from "metabase/components/FieldSet.jsx";
import PartialQueryBuilder from "../components/PartialQueryBuilder.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import { formatValue } from "metabase/lib/formatting";

import { segmentFormSelectors } from "../selectors";
import { reduxForm } from "redux-form";

import cx from "classnames";
import Metadata from "metabase-lib/lib/metadata/Metadata";
import Table from "metabase-lib/lib/metadata/Table";

@reduxForm({
    form: "segment",
    fields: ["id", "name", "description", "table_id", "definition", "revision_message"],
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
        if (!values.definition || !values.definition.filter || values.definition.filter.length < 1) {
            errors.definition = "至少得有一个过滤条件";
        }
        return errors;
    },
    initialValues: { name: "", description: "", table_id: null, definition: { filter: [] }, revision_message: null }
},
(state, props) => segmentFormSelectors(state, props))
export default class SegmentForm extends Component {
    updatePreviewSummary(datasetQuery) {
        this.props.updatePreviewSummary({
            ...datasetQuery,
            query: {
                ...datasetQuery.query,
                aggregation: ["count"]
            }
        })
    }

    renderActionButtons() {
        const { invalid, handleSubmit, tableMetadata } = this.props;
        return (
            <div>
                <button className={cx("Button", { "Button--primary": !invalid, "disabled": invalid })} onClick={handleSubmit}>Save changes</button>
                <Link to={"/admin/datamodel/database/" + tableMetadata.db_id + "/table/" + tableMetadata.id} className="Button Button--borderless mx1">取消</Link>
            </div>
        )
    }

    render() {
        const { fields: { id, name, description, definition, revision_message }, segment, metadata, tableMetadata, handleSubmit, previewSummary } = this.props;

        return (
            <LoadingAndErrorWrapper loading={!tableMetadata}>
            { () =>
                <form className="full" onSubmit={handleSubmit}>
                    <div className="wrapper py4">
                        <FormLabel
                            title={(segment && segment.id != null ? "编辑" : "创建") + " 你的Segment"}
                            description={segment && segment.id != null ?
                                "编辑你的segment,并请留下解释性的文字记录." :
                                "选择并添加过滤器,就可以创建新的segment给你的 " + tableMetadata.display_name + " 表"
                            }
                        >
                            <PartialQueryBuilder
                                features={{
                                    filter: true
                                }}
                                metadata={
                                    metadata && tableMetadata && metadata.tables && metadata.tables[tableMetadata.id].fields && Object.assign(new Metadata(), metadata, {
                                        tables: {
                                            ...metadata.tables,
                                            [tableMetadata.id]: Object.assign(new Table(), metadata.tables[tableMetadata.id], {
                                                segments: []
                                            })
                                        }
                                    })
                                }
                                tableMetadata={tableMetadata}
                                previewSummary={previewSummary == null ? "" : formatValue(previewSummary) + " rows"}
                                updatePreviewSummary={this.updatePreviewSummary.bind(this)}
                                {...definition}
                            />
                        </FormLabel>
                        <div style={{ maxWidth: "575px" }}>
                            <FormLabel
                                title="给你的Segment起个名字吧"
                                description="好的segment名称会让别人更好的发现它."
                            >
                                <FormInput
                                    field={name}
                                    placeholder="简要描述一下"
                                />
                            </FormLabel>
                            <FormLabel
                                title="描述你的Segment"
                                description="解释一下你的Segment，这样可以让别人更懂它."
                            >
                                <FormTextArea
                                    field={description}
                                    placeholder="对于不是很明显的segment规则,这里是更具体的解释它的好地方."
                                />
                            </FormLabel>
                            { id.value != null &&
                                <FieldSet legend="修改的原因">
                                    <FormLabel description="简要记录一下你修改了什么以及修改的原因.">
                                        <FormTextArea
                                            field={revision_message}
                                            placeholder="这个会在修订记录里展示出来,这样大家就知道为什么修订了"
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
