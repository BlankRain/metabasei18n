import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

import ModalContent from "metabase/components/ModalContent.jsx";

import * as Urls from "metabase/lib/urls";

export default class CreatedDatabaseModal extends Component {
    static propTypes = {
        databaseId: PropTypes.number.isRequired,
        onClose: PropTypes.func.isRequired,
        onDone: PropTypes.func.isRequired
    };

    render() {
        const { onClose, onDone, databaseId } = this.props;
        return (
            <ModalContent
                title="您的数据库已添加!"
                onClose={onClose}
            >
                <div className="Form-inputs mb4">
                    <p>
                        我们正在对它的Schema进行分析,对它的元数据进行些合理的推测.
                         <Link to={"/admin/datamodel/database/"+databaseId}>点击查看</Link> 数据模型部分,就能发现我们的成果,
                        你可以对它进行编辑, 或者 <Link to={Urls.question(null, `?db=${databaseId}`)}>提个问题</Link> ,针对这个数据库你关心的部分啦.
                        
                    </p>
                </div>

                <div className="Form-actions flex layout-centered">
                    <button className="Button Button--primary px3" onClick={onDone}>完成</button>
                </div>
            </ModalContent>
        );
    }
}
