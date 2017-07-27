/* @flow */

import React from "react";

import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
import AggregationPopover from "metabase/qb/components/gui/AggregationPopover";

import type {
    ClickAction,
    ClickActionProps,
    ClickActionPopoverProps
} from "metabase/meta/types/Visualization";
import type { TableMetadata } from "metabase/meta/types/Metadata";

export default ({ question }: ClickActionProps): ClickAction[] => {
    const query = question.query();
    if (!(query instanceof StructuredQuery)) {
        return [];
    }

    const tableMetadata: TableMetadata = query.table();

    return [
        {
            name: "summarize",
            title: "汇总该segment",
            icon: "sum",
            // eslint-disable-next-line react/display-name
            popover: (
                { onChangeCardAndRun, onClose }: ClickActionPopoverProps
            ) => (
                <AggregationPopover
                    query={query}
                    tableMetadata={tableMetadata}
                    customFields={query.expressions()}
                    availableAggregations={query.table().aggregation_options}
                    onCommitAggregation={aggregation => {
                        onChangeCardAndRun({
                            nextCard: question.summarize(aggregation).card()
                        });
                        onClose && onClose();
                    }}
                    onClose={onClose}
                />
            )
        }
    ];
};
