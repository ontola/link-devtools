import React from "react";

export const TabPanel = ({ children, index, value, ...other }) => (
  <div
    id={`main-tabpanel-${index}`}
    hidden={value !== index}
    role="tabpanel"
    {...other}
  >
    {children}
  </div>
)
