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
import UsefulQuestions from "metabase/reference/components/UsefulQuestions.jsx";

import {
    getQuestionUrl
} from '../utils';

import {
    getTable,
    getFields,
    getError,
    getLoading,
    getUser,
    getIsEditing,
    getHasSingleSchema,
    getIsFormulaExpanded,
    getForeignKeys
} from "../selectors";

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';


const interestingQuestions = (table) => {
    return [
        {
            text: ` ${table.display_name} 的个数`,
            icon: { name: "number", scale: 1, viewBox: "8 8 16 16" },
            link: getQuestionUrl({
                dbId: table.db_id,
                tableId: table.id,
                getCount: true
            })
        },
        {
            text: `查看 ${table.display_name}的原始数据`,
            icon: "table2",
            link: getQuestionUrl({
                dbId: table.db_id,
                tableId: table.id,
            })
        }
    ]
}
const mapStateToProps = (state, props) => {
    const entity = getTable(state, props) || {};
    const fields = getFields(state, props);

    return {
        entity,
        table: getTable(state, props),
        metadataFields: fields,
        loading: getLoading(state, props),
        // naming this 'error' will conflict with redux form
        loadingError: getError(state, props),
        user: getUser(state, props),
        foreignKeys: getForeignKeys(state, props),
        isEditing: getIsEditing(state, props),
        hasSingleSchema: getHasSingleSchema(state, props),
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
    fields: ['name', 'display_name', 'description', 'revision_message', 'points_of_interest', 'caveats'],
    validate
})
export default class TableDetail extends Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        entity: PropTypes.object.isRequired,
        table: PropTypes.object,
        user: PropTypes.object.isRequired,
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
        hasSingleSchema: PropTypes.bool,
        loading: PropTypes.bool,
        loadingError: PropTypes.object,
        submitting: PropTypes.bool,
    };

    render() {
        const {
            fields: { name, display_name, description, revision_message, points_of_interest, caveats },
            style,
            entity,
            table,
            loadingError,
            loading,
            user,
            isEditing,
            startEditing,
            endEditing,
            hasSingleSchema,
            handleSubmit,
            resetForm,
            submitting,
        } = this.props;

        const onSubmit = handleSubmit(async (fields) =>
            await actions.rUpdateTableDetail(fields, this.props)
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
                    type="table"
                    headerIcon="table2"
                    headerLink={getQuestionUrl({ dbId: entity.db_id, tableId: entity.id})}
                    name="详情"
                    user={user}
                    isEditing={isEditing}
                    hasSingleSchema={hasSingleSchema}
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
                                        name="在数据库里的实际名"
                                        description={entity.name}
                                        subtitleClass={S.tableActualName}
                                    />
                                </li>
                            }
                            <li className="relative">
                                <Detail
                                    id="points_of_interest"
                                    name={`这张表为啥有趣?`}
                                    description={entity.points_of_interest}
                                    placeholder="一个有趣的都没有."
                                    isEditing={isEditing}
                                    field={points_of_interest}
                                    />
                            </li>
                            <li className="relative">
                                <Detail
                                    id="caveats"
                                    name={`这张表你应该了解的事`}
                                    description={entity.caveats}
                                    placeholder="什么也不需要知道"
                                    isEditing={isEditing}
                                    field={caveats}
                                />
                            </li>
                            { !isEditing &&
                                <li className="relative">
                                    <UsefulQuestions questions={interestingQuestions(this.props.table)} />
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
