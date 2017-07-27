/* @flow */

import React from "react";

import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";

import type {
    ClickAction,
    ClickActionProps
} from "metabase/meta/types/Visualization";

export default ({ question }: ClickActionProps): ClickAction[] => {
    const query = question.query();
    if (!(query instanceof StructuredQuery) || query.isBareRows()) {
        return [];
    }

    return [
        {
            name: "underlying-records",
            title: (
                <span>
                    查看这个underlying
                    {" "}
                    <span className="text-dark">
                        {query.table().display_name}
                    </span>
                    {" "}
                    记录
                </span>
            ),
            icon: "table2",
            question: () => question.toUnderlyingRecords()
        }
    ];
};
