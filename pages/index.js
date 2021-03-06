import { useState, useEffect } from "react";

import styles from "../styles/Home.module.css";
import styled from "styled-components";

import Grader from "../components/grader";

const Button = styled.button`
  border: 2px solid #1d6cd2;
  border-radius: 18px;
  background: transparent;
  padding: 4px 22px;
  font-size: 1.1rem;
  margin: 4px;
`;

const InputButton = styled.input`
  border: 2px solid #1d6cd2;
  border-radius: 18px;
  background: transparent;
  padding: 4px 22px;
  font-size: 1.1rem;
  margin: 4px;
`;

const TestButton = styled(Button)`
  background: #1d6cd2;
  color: white;
  align-items: center;
  justify-item: ;
`;

const Box = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const HeaderText = styled.div`
  margin: 4px;
`;

const H2 = styled.h2`
  margin: 0px;
  text-align: end;
  color: #1d6cd2;
  font-size: 2.2rem;
  font-family: "Kalam";
`;

const Input = styled.input`
  margin: 10px;
  padding: 11px;
  border: 1px solid gray;
  border-radius: 4px;
  background: transparent;
  font-size: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
`;

const Text = styled.p`
  margin: 0px;
  font-size: 1.2rem;
`;

export default function Home() {
  const initialWords = [
    "display",
    "alert",
    "weariness",
    "fractured",
    "standards",
    "vision",
    "huddle",
    "graceful",
    "stranded",
    "concluded",
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
    setWords(initialWords);
    setDone(false);
  }

  function handleDelete(word) {
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
      <main className={styles.main}>
        <Header>
          <HeaderText>
            <h3 style={{ margin: 0 }}>Welcome to</h3>
            <H2>spelld</H2>
          </HeaderText>
          <img src="/logo.png" alt="Logo" width={50} height={50} />
        </Header>
        {!playing && (
          <Box>
            <TestButton onClick={() => setPlaying(!playing)}>
              {playing ? "Stop Test" : "Start Testing"}
            </TestButton>
            <Button onClick={() => handleReset()}>Reset</Button>
            <div>
              <Input value={word} onChange={(e) => setWord(e.target.value)} />
              <Button onClick={() => setWords([...words, word])}>
                Add Word
              </Button>
            </div>
            {words.map((w) => (
              <Row key={w}>
                <Text>{w}</Text>
                <div>
                  <Button onClick={() => say(w)}>▶️</Button>
                  <Button onClick={() => handleDelete(w)}>🗑️</Button>
                </div>
              </Row>
            ))}
          </Box>
        )}

        {playing && (
          <div>
            <Box>
              <TestButton onClick={() => setPlaying(false)}>
                Stop Test
              </TestButton>
              <Button onClick={() => handleReset()}>Reset Test</Button>
            </Box>
            {item ? (
              <>
                <Button onClick={() => say(item.answer)}>
                  ▶️{"  "} Play Word
                </Button>

                <form
                  onSubmit={(e) => handleUpdate(e, item.key)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                >
                  <Input
                    type="text"
                    value={entered}
                    name="studentAnswer"
                    onChange={(e) => setEntered(e.target.value)}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <InputButton type="submit" label="Submit" />
                </form>
                <p>
                  Progress: {test.filter((item) => item.entered).length} /{" "}
                  {test.length}
                </p>
              </>
            ) : (
              <p>
                You're done! You're score is: {score} / {test.length}
                <Grader score={(score / test.length) * 100} />
                <pre>{JSON.stringify(test, null, 2)}</pre>
              </p>
            )}

          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Designed by Colton</p>
      </footer>
    </div>
  );
}
