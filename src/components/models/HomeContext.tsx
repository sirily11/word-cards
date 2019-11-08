import React, { Component } from "react";
import { WordCards, Word } from "./wordCards";

interface Node {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
}

interface HomePageContext {
  wordCard: WordCards;
  isSearch: boolean;
  switchMode(isSearch: boolean): void;
  handleSubmit(english: string, chinese: string): void;
  handleEnglish(english: string): void;
  update(word: WordCards): void
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
      handleSubmit: this.handleSubmit,
      handleEnglish: this.handleEnglish,
      update: this.update
    };
  }

  // async componentWillMount() {
  //   let wordCards = new WordCards();
  //   // await wordCards.getDataFromDatabase();
  //   this.setState({ wordCard: wordCards });
  // }

  switchMode = (newMode: boolean) => {
    this.setState({ isSearch: newMode });
  };

  private constructGraph = (words: Word[]): Node => {
    let l: { source: string; target: string }[] = [];
    let n: { id: string }[] = [];

    words.forEach(r => {
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
    return node;
  };

  handleSubmit = async (english: string, chinese: string) => {
    let { wordCard, isSearch } = this.state;
    if (isSearch) {
      if (chinese !== "") {
        let result = await wordCard.search(chinese);
        // link
        let node = this.constructGraph(result);
        if (node.links.length === 0 || node.nodes.length === 0) {
          alert("No data");
          return;
        }
        this.setState({ graph: node });
      }
    } else {
      if (english !== "") {
        let result = await wordCard.add_new_word(english, chinese);
        let wordResult = await wordCard.searchByEnglish(english)
        let node = this.constructGraph(wordResult)
        this.setState({ message: result, wordCard, graph: node });
      }
    }
  };

  /**
   * When user click on the tags
   */
  handleEnglish = async (english: string) => {
    let { wordCard } = this.state;
    let results = await wordCard.searchByEnglish(english);
    let node = this.constructGraph(results);
    if (node.links.length === 0 || node.nodes.length === 0) {
      alert("No data");
      return;
    }
    this.setState({ graph: node });
  };

  update = (word: WordCards) =>{
    this.setState({wordCard: word})
  }

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
  handleSubmit: (english: string, chinese: string) => {},
  handleEnglish: (english: string) => {},
  update: (word: WordCards) =>{}
};

export const HomePageContext = React.createContext(context);
