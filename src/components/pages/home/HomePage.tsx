import React, { useContext, useState } from "react";
import { Card } from "@material-ui/core";
import {
  Grid,
  Divider,
  Segment,
  Button,
  Radio,
  Form,
  Label,
  Input,
  Message,
  Icon
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { HomePageContext } from "../../models/HomeContext";
import TagPanel from "./TagPanel";
const { Graph } = require("react-d3-graph");

const myConfig = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  height: 400,
  highlightDegree: 1,
  highlightOpacity: 1,
  linkHighlightBehavior: false,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: false,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: false,
  width: window.innerWidth - 20,
  d3: {
    alphaTarget: 0.05,
    gravity: -100,
    linkLength: 100,
    linkStrength: 1
  },
  node: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 18,
    fontWeight: "normal",
    highlightColor: "SAME",
    highlightFontSize: 8,
    highlightFontWeight: "normal",
    highlightStrokeColor: "SAME",
    highlightStrokeWidth: "SAME",
    labelProperty: "id",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: true,
    size: 200,
    strokeColor: "none",
    strokeWidth: 1.5,
    svg: "",
    symbolType: "circle"
  },
  link: {
    color: "#d3d3d3",
    fontColor: "black",
    fontSize: 8,
    fontWeight: "normal",
    highlightColor: "#d3d3d3",
    highlightFontSize: 8,
    highlightFontWeight: "normal",
    labelProperty: "label",
    mouseCursor: "pointer",
    opacity: 1,
    renderLabel: false,
    semanticStrokeWidth: false,
    strokeWidth: 1.5,
    markerHeight: 6,
    markerWidth: 6
  }
};

export function HomePage() {
  const homeModel = useContext(HomePageContext);
  const {
    isSearch,
    handleSubmit,
    graph,
    message,
    wordCard,
    update
  } = homeModel;
  const [english, setEnglish] = useState("");
  const [chinese, setChinese] = useState("");
  let fileInput = React.createRef<HTMLInputElement>();

  return (
    <div style={{ marginLeft: 20, marginRight: 20 }} id="home">
      <h1>Word card</h1>
      <Grid.Row style={{ margin: 10 }}>
        <Radio
          style={{ margin: 10 }}
          toggle
          label={isSearch ? "Search mode" : "Add"}
          checked={homeModel.isSearch}
          onChange={(e, { checked }) => {
            homeModel.switchMode(checked as boolean);
          }}
        />

        <Button
          icon
          onClick={async () => {
            await wordCard.saveToLocal("Data.db");
          }}
        >
          <Icon name="download"></Icon>
        </Button>

        <Button
          icon
          onClick={() => {
            fileInput.current && fileInput.current.click();
          }}
        >
          <input
            ref={fileInput}
            type="file"
            style={{ display: "none" }}
            onChange={async e => {
              let file = e.target.files && e.target.files[0];
              if (file) {
                await wordCard.loadLocalFile(file);
                console.log("finished");
                update(wordCard);
              }
            }}
          />
          <Icon name="folder open"></Icon>
        </Button>
      </Grid.Row>

      {message && (
        <Message>
          <Message.Header>Add new word</Message.Header>
          <p>
            English: {message.english} and translation {message.chinese}
          </p>
        </Message>
      )}
      <Card style={{ marginLeft: 10, marginRight: 10 }}>
        <Segment placeholder>
          <Grid columns={2} relaxed="very">
            <Grid.Column>
              {!isSearch && (
                <Grid.Row style={{ marginBottom: 10 }}>
                  <Input
                    label="English"
                    fluid
                    value={english}
                    onChange={(e, { value }) => {
                      setEnglish(value);
                    }}
                  ></Input>
                </Grid.Row>
              )}
              <Grid.Row>
                <Input
                  label="Chinese"
                  fluid
                  value={chinese}
                  onChange={(e, { value }) => {
                    setChinese(value);
                  }}
                ></Input>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column>
              <TagPanel></TagPanel>
            </Grid.Column>
          </Grid>
          <Divider vertical>Or</Divider>
        </Segment>
      </Card>
      <Button
        style={{ marginLeft: 10, marginTop: 10 }}
        onClick={() => {
          handleSubmit(english, chinese);
          setEnglish("");
          setChinese("");
        }}
      >
        {isSearch ? "Search" : "Add"}
      </Button>
      {graph && <Graph id="graph-id" data={graph} config={myConfig}></Graph>}
    </div>
  );
}
