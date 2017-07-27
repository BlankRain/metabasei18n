/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from 'react-redux';
import { reduxForm } from "redux-form";

import cx from "classnames";

import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";
import CreateDashboardModal from 'metabase/components/CreateDashboardModal.jsx';
import Modal from 'metabase/components/Modal.jsx';

import EditHeader from "metabase/reference/components/EditHeader.jsx";
import GuideHeader from "metabase/reference/components/GuideHeader.jsx";
import GuideEditSection from "metabase/reference/components/GuideEditSection.jsx";
import GuideDetail from "metabase/reference/components/GuideDetail.jsx";
import GuideDetailEditor from "metabase/reference/components/GuideDetailEditor.jsx";

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';
import { clearRequestState } from "metabase/redux/requests";
import { createDashboard, updateDashboard } from 'metabase/dashboards/dashboards';

import {
    updateSetting
} from 'metabase/admin/settings/settings';

import S from "../components/GuideDetailEditor.css";

import {
    getGuide,
    getUser,
    getDashboards,
    getLoading,
    getError,
    getIsEditing,
    getIsDashboardModalOpen,
    getDatabases,
    getTables,
    getFields,
    getMetrics,
    getSegments,
} from '../selectors';

import {
    getQuestionUrl,
    has
} from '../utils';

const isGuideEmpty = ({
    things_to_know,
    contact,
    most_important_dashboard,
    important_metrics,
    important_segments,
    important_tables
} = {}) => things_to_know ? false :
    contact && contact.name ? false :
    contact && contact.email ? false :
    most_important_dashboard ? false :
    important_metrics && important_metrics.length !== 0 ? false :
    important_segments && important_segments.length !== 0 ? false :
    important_tables && important_tables.length !== 0 ? false :
    true;

const mapStateToProps = (state, props) => {
    const guide = getGuide(state, props);
    const dashboards = getDashboards(state, props);
    const metrics = getMetrics(state, props);
    const segments = getSegments(state, props);
    const tables = getTables(state, props);
    const fields = getFields(state, props);
    const databases = getDatabases(state, props);

    // redux-form populates fields with stale values after update
    // if we dont specify nulls here
    // could use a lot of refactoring
    const initialValues = guide && {
        things_to_know: guide.things_to_know || null,
        contact: guide.contact || {name: null, email: null},
        most_important_dashboard: dashboards !== null && guide.most_important_dashboard !== null ?
            dashboards[guide.most_important_dashboard] :
            {},
        important_metrics: guide.important_metrics && guide.important_metrics.length > 0 ?
            guide.important_metrics
                .map(metricId => metrics[metricId] && {
                    ...metrics[metricId],
                    important_fields: guide.metric_important_fields[metricId] && guide.metric_important_fields[metricId].map(fieldId => fields[fieldId])
                }) :
            [],
        important_segments_and_tables:
            (guide.important_segments && guide.important_segments.length > 0) ||
            (guide.important_tables && guide.important_tables.length > 0) ?
                guide.important_segments
                    .map(segmentId => segments[segmentId] && { ...segments[segmentId], type: 'segment' })
                    .concat(guide.important_tables
                        .map(tableId => tables[tableId] && { ...tables[tableId], type: 'table' })
                    ) :
                []
    };

    return {
        guide,
        user: getUser(state, props),
        dashboards,
        metrics,
        segments,
        tables,
        databases,
        // FIXME: avoids naming conflict, tried using the propNamespace option
        // version but couldn't quite get it to work together with passing in
        // dynamic initialValues
        metadataFields: fields,
        loading: getLoading(state, props),
        // naming this 'error' will conflict with redux form
        loadingError: getError(state, props),
        isEditing: getIsEditing(state, props),
        isDashboardModalOpen: getIsDashboardModalOpen(state, props),
        // redux form doesn't pass this through to component
        // need to use to reset form field arrays
        initialValues: initialValues,
        initialFormValues: initialValues
    };
};

