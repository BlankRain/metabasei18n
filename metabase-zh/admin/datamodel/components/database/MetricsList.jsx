import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

import MetricItem from "./MetricItem.jsx";

export default class MetricsList extends Component {
    static propTypes = {
        tableMetadata: PropTypes.object.isRequired,
        onRetire: PropTypes.func.isRequired
    };

    render() {
        let { tableMetadata } = this.props;

        tableMetadata.metrics = tableMetadata.metrics || [];
        tableMetadata.metrics = tableMetadata.metrics.filter((mtrc) => mtrc.is_active === true);

        return (
            <div id="MetricsList" className="my3">
                <div className="flex mb1">
                    <h2 className="px1 text-green">Metrics</h2>
                    <Link to={"/admin/datamodel/metric/create?table="+tableMetadata.id} data-metabase-event="Data Model;Add Metric Page" className="flex-align-right float-right text-bold text-brand no-decoration">+ 添加一个Metric</Link>
                </div>
                <table className="AdminTable">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "200px" }}>名称</th>
                            <th className="full">定义</th>
                            <th>动作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableMetadata.metrics.map(metric =>
                            <MetricItem
                                key={metric.id}
                                metric={metric}
                                tableMetadata={tableMetadata}
                                onRetire={this.props.onRetire}
                            />
                        )}
                    </tbody>
                </table>
                { tableMetadata.metrics.length === 0 &&
                    <div className="flex layout-centered m4 text-grey-3">
                        创建 metrics,添加它们到视图,就可以在查询构建器里拖拽
                    </div>
                }
            </div>
        );
    }
}
