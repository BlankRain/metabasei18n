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
    getMetricQuestions,
    getError,
    getLoading,
    getTable,
    getMetric
} from "../selectors";

import * as metadataActions from "metabase/redux/metadata";

const emptyStateData = (table, metric) => {
    return {
        message: "有关这个 metric的提问,添加后就会在此显示",
        icon: "all",
        action: "Ask a question",
        link: getQuestionUrl({
            dbId: table && table.db_id,
            tableId: metric.table_id,
            metricId: metric.id
        })
    };
    }


const mapStateToProps = (state, props) => ({
    metric: getMetric(state, props),
    table: getTable(state, props),
    entities: getMetricQuestions(state, props),
    loading: getLoading(state, props),
    loadingError: getError(state, props)
});

const mapDispatchToProps = {
    ...metadataActions
};


@connect(mapStateToProps, mapDispatchToProps)
export default class MetricQuestions extends Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        entities: PropTypes.object.isRequired,
        loading: PropTypes.bool,
        loadingError: PropTypes.object,
        metric: PropTypes.object,
        table: PropTypes.object
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
                    name={`${this.props.metric.name} 有关的提问`}
                    type="questions"
                    headerIcon="ruler"
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
                        <AdminAwareEmptyState {...emptyStateData(this.props.table, this.props.metric)}/>
                    </div>
                }
                </LoadingAndErrorWrapper>
            </div>
        )
    }
}
