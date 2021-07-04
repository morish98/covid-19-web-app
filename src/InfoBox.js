import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

// TO DISPLAY THE THREE TYPES OF DATA

function InfoBox({ title, isRed, isGrey, active, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isGrey && "infoBox--grey"}`}
    >
      <CardContent>

        {/* TITLE */}

        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* NUMBER OF CASES */}

        <h2
          className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${
            isGrey && "infoBox__cases--grey"
          }`}
        >
          {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
        </h2>

        {/* TOTAL CASES */}

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
