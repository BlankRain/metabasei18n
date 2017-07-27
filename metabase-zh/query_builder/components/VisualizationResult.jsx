/* eslint "react/prop-types": "warn" */

import React from "react";
import QueryVisualizationObjectDetailTable from './QueryVisualizationObjectDetailTable.jsx';
import VisualizationErrorMessage from './VisualizationErrorMessage';
import Visualization from "metabase/visualizations/components/Visualization.jsx";
import { datasetContainsNoResults } from "metabase/lib/dataset";
import { DatasetQuery } from "metabase/meta/types/Card";

type Props = {
    question: Question,
    isObjectDetail: boolean,
    result: any,
    results: any[],
    lastRunDatasetQuery: DatasetQuery,
    navigateToNewCardInsideQB: (any) => void
}
const VisualizationResult = ({question, isObjectDetail, lastRunDatasetQuery, navigateToNewCardInsideQB, result, results, ...props}: Props) => {
    const noResults = datasetContainsNoResults(result.data);

    if (isObjectDetail) {
        return <QueryVisualizationObjectDetailTable data={result.data} {...props} />
    } else if (noResults) {
        // successful query but there were 0 rows returned with the result
        return <VisualizationErrorMessage
                  type='noRows'
                  title='查无结果!'
                  message='可能这就是你要的答案. 如果不是,你的过滤条件太特殊了,建议你修改一下再试试..'
                  action={
                    <button className="Button" onClick={() => window.history.back() }>
                        返回运行上一个
                    </button>
                  }
              />
    } else {
        // we want to provide the visualization with a card containing the latest
        // "display", "visualization_settings", etc, (to ensure the correct visualization is shown)
        // BUT the last executed "dataset_query" (to ensure data matches the query)
        const series = question.atomicQueries().map((metricQuery, index) => ({
            card: {
                ...question.card(),
                dataset_query: lastRunDatasetQuery
            },
            data: results[index] && results[index].data
        }));

        return <Visualization
                  series={series}
                  onChangeCardAndRun={navigateToNewCardInsideQB}
                  isEditing={true}
                  card={question.card()}
                  // Table:
                  {...props}
              />
    }
};

export default VisualizationResult;
