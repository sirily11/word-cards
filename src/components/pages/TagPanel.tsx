import React, { useContext } from "react";
import { HomePageContext } from "../models/HomeContext";
import { Grid } from "semantic-ui-react";
import { Chip } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5)
      }
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
    </div>
  );
}
