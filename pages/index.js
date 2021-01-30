import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "styled-components";

const Button = styled.button`
  border: none;
  height: 25px;
`;

const Box = styled.div`
  padding: 20px;
`

const Row = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.p`
  margin: 0px;
`;

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
    console.log("boom", word);
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
        {!playing && (
          <div>
            <h2>build the Test</h2>
            <Button onClick={() => setPlaying(!playing)}>
              {playing ? "Stop Test" : "Start Testing"}
            </Button>
            <div>
              <input value={word} onChange={(e) => setWord(e.target.value)} />
              <button onClick={() => setWords([...words, word])}>
                Add Word
              </button>
            </div>
            {words.map((w) => (
              <Row key={w}>
                <Text>{w}</Text>
                <Button onClick={() => say(w)}>play</Button>
                <Button onClick={() => handleDelete(w)}>delete</Button>
              </Row>
            ))}
          </div>
        )}

        {playing && (
          <div>
            <Box>
              <button onClick={() => setPlaying(false)}>Stop Test</button>
              <button onClick={() => handleReset()}>Reset Test</button>
            </Box>
            {item ? (
              <button onClick={() => say(item.answer)}>Play Word</button>
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
