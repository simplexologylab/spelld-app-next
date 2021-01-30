import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const initialWords = [
    "escorted",
    "swelled",
    "relied",
    "reputation",
    "worthy",
    "churning",
    "situation",
    "deserve",
    "defended",
    "satisfied",
  ];

  const [word, setWord] = useState("");
  const [words, setWords] = useState(initialWords);
  const [playing, setPlaying] = useState(false);

  const [entered, setEntered] = useState("");
  const [test, setTest] = useState(buildTest);
  const [item, setItem] = useState(getTestItem);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(gradeTest);

  useEffect(() => {
    setItem(getTestItem);
    setScore(gradeTest);
  }, [test]);

  useEffect(() => {
    setTest(buildTest);
  }, [playing]);

  useEffect(() => {
    let newTest = [];
    words.forEach((word, index) => {
      newTest.push({
        key: index,
        answer: word,
      });
    });
    setTest(newTest);
  }, [words]);

  function buildTest() {
    let newTest = [];
    words.forEach((word, index) => {
      newTest.push({
        key: index,
        answer: word,
      });
    });
    return newTest;
  }

  function getTestItem() {
    let testItems = test.filter((item) => {
      return !item.entered;
    });

    if (testItems.length === 0) {
      setDone(true);
    } else {
      return testItems[Math.floor(Math.random() * testItems.length)];
    }
  }

  function handleUpdate(e, id) {
    const newTest = [...test];
    setTest(
      newTest.map((el) => (el.key === id ? { ...el, entered: entered } : el))
    );
    setEntered("");
    e.preventDefault();
  }

  function gradeTest() {
    let score = 0;
    test.forEach((item) => {
      if (item.entered) {
        if (item.entered.trim().toUpperCase() === item.answer.toUpperCase()) {
          score++;
        }
      }
    });
    return score;
  }

  function handleReset() {
    setTest(buildTest);
    setDone(false);
  }

  function handleDelete(word) {
    console.log("boom", word)
    setWords(
      [...words].filter((w) => {
        return w !== word;
      })
    );
  }

  function say(message) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = message;
    window.speechSynthesis.speak(msg);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>spelld</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>spelld!</a>
        </h1>
        <div>
          <h2>build the Test</h2>
          <button onClick={() => setPlaying(!playing)}>
            {playing ? "Stop Test" : "Start Testing"}
          </button>
          <div>
            <input value={word} onChange={(e) => setWord(e.target.value)} />
            <button onClick={() => setWords([...words, word])}>Add Word</button>
          </div>
          {words.map(w => (
            <div id={w}>
              <p>{w}</p>
              <button onClick={() => say(w)}>play</button>
              <button onClick={() => handleDelete(w)}>delete</button>
            </div>
          ))}
        </div>

        {playing && (
          <div>
            <h2>the Test</h2>
            <button onClick={() => handleReset()}>Reset Test</button>
            {item ? (
              <button onClick={() => say(item.answer)}>
                Play Word: {item.answer}
              </button>
            ) : (
              <p>
                you're done! You're score is: {score} / {test.length}
              </p>
            )}
            <form
              onSubmit={(e) => handleUpdate(e, item.key)}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            >
              <input
                type="text"
                value={entered}
                name="studentAnswer"
                onChange={(e) => setEntered(e.target.value)}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <input type="submit" label="Submit" />
            </form>
            <p>
              Progress: {test.filter((item) => item.entered).length} /{" "}
              {test.length}
            </p>
            {done && <pre>{JSON.stringify(test, null, 2)}</pre>}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Designed by Colton</p>
      </footer>
    </div>
  );
}
