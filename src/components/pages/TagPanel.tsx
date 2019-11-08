import React, { useContext } from "react";
import { HomePageContext } from "../models/HomeContext";
import { Grid } from "semantic-ui-react";
import {
  Chip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
      marginLeft: 10,
      marginRight: 10
    }
  })
);

export default function TagPanel() {
  const homeModel = useContext(HomePageContext);
  const classes = useStyles();

  const {
    isSearch,
    handleSubmit,
    graph,
    message,
    wordCard,
    handleEnglish
  } = homeModel;
  return (
    <div className={classes.root}>
      <ExpansionPanel style={{ width: "100%" }}>
        <ExpansionPanelSummary>
          <h3>Words</h3>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {wordCard.englishWords.map(e => (
            <Chip
              label={e}
              key={e}
              color="secondary"
              onClick={() => {
                handleEnglish(e);
              }}
            ></Chip>
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