const mapDispatchToProps = {
    updateDashboard,
    createDashboard,
    updateSetting,
    clearRequestState,
    ...metadataActions,
    ...actions
};

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
    form: 'guide',
    fields: [
        'things_to_know',
        'contact.name',
        'contact.email',
        'most_important_dashboard.id',
        'most_important_dashboard.caveats',
        'most_important_dashboard.points_of_interest',
        'important_metrics[].id',
        'important_metrics[].caveats',
        'important_metrics[].points_of_interest',
        'important_metrics[].important_fields',
        'important_segments_and_tables[].id',
        'important_segments_and_tables[].type',
        'important_segments_and_tables[].caveats',
        'important_segments_and_tables[].points_of_interest'
    ]
})
export default class ReferenceGettingStartedGuide extends Component {
    static propTypes = {
        fields: PropTypes.object,
        style: PropTypes.object,
        guide: PropTypes.object,
        user: PropTypes.object,
        dashboards: PropTypes.object,
        metrics: PropTypes.object,
        segments: PropTypes.object,
        tables: PropTypes.object,
        databases: PropTypes.object,
        metadataFields: PropTypes.object,
        loadingError: PropTypes.any,
        loading: PropTypes.bool,
        isEditing: PropTypes.bool,
        startEditing: PropTypes.func,
        endEditing: PropTypes.func,
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        initialFormValues: PropTypes.object,
        initializeForm: PropTypes.func,
        createDashboard: PropTypes.func,
        isDashboardModalOpen: PropTypes.bool,
        showDashboardModal: PropTypes.func,
        hideDashboardModal: PropTypes.func,
    };

