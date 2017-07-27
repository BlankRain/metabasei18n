/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import S from "metabase/components/Sidebar.css";

import Breadcrumbs from "metabase/components/Breadcrumbs.jsx";
import SidebarItem from "metabase/components/SidebarItem.jsx"

import cx from 'classnames';
import pure from "recompose/pure";

const SegmentSidebar = ({
    segment,
    user,
    style,
    className
}) =>
    <div className={cx(S.sidebar, className)} style={style}>
        <ul>
            <div className={S.breadcrumbs}>
                <Breadcrumbs
                    className="py4"
                    crumbs={[["Segments","/reference/segments"],
                             [segment.name]]}
                    inSidebar={true}
                    placeholder="数据参考"
                />
            </div>
                <SidebarItem key={`/reference/segments/${segment.id}`} 
                             href={`/reference/segments/${segment.id}`} 
                             icon="document" 
                             name="详情" />
                <SidebarItem key={`/reference/segments/${segment.id}/fields`} 
                             href={`/reference/segments/${segment.id}/fields`} 
                             icon="fields" 
                             name="segment的字段" />
                <SidebarItem key={`/reference/segments/${segment.id}/questions`} 
                             href={`/reference/segments/${segment.id}/questions`} 
                             icon="all" 
                             name={`segment的提问`} />
             { user && user.is_superuser &&

                <SidebarItem key={`/reference/segments/${segment.id}/revisions`}
                             href={`/reference/segments/${segment.id}/revisions`}
                             icon="history" 
                             name={`修订历史`} />
             }
        </ul>
    </div>

SegmentSidebar.propTypes = {
    segment:          PropTypes.object,
    user:          PropTypes.object,
    className:      PropTypes.string,
    style:          PropTypes.object,
};

export default pure(SegmentSidebar);

