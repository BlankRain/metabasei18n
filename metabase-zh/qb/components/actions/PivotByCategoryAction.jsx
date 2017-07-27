/* @flow */

import { isCategory, isAddress } from "metabase/lib/schema_metadata";

import PivotByAction from "./PivotByAction";

export default PivotByAction(
    "分类",
    "label",
    field => isCategory(field) && !isAddress(field)
);
