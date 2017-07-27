import React, { Component } from "react";
import { Link } from "react-router";

import * as Urls from "metabase/lib/urls";

export default class NotFound extends Component {
    render() {
        return (
            <div className="layout-centered flex full">
                <div className="p4 text-bold">
                    <h1 className="text-brand text-light mb3">有点小迷茫...</h1>
                    <p className="h4 mb1">你访问的页面找不到唉.</p>
                    <p className="h4">你可能被人涮了,但最大的可能性还是你这个链接有问题.</p>
                    <p className="h4 my4">你也可以:</p>
                    <div className="flex align-center">
                        <Link to={Urls.question()} className="Button Button--primary">
                            <div className="p1">提个新问题.</div>
                        </Link>
                        <span className="mx2">或者</span>
                        <a className="Button Button--withIcon" target="_blank" href="http://tv.giphy.com/kitten">
                            <div className="p1 flex align-center relative">
                                <span className="h2">😸</span>
                                <span className="ml1">领个流浪猫.</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
