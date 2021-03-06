/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import visualizations from "metabase/visualizations";
import { isQueryable } from "metabase/lib/table";
import * as Urls from "metabase/lib/urls";

import S from "metabase/components/List.css";

import List from "metabase/components/List.jsx";
import ListItem from "metabase/components/ListItem.jsx";
import AdminAwareEmptyState from "metabase/components/AdminAwareEmptyState.jsx";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import ReferenceHeader from "../components/ReferenceHeader.jsx";

import {
    getQuestionUrl
} from '../utils';


import {
    getTableQuestions,
    getError,
    getLoading,
    getTable
} from "../selectors";

import * as metadataActions from "metabase/redux/metadata";

const emptyStateData = (table) =>  {
    return {
        message: "关于这张表的提问,在添加后都会显示",
        icon: "all",
        action: "Ask a question",
        link: getQuestionUrl({
            dbId: table.db_id,
            tableId: table.id,
        })
    }
}


const mapStateToProps = (state, props) => ({
    table: getTable(state, props),
    entities: getTableQuestions(state, props),
    loading: getLoading(state, props),
    loadingError: getError(state, props)
});

const mapDispatchToProps = {
    ...metadataActions
};


@connect(mapStateToProps, mapDispatchToProps)
export default class TableQuestions extends Component {
    static propTypes = {
        table: PropTypes.object.isRequired,
        style: PropTypes.object.isRequired,
        entities: PropTypes.object.isRequired,
        loading: PropTypes.bool,
        loadingError: PropTypes.object
    };

    render() {
        const {
            entities,
            style,
            loadingError,
            loading
        } = this.props;

        return (
            <div style={style} className="full">
                <ReferenceHeader 
                    name={`有关 ${this.props.table.display_name}的提问`}
                    type="questions"
                    headerIcon="table2"
                />
                <LoadingAndErrorWrapper loading={!loadingError && loading} error={loadingError}>
                { () => Object.keys(entities).length > 0 ?
                    <div className="wrapper wrapper--trim">
                        <List>
                            { 
                                Object.values(entities).filter(isQueryable).map((entity, index) =>
                                    entity && entity.id && entity.name &&
                                            <li className="relative" key={entity.id}>
                                                <ListItem
                                                    id={entity.id}
                                                    index={index}
                                                    name={entity.display_name || entity.name}
                                                    description={ `创建于 ${moment(entity.created_at).fromNow()} 由 ${entity.creator.common_name}` }
                                                    url={ Urls.question(entity.id) }
                                                    icon={ visualizations.get(entity.display).iconName }
                                                />
                                            </li>
                                )
                            }
                        </List>
                    </div>
                    :
                    <div className={S.empty}>
                        <AdminAwareEmptyState {...emptyStateData(this.props.table)}/>
                    </div>
                }
                </LoadingAndErrorWrapper>
            </div>
        )
    }
}
