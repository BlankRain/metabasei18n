import React from "react";

import DashCardCardParameterMapper from "../containers/DashCardCardParameterMapper.jsx";

const DashCardParameterMapper = ({ dashcard }) =>
    <div className="relative flex-full flex flex-column layout-centered">
        { dashcard.series && dashcard.series.length > 0 &&
            <div className="mx4 my1 p1 rounded" style={{ backgroundColor: "#F5F5F5", color: "#8691AC", marginTop: -10 }}>
                确定每个系列都有选取,否则这个卡片不能工作.
            </div>
        }
        <div className="flex mx4 z1" style={{ justifyContent: "space-around" }}>
            {[dashcard.card].concat(dashcard.series || []).map(card =>
                <DashCardCardParameterMapper key={`${dashcard.id},${card.id}`} dashcard={dashcard} card={card} />
            )}
        </div>
    </div>

export default DashCardParameterMapper;
