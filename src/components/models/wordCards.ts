import nedb from "nedb";
// const translate = (window as any).require("google-translate-api")
import { setCORS } from "google-translate-api-browser";
import FileSaver, { saveAs } from 'file-saver';

export interface Word {
    words: string[];
    chinese: string;
}

export class WordCards {
    words: Word[];
    englishWords: string[];
    chineseWords: string[];
    db: Nedb<Word>

    constructor() {
        this.words = [];
        this.englishWords = [];
        this.chineseWords = []
        this.db = new nedb({ filename: "words.db", autoload: true });
    }

    /**
     * load data into memory. Call this when init
     */
    async getDataFromDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            // clear all
            this.englishWords = []
            this.chineseWords = []
            this.db.find<Word>({}, (err, docs) => {
                if (err) console.log(err);
                docs.forEach(d => {
                    this.chineseWords.push(d.chinese)
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
            this.db.findOne<Word>({ chinese: chinese }, (err, docs) => {
                console.log("Found one");
                // if found one
                if (docs) {
                    this.db.update<Word>(
                        { _id: (docs as any)._id },
                        { $addToSet: { words: english } },
                        {},
                        () => {
                            resolve({ english: english, chinese: chinese as string });
                        }
                    );
                } else {
                    this.db.insert<Word>(
                        { words: [english], chinese: chinese as string },
                        (err, docs) => {
                            if (err) console.log(err);
                            this.chineseWords.push(chinese as string)
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
            this.db.find<Word>({ chinese: { $regex: RegExp(chinese) } }, (err, data) => {
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
            this.db.find<Word>({ words: english }, (err, data) => {
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
            this.db.update<Word>(
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

    async deleteByChinese(chinese: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.remove(
                { chinese: chinese },
                async (err, numberOfUpdate) => {
                    console.log(numberOfUpdate);
                    if (err) {
                        console.log(err);
                        reject(false);
                    }
                    if (numberOfUpdate > 0) {
                        // refetch
                        await this.getDataFromDatabase()
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            );
        });
    }


    /**
     * Save database file to local
     * @param filename File name you want to save
     */
    async saveToLocal(filename: string) {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                let data = JSON.stringify(docs)
                FileSaver.saveAs(new File([data], "words.json", { type: "application/json;charset=utf-8" }))
                resolve()
            })
        })
    }

    /**
     * Load local file
     * @param file JSON data file
     */
    async loadLocalFile(file: File) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader()
            fileReader.onloadend = async (e) => {
                let content = fileReader.result
                let json: Word[] = JSON.parse(content as string)
                for (let w of json) {
                    await this.addLoc(w)
                    w.words.forEach((word) => {
                        if (!this.englishWords.includes(word)) {
                            this.englishWords.push(word)
                        }
                    })
                }
                resolve()
            }
            fileReader.readAsText(file)
        })
    }


    private async addLoc(w: Word) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: (w as any)._id }, w, { upsert: true }, (err, number, upsert) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                resolve()
            })
        })
    }


}
