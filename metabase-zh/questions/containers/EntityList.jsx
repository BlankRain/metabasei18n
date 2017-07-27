/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import EmptyState from "metabase/components/EmptyState";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import ListFilterWidget from "metabase/components/ListFilterWidget"

import S from "../components/List.css";

import List from "../components/List";
import SearchHeader from "metabase/components/SearchHeader";
import ActionHeader from "../components/ActionHeader";

import _ from "underscore";

import { loadEntities, setSearchText, setItemSelected, setAllSelected, setArchived } from "../questions";
import { loadLabels } from "../labels";
import {
    getSection, getEntityIds,
    getSectionLoading, getSectionError,
    getSearchText,
    getVisibleCount, getSelectedCount, getAllAreSelected, getSectionIsArchive,
    getLabelsWithSelectedState
} from "../selectors";


const mapStateToProps = (state, props) => {
  return {
      section:          getSection(state, props),
      entityIds:        getEntityIds(state, props),
      loading:          getSectionLoading(state, props),
      error:            getSectionError(state, props),

      searchText:       getSearchText(state, props),

      visibleCount:     getVisibleCount(state, props),
      selectedCount:    getSelectedCount(state, props),
      allAreSelected:   getAllAreSelected(state, props),
      sectionIsArchive: getSectionIsArchive(state, props),

      labels:           getLabelsWithSelectedState(state, props),
  }
}

const mapDispatchToProps = {
    setItemSelected,
    setAllSelected,
    setSearchText,
    setArchived,
    loadEntities,
    loadLabels
}

const SECTIONS = [
    {
        id: 'all',
        name: '所有提问',
        icon: 'all',
        empty: '没有保存的提问.',
    },
    {
        id: 'fav',
        name: '最感兴趣的',
        icon: 'star',
        empty: '你还未对任何提问感兴趣.',
    },
    {
        id: 'recent',
        name: '最近查看的',
        icon: 'recents',
        empty: '你最近未查看任何问题.',
    },
    {
        id: 'mine',
        name: '我保存的',
        icon: 'mine',
        empty:  '你还未保存任何问题.'
    },
    {
        id: 'popular',
        name: '最流行的',
        icon: 'popular',
        empty: '你的公司查看最多的提问将会显示在这里.',
    },
    {
        id: 'archived',
        name: "打包",
        icon: 'archive',
        empty: '如果你不再需要这个问题,你可以打包归档它.'
    }
];

const DEFAULT_SECTION = {
    icon: 'all',
    empty: '没有满足条件的提问.'
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EntityList extends Component {
    static propTypes = {
        style:              PropTypes.object,

        entityQuery:        PropTypes.object.isRequired,
        entityType:         PropTypes.string.isRequired,

        section:            PropTypes.string,
        loading:            PropTypes.bool.isRequired,
        error:              PropTypes.any,
        entityIds:          PropTypes.array.isRequired,
        searchText:         PropTypes.string.isRequired,
        setSearchText:      PropTypes.func.isRequired,
        visibleCount:       PropTypes.number.isRequired,
        selectedCount:      PropTypes.number.isRequired,
        allAreSelected:     PropTypes.bool.isRequired,
        sectionIsArchive:   PropTypes.bool.isRequired,
        labels:             PropTypes.array.isRequired,
        setItemSelected:    PropTypes.func.isRequired,
        setAllSelected:     PropTypes.func.isRequired,
        setArchived:        PropTypes.func.isRequired,

        loadEntities:       PropTypes.func.isRequired,
        loadLabels:         PropTypes.func.isRequired,

        onEntityClick:      PropTypes.func,
        onChangeSection:    PropTypes.func,
        showSearchWidget:   PropTypes.bool.isRequired,
        showCollectionName: PropTypes.bool.isRequired,
        editable:           PropTypes.bool.isRequired,

        defaultEmptyState:  PropTypes.string
    };

    static defaultProps = {
        showSearchWidget: true,
        showCollectionName: true,
        editable: true,
    }

    componentDidUpdate(prevProps) {
        // Scroll to the top of the list if the section changed
        // A little hacky, something like https://github.com/taion/scroll-behavior might be better
        if (this.props.section !== prevProps.section) {
            ReactDOM.findDOMNode(this).scrollTop = 0;
        }
    }

    componentWillMount() {
        this.props.loadLabels();
        this.props.loadEntities(this.props.entityType, this.props.entityQuery);
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.entityQuery, nextProps.entityQuery) || nextProps.entityType !== this.props.entityType) {
            this.props.loadEntities(nextProps.entityType, nextProps.entityQuery);
        }
    }

    getSection () {
        return _.findWhere(SECTIONS, { id: this.props.entityQuery && this.props.entityQuery.f || "all" }) || DEFAULT_SECTION;
    }

    render() {
        const {
            style,
            loading, error,
            entityType, entityIds,
            searchText, setSearchText, showSearchWidget,
            visibleCount, selectedCount, allAreSelected, sectionIsArchive, labels,
            setItemSelected, setAllSelected, setArchived, onChangeSection,
            showCollectionName,
            editable, onEntityClick,
        } = this.props;

        const section = this.getSection();


        const hasEntitiesInPlainState = entityIds.length > 0 || section.section !== "all";

        const showActionHeader = (editable && selectedCount > 0);
        const showSearchHeader = (hasEntitiesInPlainState && showSearchWidget);
        const showEntityFilterWidget = onChangeSection;

        return (
            <div style={style}>
                { (showActionHeader || showSearchHeader || showEntityFilterWidget) &&
                    <div className="flex align-center my1" style={{height: 40}}>
                        { showActionHeader ?
                            <ActionHeader
                                visibleCount={visibleCount}
                                selectedCount={selectedCount}
                                allAreSelected={allAreSelected}
                                sectionIsArchive={sectionIsArchive}
                                setAllSelected={setAllSelected}
                                setArchived={setArchived}
                                labels={labels}
                            />
                        : showSearchHeader ?
                                <div style={{marginLeft: "10px"}}>
                                    <SearchHeader
                                        searchText={searchText}
                                        setSearchText={setSearchText}
                                    />
                                </div>
                        :
                            null
                      }
                      { showEntityFilterWidget && hasEntitiesInPlainState &&
                          <ListFilterWidget
                              items={SECTIONS.filter(item => item.id !== "archived")}
                              activeItem={section}
                              onChange={(item) => onChangeSection(item.id)}
                          />
                      }
                    </div>
                }
                <LoadingAndErrorWrapper className="full" loading={!error && loading} error={error}>
                { () =>
                    entityIds.length > 0 ?
                        <List
                            entityType={entityType}
                            entityIds={entityIds}
                            editable={editable}
                            setItemSelected={setItemSelected}
                            onEntityClick={onEntityClick}
                            showCollectionName={showCollectionName}
                        />
                    :
                        <div className={S.empty}>
                            <EmptyState message={section.id === "all" && this.props.defaultEmptyState ? this.props.defaultEmptyState : section.empty} icon={section.icon} />
                        </div>
                }
                </LoadingAndErrorWrapper>
            </div>
        );
    }
}
