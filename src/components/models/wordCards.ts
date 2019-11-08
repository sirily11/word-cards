import nedb from "nedb";
// const translate = (window as any).require("google-translate-api")
import { setCORS } from "google-translate-api-browser";

export interface Word {
  words: string[];
  chinese: string;
}

export class WordCards {
  words: Word[];
  englishWords: string[];

  constructor() {
    this.words = [];
    this.englishWords = [];
  }

  /**
   * load data into memory. Call this when init
   */
  async getDataFromDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      let _,
        db = new nedb({ filename: "words.db", autoload: true });
      db.find<Word>({}, (err, docs) => {
        if (err) console.log(err);
        this.words = docs;
        docs.forEach(d => {
          d.words.forEach(w => {
            if (!this.englishWords.includes(w)) {
              this.englishWords.push(w);
            }
          });
        });
        resolve();
      });
    });
  }

  /**
   * Add new word to database
   * @param english English keyword
   * @param chinese Chinese translation. If null, then use google translate to get translation
   */
  async add_new_word(
    english: string,
    chinese: string | undefined
  ): Promise<{ english: string; chinese: string }> {
    return new Promise(async (resolve, reject) => {
      let _,
        db = new nedb({ filename: "words.db", autoload: true });

     /// If no chinese has been set, use google translate
     /// but will ask user if use the translation from google.
     /// If not, return and throw error.
      if (chinese === undefined || chinese === "") {
        const translate = setCORS("https://cors-anywhere.herokuapp.com/");
        let result = await translate(english, { to: "zh-CN" });
        let willUseGoogleTranslate = window.confirm(
          `Will you use translation ${(result as any).text}?`
        );
        if (willUseGoogleTranslate) {
          chinese = (result as any).text;
        } else {
          alert("No chinese for this word");
          return;
        }
      }
      if (!this.englishWords.includes(english)) this.englishWords.push(english);
      db.findOne<Word>({ chinese: chinese }, (err, docs) => {
        console.log("Found one");
        // if found one
        if (docs) {
          db.update(
            { _id: (docs as any)._id },
            { $addToSet: { words: english } },
            {},
            () => {
              resolve({ english: english, chinese: chinese as string });
            }
          );
        } else {
          db.insert<Word>(
            { words: [english], chinese: chinese as string },
            (err, docs) => {
              if (err) console.log(err);
              resolve({ english: english, chinese: chinese as string });
            }
          );
        }
      });
    });
  }

  /**
   * Search text based on keyword
   * @param chinese Chinese search keyword
   */
  async search(chinese: string): Promise<Word[]> {
    return new Promise((resolve, reject) => {
      let _,
        db = new nedb({ filename: "words.db", autoload: true });

      db.find<Word>({ chinese: { $regex: RegExp(chinese) } }, (err, data) => {
        if (err) console.log(err);
        resolve(data);
      });
    });
  }

  /**
   * Search text based on english
   * @param english Chinese search keyword
   */
  async searchByEnglish(english: string): Promise<Word[]> {
    return new Promise((resolve, reject) => {
      let _,
        db = new nedb({ filename: "words.db", autoload: true });

      db.find<Word>({ words: english }, (err, data) => {
        if (err) console.log(err);
        resolve(data);
      });
    });
  }

  /**
   * Delete word from database.
   * This will only delete the english word, but keep chinese
   * @param english English keyword
   */
  async deleteByEnglish(english: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let _,
        db = new nedb({ filename: "words.db", autoload: true });

      db.update<Word>(
        { words: english },
        { $pull: { words: english } },
        {},
        (err, numberOfUpdate) => {
          console.log(numberOfUpdate);
          if (err) {
            console.log(err);
            reject(false);
          }
          if (numberOfUpdate > 0) {
            this.englishWords.splice(this.englishWords.indexOf(english), 1);
            resolve(true);
          } else {
            reject(false);
          }
        }
      );
    });
  }
}
