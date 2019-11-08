import React, { useContext } from "react";
import { HomePageContext } from "../../models/HomeContext";
import { Grid } from "semantic-ui-react";
import { Chip } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      maxHeight: 400,
      overflowY: "auto",
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
    handleEnglish,
    update
  } = homeModel;
  return (
    <div className={classes.root}>
      {wordCard.englishWords.map(e => (
        <Chip
          label={e}
          key={e}
          color="secondary"
          onDelete={async ()=>{
            await wordCard.deleteByEnglish(e)
            update(wordCard)
          }}
          onClick={async () => {
            await handleEnglish(e);
          }}
        ></Chip>
      ))}
    </div>
  );
}
