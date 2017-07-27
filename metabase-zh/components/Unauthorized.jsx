import React, { Component } from "react";

import Icon from "metabase/components/Icon.jsx";

export default class Unauthorized extends Component {
    render() {
        return (
            <div className="flex layout-centered flex-full flex-column text-grey-2">
                <Icon name="key" size={100} />
                <h1 className="mt4">Sorry, 你没有访问它的权限.</h1>
            </div>
        );
    }
}
