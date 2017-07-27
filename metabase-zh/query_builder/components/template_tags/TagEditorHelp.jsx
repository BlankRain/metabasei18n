import React from "react";

import Code from "metabase/components/Code.jsx";

const EXAMPLES = {
    variable: {
        database: null,
        type: "native",
        native: {
            query: "SELECT count(*)\nFROM products\nWHERE category = {{category}}",
            template_tags: {
                "category": { name: "category", display_name: "分类", type: "text", required: true, default: "Widget" }
            }
        },

    },
    dimension: {
        database: null,
        type: "native",
        native: {
            query: "SELECT count(*)\nFROM products\nWHERE {{created_at}}",
            template_tags: {
                "created_at": { name: "created_at", display_name: "创建于", type: "dimension", dimension: null }
            }
        }
    },
    optional: {
        database: null,
        type: "native",
        native: {
            query: "SELECT count(*)\nFROM products\n[[WHERE category = {{category}}]]",
            template_tags: {
                "category": { name: "category", display_name: "分类", type: "text", required: false }
            }
        }
    },
    multipleOptional: {
        database: null,
        type: "native",
        native: {
            query: "SELECT count(*)\nFROM products\nWHERE 1=1\n  [[AND id = {{id}}]]\n  [[AND category = {{category}}]]",
            template_tags: {
                "id": { name: "id", display_name: "ID", type: "number", required: false },
                "category": { name: "category", display_name:"分类", type: "text", required: false }
            }
        }
    },
}


const TagExample = ({ datasetQuery, setDatasetQuery }) =>
    <div>
        <h5>举个例子:</h5>
        <p>
            <Code>{datasetQuery.native.query}</Code>
            { setDatasetQuery && (
                <div
                    className="Button Button--small"
                    data-metabase-event="QueryBuilder;Template Tag Example Query Used"
                    onClick={() => setDatasetQuery(datasetQuery, true) }
                >
                    试试这个
                </div>
            )}
        </p>
    </div>

const TagEditorHelp = ({ setDatasetQuery, sampleDatasetId }) => {
    let setQueryWithSampleDatasetId = null;
    if (sampleDatasetId != null) {
        setQueryWithSampleDatasetId = (dataset_query, run) => {
            setDatasetQuery({
                ...dataset_query,
                database: sampleDatasetId
            }, run);
        }
    }
    return (
        <div>
            <h4>这个是干嘛的?</h4>
            <p>
                变量在本地查询中,可以让你动态替换你查询条件中的值.
            </p>

            <h4>变量</h4>
            <p>
                <Code>{"{{variable_name}}"}</Code> 在SQL模板里创建了一个变量叫 "variable_name".
                变量可以有类型. 所有的除了“dimension”类型的变量,都会触发过滤组件的过滤功能.
                当过滤组件填充后,就会替换SQL模板的变量值.
            </p>
            <TagExample datasetQuery={EXAMPLES.variable} setDatasetQuery={setQueryWithSampleDatasetId} />

            <h4>尺寸</h4>
            <p>
                给定一个变量 "dimension"类型 ,允许你链接SQL卡片到bashboard过滤组件.
                一个"dimension" 变量插入SQL，类似GUI查询构建器给一个已知列添加过滤一样.
                当添加一个 dimension,你应该链接这个变量到一个特定的列.Dimensions应该用在 where查询的内部.
            </p>
            <TagExample datasetQuery={EXAMPLES.dimension} />

            <h4>可选条件</h4>
            <p>
                <Code>{"[[brackets around a {{variable}}]]"}</Code> 在模板中创建可选条件.
                如果变量设置,可选条件会被应用.
                如果没有,可选条件就会被忽略.
            </p>
            <TagExample datasetQuery={EXAMPLES.optional} setDatasetQuery={setQueryWithSampleDatasetId} />

            <p>
                使用多个可选条件,你可以先添加一个非可选的where条件, 然后 紧跟着 以"and"开始的可选条件.
            </p>
            <TagExample datasetQuery={EXAMPLES.multipleOptional} setDatasetQuery={setQueryWithSampleDatasetId} />

            <p>
                <a href="http://www.metabase.com/docs/latest/users-guide/start" target="_blank" data-metabase-event="QueryBuilder;Template Tag Documentation Click">查看完整文档</a>
            </p>
        </div>
    )
}

export default TagEditorHelp;
