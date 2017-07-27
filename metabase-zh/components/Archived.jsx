import React from 'react';
import EmptyState from "metabase/components/EmptyState";
import Link from "metabase/components/Link";

const Archived = ({ entityName, linkTo }) =>
    <div className="full-height flex justify-center align-center">
        <EmptyState
            message={<div>
                <div>这个 {entityName} 已打包</div>
                <Link to={linkTo} className="my2 link" style={{fontSize: "14px"}}>查看</Link>
            </div>}
            icon="viewArchive"
        />
    </div>;

export default Archived;