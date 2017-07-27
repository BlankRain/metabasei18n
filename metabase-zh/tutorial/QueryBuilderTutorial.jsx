/* eslint-disable react/display-name */

import React, { Component } from "react";

import Tutorial, { qs, qsWithContent } from "./Tutorial.jsx";

import RetinaImage from "react-retina-image";

const QUERY_BUILDER_STEPS = [
    {
        getPortalTarget: () => qs(".GuiBuilder"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage className="mb2" forceOriginalDimensions={false} src="app/assets/img/qb_tutorial/question_builder.png" width={186} />
                <h3>欢迎来到查询构建器!</h3>
                <p>查询构建器能让你向你的数据库提问.</p>
                <a className="Button Button--primary" onClick={props.onNext}>告诉我更多</a>
            </div>
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getModalTarget: () => qs(".GuiBuilder-data"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage id="QB-TutorialTableImg" className="mb2" forceOriginalDimensions={false} src="app/assets/img/qb_tutorial/table.png" width={157} />
                <h3>选择一张你想问的表来开始.</h3>
                <p>继续,并且从下拉菜单里选择"Orders"表 .</p>
            </div>,
        shouldAllowEvent: (e) => qs(".GuiBuilder-data a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getPageFlagTarget: () => qsWithContent(".List-section-header", "Sample Dataset"),
        shouldAllowEvent: (e) => qsWithContent(".List-section-header", "Sample Dataset").contains(e.target),
        optional: true
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-data"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Orders"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Orders").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getModalTarget: () => qs(".GuiBuilder-filtered-by"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialFunnelImg"
                    src="app/assets/img/qb_tutorial/funnel.png"
                    width={135}
                />
                <h3>过滤你想要的数据.</h3>
                <p>点击+按钮 并且选择 "Created At" 字段.</p>
            </div>,
        shouldAllowEvent: (e) => qs(".GuiBuilder-filtered-by a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Created At"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Created At").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagText: () => "Here we can pick how many days we want to see data for, try 10",
        getPageFlagTarget: () => qs('[data-ui-tag="relative-date-input"]'),
        shouldAllowEvent: (e) => qs('[data-ui-tag="relative-date-input"]').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".GuiBuilder-filtered-by"),
        getPageFlagTarget: () => qs('[data-ui-tag="add-filter"]'),
        shouldAllowEvent: (e) => qs('[data-ui-tag="add-filter"]').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-aggregation"),
        getModalTarget: () => qs(".Query-section-aggregation"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialCalculatorImg"
                    src="app/assets/img/qb_tutorial/calculator.png"
                    width={115}
                />
                <h3>这里你可以选择加或者平均你的数据, 统计表的行数, 或者只是查看表数据.</h3>
                <p>试着点击 <strong>Raw Data</strong> 改变它到 <strong>Count of rows</strong> 这样我们就能统计表有多少行了.</p>
            </div>,
        shouldAllowEvent: (e) => qs('.View-section-aggregation').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-aggregation"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Count of rows"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Count of rows").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getModalTarget: () => qs(".Query-section-breakout"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialBananaImg"
                    src="app/assets/img/qb_tutorial/banana.png"
                    width={232}
                />
                <h3>通过分类，天，年，月来分组我们的数据.</h3>
                <p>我们一块点击 <strong>Add a grouping</strong>, 并且选择 <strong>Created : by Week</strong>.</p>
            </div>,
        shouldAllowEvent: (e) => qs('.Query-section-breakout').contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getPageFlagTarget: () => qs(".FieldList-grouping-trigger"),
        getPageFlagText: () => "Click on \"by day\" to change it to \"Week.\"",
        shouldAllowEvent: (e) => qs(".FieldList-grouping-trigger").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".Query-section-breakout"),
        getPageFlagTarget: () => qsWithContent(".List-item", "Week"),
        shouldAllowEvent: (e) => qsWithContent(".List-item > a", "Week").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".RunButton"),
        getModalTarget: () => qs(".RunButton"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialRocketImg"
                    src="app/assets/img/qb_tutorial/rocket.png"
                    width={217}
                />
                <h3>运行你的查询.</h3>
                <p>干的飘来! Click <strong>运行查询</strong>可得到结果!</p>
            </div>,
        shouldAllowEvent: (e) => qs(".RunButton").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".VisualizationSettings"),
        getModalTarget: () => qs(".VisualizationSettings"),
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialChartImg"
                    src="app/assets/img/qb_tutorial/chart.png"
                    width={160}
                />
                <h3>你可以以图的形式查看它而不是表.</h3>
                <p>大家都喜欢图! 点击 <strong>可视化</strong> 下拉菜单选择 <strong>Line</strong>.</p>
            </div>,
        shouldAllowEvent: (e) => qs(".VisualizationSettings a").contains(e.target)
    },
    {
        getPortalTarget: () => qs(".VisualizationSettings"),
        getPageFlagTarget: () => qsWithContent(".ChartType-popover li", "Line"),
        shouldAllowEvent: (e) => qsWithContent(".ChartType-popover li", "Line").contains(e.target)
    },
    {
        getPortalTarget: () => true,
        getModal: (props) =>
            <div className="text-centered">
                <RetinaImage
                    className="mb2"
                    forceOriginalDimensions={false}
                    id="QB-TutorialBoatImg"
                    src="app/assets/img/qb_tutorial/boat.png" width={190}
                />
                <h3>干得漂亮!</h3>
                <p>就这样好啦! 如果你依然有问题, 可以去查看我们的 <a className="link" target="_blank" href="http://www.metabase.com/docs/latest/users-guide/start">用户手册</a>. 玩的愉快!</p>
                <a className="Button Button--primary" onClick={props.onNext}>Thanks!</a>
            </div>
    },
    {
        getModalTarget: () => qsWithContent(".Header-buttonSection a", "Save"),
        getModal: (props) =>
            <div className="text-centered">
                <h3>保存你的提问!</h3>
                <p>另外,你可以保存你的提问，以备用. 保存后的提问是可以用在dashboard和pulse里的.</p>
                <a className="Button Button--primary" onClick={props.onClose}>Sounds good</a>
            </div>
    }
]

export default class QueryBuilderTutorial extends Component {
    render() {
        return <Tutorial steps={QUERY_BUILDER_STEPS} {...this.props} />;
    }
}
