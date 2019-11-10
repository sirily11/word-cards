import React, { useContext } from "react";
import { HomePageContext } from "../../models/HomeContext";
import { Chip } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
// import AutoSizer from "react-virtualized-auto-sizer";
// import { FixedSizeList as List, VariableSizeGrid as Grid } from "react-window";
import { ColumnSizer, Grid, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

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
    },
    chip: {
      maxWidth: "130px",
      height: "30px",
      padding: 10
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
    update,
    english,
    chinese
  } = homeModel;

  const colPerRow = 3;
  let cw = wordCard.chineseWords.filter(c => c.includes(chinese));
  let ew = wordCard.englishWords.filter(e => e.includes(english));

  const renderComponent = (
    row: number,
    col: number,
    numberPerRow: number,
    style: any
  ): React.ReactElement => {
    let list = isSearch ? cw : ew;
    if (row * numberPerRow + col < list.length) {
      let item = list[row * numberPerRow + col];

      if (isSearch) {
        return (
          <div style={style}>
            <Chip
              label={item}
              key={item}
              className={classes.chip}
              color="secondary"
              onDelete={async () => {
                await wordCard.deleteByChinese(item);
                update(wordCard);
              }}
              onClick={async () => {
                handleSubmit("", item);
              }}
            ></Chip>
          </div>
        );
      } else {
        return (
          <div style={style}>
            <Chip
              label={item}
              key={item}
              color="secondary"
              className={classes.chip}
              onDelete={async () => {
                await wordCard.deleteByEnglish(item);
                update(wordCard);
              }}
              onClick={async () => {
                await handleEnglish(item);
              }}
            ></Chip>
          </div>
        );
      }
    }
    return <div></div>;
  };

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <ColumnSizer columnCount={colPerRow} width={width}>
            {({ adjustedWidth, columnWidth, registerChild }) => (
              <Grid
                style={{ overflowX: "hidden" }}
                height={height}
                columnWidth={columnWidth}
                columnCount={colPerRow}
                rowHeight={40}
                rowCount={
                  isSearch ? cw.length / colPerRow : ew.length / colPerRow
                }
                width={adjustedWidth}
                cellRenderer={({ columnIndex, key, rowIndex, style }) =>
                  renderComponent(rowIndex, columnIndex, colPerRow, style)
                }
              ></Grid>
            )}
          </ColumnSizer>
        );
      }}
    </AutoSizer>

    // <div className={classes.root}>

    //    {isSearch
    //   //   ? wordCard.chineseWords
    //   //       .filter(c => c.includes(chinese))
    //   //       .map(e => (
    //   //         <Chip
    //   //           label={e}
    //   //           key={e}
    //   //           color="secondary"
    //   //           onDelete={async () => {
    //   //             await wordCard.deleteByChinese(e);
    //   //             update(wordCard);
    //   //           }}
    //   //           onClick={async () => {
    //   //             handleSubmit("", e);
    //   //           }}
    //   //         ></Chip>
    //   //       ))
    //   //   : wordCard.englishWords
    //   //       .filter(e => e.includes(english))
    //   //       .map(e => (
    //   //         <Chip
    //   //           label={e}
    //   //           key={e}
    //   //           color="secondary"
    //   //           onDelete={async () => {
    //   //             await wordCard.deleteByEnglish(e);
    //   //             update(wordCard);
    //   //           }}
    //   //           onClick={async () => {
    //   //             await handleEnglish(e);
    //   //           }}
    //   //         ></Chip>
    //   //       ))}
    // </div>
  );
}
