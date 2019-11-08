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
const { Graph } = require("react-d3-graph");

export function HomePage() {
  const homeModel = useContext(HomePageContext);
  const { isSearch, handleSubmit, graph, message } = homeModel;
  const [english, setEnglish] = useState("");
  const [chinese, setChinese] = useState("");

  const myConfig = {
    nodeHighlightBehavior: true,
    width: window.innerWidth - 20,
    node: {
      color: "lightgreen",
      size: 300,
      fontSize: 15,
      highlightStrokeColor: "blue"
    },
    link: {
      highlightColor: "lightblue"
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
