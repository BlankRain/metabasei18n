/* @flow */

import { isAddress } from "metabase/lib/schema_metadata";

import PivotByAction from "./PivotByAction";

export default PivotByAction("位置", "location", field => isAddress(field));
