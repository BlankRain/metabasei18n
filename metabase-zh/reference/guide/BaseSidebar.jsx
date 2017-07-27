/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import S from "metabase/components/Sidebar.css";

import Breadcrumbs from "metabase/components/Breadcrumbs.jsx";
import SidebarItem from "metabase/components/SidebarItem.jsx"

import cx from 'classnames';
import pure from "recompose/pure";

const BaseSidebar = ({
    style,
    className
}) =>
    <div className={cx(S.sidebar, className)} style={style}>
        <div className={S.breadcrumbs}>
            <Breadcrumbs
                className="py4"
                crumbs={[["Data Reference"]]}
                inSidebar={true}
                placeholder="数据参考"
            />
        </div>
        <ol>
            <SidebarItem key="/reference/guide" 
                         href="/reference/guide" 
                         icon="reference" 
                         name="从这里开始" />
            <SidebarItem key="/reference/metrics" 
                         href="/reference/metrics" 
                         icon="ruler" 
                         name="Metrics" />
            <SidebarItem key="/reference/segments" 
                         href="/reference/segments" 
                         icon="segment" 
                         name="Segments" />
            <SidebarItem key="/reference/databases" 
                         href="/reference/databases" 
                         icon="database" 
                         name="数据库和表" />
        </ol>
    </div>

BaseSidebar.propTypes = {
    className:      PropTypes.string,
    style:          PropTypes.object,
};

export default pure(BaseSidebar);

