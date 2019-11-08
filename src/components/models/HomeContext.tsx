import React, { Component } from "react";
import { WordCards } from "./wordCards";

interface Node {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
}

interface HomePageContext {
  wordCard: WordCards;
  isSearch: boolean;
  switchMode(isSearch: boolean): void;
  handleSubmit(english: string, chinese: string): void;
  graph?: Node;
  message?: any;
}

interface HomePageProps {}

export class HomePageProvider extends Component<
  HomePageProps,
  HomePageContext
> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      wordCard: new WordCards(),
      isSearch: false,
      switchMode: this.switchMode,
      handleSubmit: this.handleSubmit
    };
  }

  async componentWillMount() {
    let wordCards = new WordCards();
    await wordCards.getDataFromDatabase();
    this.setState({ wordCard: wordCards });
  }

  switchMode = (newMode: boolean) => {
    this.setState({ isSearch: newMode });
  };

  handleSubmit = async (english: string, chinese: string) => {
    let { wordCard, isSearch } = this.state;
    if (isSearch) {
      if (chinese !== "") {
        let result = await wordCard.search(chinese);
        // link
        let l: { source: string; target: string }[] = [];
        let n: { id: string }[] = [];

        result.forEach(r => {
          r.words.forEach(w => {
            l.push({ source: r.chinese, target: w });
            n.push({ id: w });
          });
          n.push({ id: r.chinese });
        });

        let node: Node = {
          nodes: n,
          links: l
        };
        if (node.links.length === 0 || node.nodes.length === 0) {
          alert("No data");
          return;
        }
        this.setState({ graph: node });
      }
    } else {
      if (english !== "") {
        let result = await wordCard.add_new_word(english, chinese);
        this.setState({ message: result });
      }
    }
  };

  render() {
    return (
      <HomePageContext.Provider value={this.state}>
        {this.props.children}
      </HomePageContext.Provider>
    );
  }
}

const context: HomePageContext = {
  wordCard: new WordCards(),
  isSearch: false,
  switchMode: (mode: boolean) => {},
  handleSubmit: (english: string, chinese: string) => {}
};

export const HomePageContext = React.createContext(context);
