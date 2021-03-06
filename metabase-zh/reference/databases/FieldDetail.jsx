/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { push } from "react-router-redux";

import S from "metabase/reference/Reference.css";

import List from "metabase/components/List.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import EditHeader from "metabase/reference/components/EditHeader.jsx";
import EditableReferenceHeader from "metabase/reference/components/EditableReferenceHeader.jsx";
import Detail from "metabase/reference/components/Detail.jsx";
import FieldTypeDetail from "metabase/reference/components/FieldTypeDetail.jsx";
import UsefulQuestions from "metabase/reference/components/UsefulQuestions.jsx";

import {
    getQuestionUrl
} from '../utils';

import {
    getField,
    getTable,
    getDatabase,
    getError,
    getLoading,
    getUser,
    getIsEditing,
    getIsFormulaExpanded,
    getForeignKeys
} from "../selectors";

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';


const interestingQuestions = (database, table, field) => {
    return [
        {
            text: `个数 ${table.display_name} 按 ${field.display_name} 分组`,
            icon: { name: "bar", scale: 1, viewBox: "8 8 16 16" },
            link: getQuestionUrl({
                dbId: database.id,
                tableId: table.id,
                fieldId: field.id,
                getCount: true,
                visualization: 'bar'
            })
        },
        {
            text: `个数 ${table.display_name} 按 ${field.display_name} 分组`,
            icon: { name: "pie", scale: 1, viewBox: "8 8 16 16" },
            link: getQuestionUrl({
                dbId: database.id,
                tableId: table.id,
                fieldId: field.id,
                getCount: true,
                visualization: 'pie'
            })
        },
        {
            text: `所有去重后的值 ${field.display_name}`,
            icon: "table2",
            link: getQuestionUrl({
                dbId: database.id,
                tableId: table.id,
                fieldId: field.id
            })
        }
    ]
}

const mapStateToProps = (state, props) => {
    const entity = getField(state, props) || {};

    return {
        entity,
        field: entity,
        table: getTable(state, props),
        database: getDatabase(state, props),
        loading: getLoading(state, props),
        // naming this 'error' will conflict with redux form
        loadingError: getError(state, props),
        user: getUser(state, props),
        foreignKeys: getForeignKeys(state, props),
        isEditing: getIsEditing(state, props),
        isFormulaExpanded: getIsFormulaExpanded(state, props),
    }
};

const mapDispatchToProps = {
    ...metadataActions,
    ...actions,
    onChangeLocation: push
};

const validate = (values, props) => {
    return {};
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
    form: 'details',
    fields: ['name', 'display_name', 'description', 'revision_message', 'points_of_interest', 'caveats', 'special_type', 'fk_target_field_id'],
    validate
})
export default class FieldDetail extends Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        entity: PropTypes.object.isRequired,
        field:  PropTypes.object.isRequired,
        table: PropTypes.object,
        user: PropTypes.object.isRequired,
        database: PropTypes.object.isRequired,
        foreignKeys: PropTypes.object,
        isEditing: PropTypes.bool,
        startEditing: PropTypes.func.isRequired,
        endEditing: PropTypes.func.isRequired,
        startLoading: PropTypes.func.isRequired,
        endLoading: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
        updateField: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        loading: PropTypes.bool,
        loadingError: PropTypes.object,
        submitting: PropTypes.bool,
    };

    render() {
        const {
            fields: { name, display_name, description, revision_message, points_of_interest, caveats, special_type, fk_target_field_id },
            style,
            entity,
            table,
            loadingError,
            loading,
            user,
            foreignKeys,
            isEditing,
            startEditing,
            endEditing,
            handleSubmit,
            resetForm,
            submitting,
        } = this.props;

        const onSubmit = handleSubmit(async (fields) =>
            await actions.rUpdateFieldDetail(fields, this.props)
        );

        return (
            <form style={style} className="full"
                onSubmit={onSubmit}
            >
                { isEditing &&
                    <EditHeader
                        hasRevisionHistory={false}
                        onSubmit={onSubmit}
                        endEditing={endEditing}
                        reinitializeForm={resetForm}
                        submitting={submitting}
                        revisionMessageFormField={revision_message}
                    />
                }
                <EditableReferenceHeader
                    entity={entity}
                    table={table}
                    type="field"
                    headerIcon="field"
                    name="详情"
                    user={user}
                    isEditing={isEditing}
                    hasSingleSchema={false}
                    hasDisplayName={true}
                    startEditing={startEditing}
                    displayNameFormField={display_name}
                    nameFormField={name}
                />
                <LoadingAndErrorWrapper loading={!loadingError && loading} error={loadingError}>
                { () =>
                    <div className="wrapper wrapper--trim">
                        <List>
                            <li className="relative">
                                <Detail
                                    id="description"
                                    name="描述"
                                    description={entity.description}
                                    placeholder="暂无描述"
                                    isEditing={isEditing}
                                    field={description}
                                />
                            </li>
                            { !isEditing &&
                                <li className="relative">
                                    <Detail
                                        id="name"
                                        name="数据库的真实名称"
                                        description={entity.name}
                                        subtitleClass={S.tableActualName}
                                    />
                                </li>
                            }
                            <li className="relative">
                                <Detail
                                    id="points_of_interest"
                                    name={`这个字段为啥有趣?`}
                                    description={entity.points_of_interest}
                                    placeholder="一个有趣的都没有."
                                    isEditing={isEditing}
                                    field={points_of_interest}
                                    />
                            </li>
                            <li className="relative">
                                <Detail
                                    id="caveats"
                                    name={`关于这个字段应该了解的`}
                                    description={entity.caveats}
                                    placeholder="什么也不需要知道"
                                    isEditing={isEditing}
                                    field={caveats}
                                />
                            </li>


                            { !isEditing && 
                                <li className="relative">
                                    <Detail
                                        id="base_type"
                                        name={`数据类型`}
                                        description={entity.base_type}
                                    />
                                </li>
                            }
                                <li className="relative">
                                    <FieldTypeDetail
                                        field={entity}
                                        foreignKeys={foreignKeys}
                                        fieldTypeFormField={special_type}
                                        foreignKeyFormField={fk_target_field_id}
                                        isEditing={isEditing}
                                    />
                                </li>
                            { !isEditing &&
                                <li className="relative">
                                    <UsefulQuestions questions={interestingQuestions(this.props.database, this.props.table, this.props.field)} />
                                </li>
                            }


                        </List>
                    </div>
                }
                </LoadingAndErrorWrapper>
            </form>
        )
    }
}
