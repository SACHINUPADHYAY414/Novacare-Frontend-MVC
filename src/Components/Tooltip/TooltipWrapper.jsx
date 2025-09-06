import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function TooltipWrapper({ children, tooltipMessage, placement = "top" }) {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip
          id="tooltip"
        >
          {tooltipMessage}
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  );
}

export default TooltipWrapper;
