/* @flow */

import { isDate } from "metabase/lib/schema_metadata";

import PivotByAction from "./PivotByAction";

export default PivotByAction("时间", "clock", field => isDate(field));