    render() {
        const {
            fields: {
                things_to_know,
                contact,
                most_important_dashboard,
                important_metrics,
                important_segments_and_tables
            },
            style,
            guide,
            user,
            dashboards,
            metrics,
            segments,
            tables,
            databases,
            metadataFields,
            loadingError,
            loading,
            isEditing,
            startEditing,
            endEditing,
            handleSubmit,
            submitting,
            initialFormValues,
            initializeForm,
            createDashboard,
            isDashboardModalOpen,
            showDashboardModal,
            hideDashboardModal,
        } = this.props;

        const onSubmit = handleSubmit(async (fields) =>
            await actions.tryUpdateGuide(fields, this.props)
        );

        const getSelectedIds = fields => fields
            .map(field => field.id.value)
            .filter(id => id !== null);

        const getSelectedIdTypePairs = fields => fields
            .map(field => [field.id.value, field.type.value])
            .filter(idTypePair => idTypePair[0] !== null);


        return (
            <form className="full relative py4" style={style} onSubmit={onSubmit}>
                { isDashboardModalOpen &&
                    <Modal>
                        <CreateDashboardModal
                            createDashboardFn={async (newDashboard) => {
                                try {
                                    await createDashboard(newDashboard, { redirect: true });
                                }
                                catch(error) {
                                    console.error(error);
                                }
                            }}
                            onClose={hideDashboardModal}
                        />
                    </Modal>
                }
                { isEditing &&
                    <EditHeader
                        endEditing={endEditing}
                        // resetForm doesn't reset field arrays
                        reinitializeForm={() => initializeForm(initialFormValues)}
                        submitting={submitting}
                    />
                }
                <LoadingAndErrorWrapper className="full" style={style} loading={!loadingError && loading} error={loadingError}>
                { () => isEditing ?
                    <div className="wrapper wrapper--trim">
                        <div className="mt4 py2">
                            <h1 className="my3 text-dark">
                                帮助新Metabase 用户找到他们自己的使用方式.
                            </h1>
                            <p className="text-paragraph text-measure">
                                新手指南高亮了dashboard，metrics,segments 还有表,这些都是比较重要的东西.
                                且假设你的用户在探索数据之前以及对这些概念有所认识和了解.
                            </p>
                        </div>

                        <GuideEditSection
                            isCollapsed={most_important_dashboard.id.value === undefined}
                            isDisabled={!dashboards || Object.keys(dashboards).length === 0}
                            collapsedTitle="你的团队有比较重要的dashboard吗?"
                            collapsedIcon="dashboard"
                            linkMessage="现在新建一个dashboard"
                            action={showDashboardModal}
                            expand={() => most_important_dashboard.id.onChange(null)}
                        >
                            <div>
                                <SectionHeader>
                                    你最重要的dashboard是哪个?
                                </SectionHeader>
                                <GuideDetailEditor
                                    type="dashboard"
                                    entities={dashboards}
                                    selectedIds={[most_important_dashboard.id.value]}
                                    formField={most_important_dashboard}
                                    removeField={() => {
                                        most_important_dashboard.id.onChange(null);
                                        most_important_dashboard.points_of_interest.onChange('');
                                        most_important_dashboard.caveats.onChange('');
                                    }}
                                />
                            </div>
                        </GuideEditSection>

                        <GuideEditSection
                            isCollapsed={important_metrics.length === 0}
                            isDisabled={!metrics || Object.keys(metrics).length === 0}
                            collapsedTitle="你有较通用参考的metrics吗?"
                            collapsedIcon="ruler"
                            linkMessage="学习如何定义一个metric"
                            link="http://www.metabase.com/docs/latest/administration-guide/07-segments-and-metrics.html#creating-a-metric"
                            expand={() => important_metrics.addField({id: null, caveats: null, points_of_interest: null, important_fields: null})}
                        >
                            <div className="my2">
                                <SectionHeader>
                                    你最常用的3-5个metrics是什么?
                                </SectionHeader>
                                <div>
                                    { important_metrics.map((metricField, index, metricFields) =>
                                        <GuideDetailEditor
                                            key={index}
                                            type="metric"
                                            metadata={{
                                                tables,
                                                metrics,
                                                fields: metadataFields,
                                                metricImportantFields: guide.metric_important_fields
                                            }}
                                            entities={metrics}
                                            formField={metricField}
                                            selectedIds={getSelectedIds(metricFields)}
                                            removeField={() => {
                                                if (metricFields.length > 1) {
                                                    return metricFields.removeField(index);
                                                }
                                                metricField.id.onChange(null);
                                                metricField.points_of_interest.onChange('');
                                                metricField.caveats.onChange('');
                                                metricField.important_fields.onChange(null);
                                            }}
                                        />
                                    )}
                                </div>
                                { important_metrics.length < 5 &&
                                    important_metrics.length < Object.keys(metrics).length &&
                                        <button
                                            className="Button Button--primary Button--large"
                                            type="button"
                                            onClick={() => important_metrics.addField({id: null, caveats: null, points_of_interest: null})}
                                        >
                                            添加其他metric
                                        </button>
                                }
                            </div>
                        </GuideEditSection>

                        <GuideEditSection
                            isCollapsed={important_segments_and_tables.length === 0}
                            isDisabled={(!segments || Object.keys(segments).length === 0) && (!tables || Object.keys(tables).length === 0)}
                            showLink={!segments || Object.keys(segments).length === 0}
                            collapsedTitle="你有常用的segments 或表吗?"
                            collapsedIcon="table2"
                            linkMessage="学习如何新建 segment"
                            link="http://www.metabase.com/docs/latest/administration-guide/07-segments-and-metrics.html#creating-a-segment"
                            expand={() => important_segments_and_tables.addField({id: null, type: null, caveats: null, points_of_interest: null})}
                        >
                            <div>
                                <h2 className="text-measure text-dark">
                                    常用的3-5个segments或表里,哪些是有用的?
                                </h2>
                                <div className="mb2">
                                    { important_segments_and_tables.map((segmentOrTableField, index, segmentOrTableFields) =>
                                        <GuideDetailEditor
                                            key={index}
                                            type="segment"
                                            metadata={{
                                                databases,
                                                tables,
                                                segments
                                            }}
                                            formField={segmentOrTableField}
                                            selectedIdTypePairs={getSelectedIdTypePairs(segmentOrTableFields)}
                                            removeField={() => {
                                                if (segmentOrTableFields.length > 1) {
                                                    return segmentOrTableFields.removeField(index);
                                                }
                                                segmentOrTableField.id.onChange(null);
                                                segmentOrTableField.type.onChange(null);
                                                segmentOrTableField.points_of_interest.onChange('');
                                                segmentOrTableField.caveats.onChange('');
                                            }}
                                        />
                                    )}
                                </div>
                                { important_segments_and_tables.length < 5 &&
                                    important_segments_and_tables.length < Object.keys(tables).concat(Object.keys.segments).length &&
                                        <button
                                            className="Button Button--primary Button--large"
                                            type="button"
                                            onClick={() => important_segments_and_tables.addField({id: null, type: null, caveats: null, points_of_interest: null})}
                                        >
                                            添加其他 segment 或 表
                                        </button>
                                }
                            </div>
                        </GuideEditSection>

                        <GuideEditSection
                            isCollapsed={things_to_know.value === null}
                            isDisabled={false}
                            collapsedTitle="Is there anything your users should understand or know before they start accessing the data?"
                            collapsedIcon="reference"
                            expand={() => things_to_know.onChange('')}
                        >
                            <div className="text-measure">
                                <SectionHeader>
                                    用户访问数据前,应该了解什么?
                                </SectionHeader>
                                <textarea
                                    className={S.guideDetailEditorTextarea}
                                    placeholder="比如:数据是用来做什么的,通用的一些概念或误解的地方, 数据仓库的性能信息,法律注意事项等."
                                    {...things_to_know}
                                />
                            </div>
                        </GuideEditSection>

                        <GuideEditSection
                            isCollapsed={contact.name.value === null && contact.email.value === null}
                            isDisabled={false}
                            collapsedTitle="如果有人对此文档感到困惑,你们有技术支持吗?"
                            collapsedIcon="mail"
                            expand={() => {
                                contact.name.onChange('');
                                contact.email.onChange('');
                            }}
                        >
                            <div>
                                <SectionHeader>
                                    用户应该联系谁，当他对文档感到困惑的时候?
                                </SectionHeader>
                                <div className="flex">
                                    <div className="flex-full">
                                        <h3 className="mb1">姓名</h3>
                                        <input
                                            className="input text-paragraph"
                                            placeholder="Julie McHelpfulson"
                                            type="text"
                                            {...contact.name}
                                        />
                                    </div>
                                    <div className="flex-full">
                                        <h3 className="mb1">邮件地址</h3>
                                        <input
                                            className="input text-paragraph"
                                            placeholder="julie.mchelpfulson@acme.com"
                                            type="text"
                                            {...contact.email}
                                        />
                                    </div>
                                </div>
                            </div>
                        </GuideEditSection>
                    </div> :
                    <div>
                        <GuideHeader
                            startEditing={startEditing}
                            isSuperuser={user && user.is_superuser}
                        />

                        <div className="wrapper wrapper--trim">
                            { (!guide || isGuideEmpty(guide)) && user && user.is_superuser && (
                                <AdminInstructions>
                                    <h2 className="py2">帮助启动你的团队.</h2>
                                    <GuideText>
                                        通过展示top dashboard, metrics, 和 segments,告诉你的团队哪些是重要的东西.
                                    </GuideText>
                                    <button
                                        className="Button Button--primary"
                                        onClick={startEditing}
                                    >
                                        一键启动
                                    </button>
                                </AdminInstructions>
                            )}

                            { guide.most_important_dashboard !== null && [
                                <div className="my2">
                                    <SectionHeader key={'dashboardTitle'}>
                                        我们最重要的dashboard
                                    </SectionHeader>
                                    <GuideDetail
                                        key={'dashboardDetail'}
                                        type="dashboard"
                                        entity={dashboards[guide.most_important_dashboard]}
                                        tables={tables}
                                    />
                                </div>
                            ]}
                            { Object.keys(metrics).length > 0  && (
                                    <div className="my4 pt4">
                                        <SectionHeader trim={guide.important_metrics.length === 0}>
                                            { guide.important_metrics && guide.important_metrics.length > 0 ? '我们关注的数量' : 'Metrics' }
                                        </SectionHeader>
                                        { (guide.important_metrics && guide.important_metrics.length > 0) ? [
                                            <div className="my2">
                                                { guide.important_metrics.map((metricId) =>
                                                    <GuideDetail
                                                        key={metricId}
                                                        type="metric"
                                                        entity={metrics[metricId]}
                                                        tables={tables}
                                                        exploreLinks={guide.metric_important_fields[metricId] &&
                                                            guide.metric_important_fields[metricId]
                                                                .map(fieldId => metadataFields[fieldId])
                                                                .map(field => ({
                                                                    name: field.display_name || field.name,
                                                                    url: getQuestionUrl({
                                                                        dbId: tables[field.table_id] && tables[field.table_id].db_id,
                                                                        tableId: field.table_id,
                                                                        fieldId: field.id,
                                                                        metricId
                                                                    })
                                                                }))
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ] :
                                            <GuideText>
                                                Metrics是你公司要关注的非常重要的指标.
                                               它们通常能反映出你公司业务执行情况.
                                            </GuideText>
                                        }
                                        <div>
                                            <Link className="Button Button--primary" to={'/reference/metrics'}>
                                                查看所有的metrics
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="mt4 pt4">
                                <SectionHeader trim={(!has(guide.important_segments) && !has(guide.important_tables))}>
                                    { Object.keys(segments).length > 0 ? 'Segments 和表' : '表' }
                                </SectionHeader>
                                { has(guide.important_segments) || has(guide.important_tables) ?
                                    <div className="my2">
                                        { guide.important_segments.map((segmentId) =>
                                            <GuideDetail
                                                key={segmentId}
                                                type="segment"
                                                entity={segments[segmentId]}
                                                tables={tables}
                                            />
                                        )}
                                        { guide.important_tables.map((tableId) =>
                                            <GuideDetail
                                                key={tableId}
                                                type="table"
                                                entity={tables[tableId]}
                                                tables={tables}
                                            />
                                        )}
                                    </div>
                                :
                                    <GuideText>
                                        { Object.keys(segments).length > 0 ? (
                                            <span>
                                                Segments 和表是组成你公司数据的数据块.表是原始数据的集合. segments是特殊加工后的数据.比如： <b>"近期订单."</b>
                                            </span>
                                        ) : "表是你公司的数据块."
                                        }
                                    </GuideText>
                                }
                                <div>
                                    { Object.keys(segments).length > 0 && (
                                        <Link className="Button Button--purple mr2" to={'/reference/segments'}>
                                            查看所有segments
                                        </Link>
                                    )}
                                    <Link
                                        className={cx(
                                            { 'text-purple text-bold no-decoration text-underline-hover' : Object.keys(segments).length > 0 },
                                            { 'Button Button--purple' : Object.keys(segments).length === 0 }
                                        )}
                                        to={'/reference/databases'}
                                    >
                                        查看所有表
                                    </Link>
                                </div>
                            </div>

                            <div className="mt4 pt4">
                                <SectionHeader trim={!guide.things_to_know}>
                                    { guide.things_to_know ? '关于我们数据其他需要了解的事情' : '了解更多' }
                                </SectionHeader>
                                <GuideText>
                                    { guide.things_to_know ? guide.things_to_know : "一个好的方法去了解你的数据,是花一点时间浏览不同的表和信息.大概会花点功夫,但是你会明白其中的意义."
                                    }
                                </GuideText>
                                <Link className="Button link text-bold" to={'/reference/databases'}>
                                    探索我们的数据
                                </Link>
                            </div>

                            <div className="mt4">
                                { guide.contact && (guide.contact.name || guide.contact.email) && [
                                    <SectionHeader key={'contactTitle'}>
                                        有问题?
                                    </SectionHeader>,
                                    <div className="mb4 pb4" key={'contactDetails'}>
                                            { guide.contact.name &&
                                                <span className="text-dark mr3">
                                                    {`Contact ${guide.contact.name}`}
                                                </span>
                                            }
                                            { guide.contact.email &&
                                                <a className="text-brand text-bold no-decoration" href={`mailto:${guide.contact.email}`}>
                                                    {guide.contact.email}
                                                </a>
                                            }
                                    </div>
                                ]}
                            </div>
                        </div>
                    </div>
                }
                </LoadingAndErrorWrapper>
            </form>
        );
    }
}

const GuideText = ({ children }) => // eslint-disable-line react/prop-types
    <p className="text-paragraph text-measure">{children}</p>

const AdminInstructions = ({ children }) => // eslint-disable-line react/prop-types
    <div className="bordered border-brand rounded p3 text-brand text-measure text-centered bg-light-blue">
        {children}
    </div>

const SectionHeader = ({ trim, children }) => // eslint-disable-line react/prop-types
    <h2 className={cx('text-dark text-measure', {  "mb0" : trim }, { "mb4" : !trim })}>{children}</h2>
