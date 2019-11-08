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
  Message
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { HomePageContext } from "../models/HomeContext";
import TagPanel from "./TagPanel";
const { Graph } = require("react-d3-graph");

export function HomePage() {
  const homeModel = useContext(HomePageContext);
  const { isSearch, handleSubmit, graph, message } = homeModel;
  const [english, setEnglish] = useState("");
  const [chinese, setChinese] = useState("");

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

  return (
    <div style={{ marginLeft: 20, marginRight: 20 }} id="home">
      <h1>Word card</h1>
      <Radio
        style={{ margin: 10 }}
        toggle
        label={isSearch ? "Search mode" : "Add"}
        checked={homeModel.isSearch}
        onChange={(e, { checked }) => {
          homeModel.switchMode(checked as boolean);
        }}
      />
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
            {!isSearch && (
              <Grid.Column>
                <Label>English</Label>
                <Input
                  fluid
                  value={english}
                  onChange={(e, { value }) => {
                    setEnglish(value);
                  }}
                ></Input>
              </Grid.Column>
            )}
            <Grid.Column>
              <Label>Chinese</Label>
              <Input
                fluid
                value={chinese}
                onChange={(e, { value }) => {
                  setChinese(value);
                }}
              ></Input>
            </Grid.Column>
          </Grid>
          <Divider vertical>Or</Divider>
        </Segment>
      </Card>

      <TagPanel></TagPanel>

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
