import React from "react";
import NodeInfo from "../NodeInfo/NodeInfo";
import LatestMeasurement from "../latestMeasurement/LatestMeasurement";
import "./DashBoard.css";

export default function DashBoard ({ isOutside }) {

  return (
    <div>
      {isOutside ? (
        <div>
          <LatestMeasurement isOutside={true} />
        </div>
      ) : (
        <LatestMeasurement isOutside={false} />
      )}
      {isOutside ? (
        <div>
          <NodeInfo isOutside={true} />
        </div>
      ) : (
        <NodeInfo isOutside={false} />
      )}
    </div>
  );
};