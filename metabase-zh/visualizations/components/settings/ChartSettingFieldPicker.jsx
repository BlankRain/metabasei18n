import React from "react";

import Icon from "metabase/components/Icon";
import cx from "classnames";

import ChartSettingSelect from "./ChartSettingSelect.jsx";

const ChartSettingFieldPicker = ({ value, options, onChange, onRemove }) =>
    <div className="flex align-center">
        <ChartSettingSelect
            value={value}
            options={options}
            onChange={onChange}
            placeholder="选择一个字段"
            placeholderNoOptions="没有有效字段"
            isInitiallyOpen={value === undefined}
        />
        <Icon
            name="close"
            className={cx("ml1 text-grey-4 text-brand-hover cursor-pointer", {
                "disabled hidden": !onRemove
            })}
            width={12} height={12}
            onClick={onRemove}
        />
    </div>


export default ChartSettingFieldPicker;
