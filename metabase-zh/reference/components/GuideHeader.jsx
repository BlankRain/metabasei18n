import React from "react";
import PropTypes from "prop-types";
import pure from "recompose/pure";

import EditButton from "metabase/reference/components/EditButton.jsx";

const GuideHeader = ({
    startEditing,
    isSuperuser
}) =>
    <div>
        <div className="wrapper wrapper--trim py4 my3">
            <div className="flex align-center">
                <h1 className="text-dark" style={{fontWeight: 700}}>从这里开始.</h1>
                { isSuperuser &&
                    <span className="ml-auto">
                        <EditButton startEditing={startEditing}/>
                    </span>
                }
            </div>
            <p className="text-paragraph" style={{maxWidth: 620}}>如果你对你公司数据不是很了解,从这里开始最好了, 或者你想了解一下接下来怎么做.</p>
        </div>
    </div>;

GuideHeader.propTypes = {
    startEditing: PropTypes.func.isRequired,
    isSuperuser: PropTypes.bool
};

export default pure(GuideHeader);
