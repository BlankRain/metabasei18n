/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";

import cx from "classnames";

const DetailPane = ({ name, description, usefulQuestions, useForCurrentQuestion, extra }) =>
    <div>
        <h1>{name}</h1>
        <p className={cx({ "text-grey-3": !description })}>
            {description || "No description set."}
        </p>
        { useForCurrentQuestion && useForCurrentQuestion.length > 0 ?
            <div className="py1">
                <p className="text-bold">为当前问题使用</p>
                <ul className="my2">
                {useForCurrentQuestion.map((item, index) =>
                    <li className="mt1" key={index}>
                        {item}
                    </li>
                )}
                </ul>
            </div>
        : null }
        { usefulQuestions && usefulQuestions.length > 0 ?
            <div className="py1">
                <p className="text-bold">可能有用的提问</p>
                <ul>
                {usefulQuestions.map((item, index) =>
                    <li className="border-row-divider" key={index}>
                        {item}
                    </li>
                )}
                </ul>
            </div>
        : null }
        {extra}
    </div>

DetailPane.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    error: PropTypes.string,
    useForCurrentQuestion: PropTypes.array,
    usefulQuestions: PropTypes.array,
    extra: PropTypes.element
}

export default DetailPane;
