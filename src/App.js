import { useState } from "react";
import Answers from "./Answers";
import questions from "./Apprentice_TandemFor400_Data";
import { randomize } from "./utils";
import "./css/app.css";

const App = () => {
  // Take questions input and randomly pick an array of ten questions
  const [questionsArray, setQuestionsArray] = useState(() =>
    // creates an array of inedices the length of the given questions array input and randomizes the indecies
    randomize(Array.from(Array(questions.length).keys()))
      // grabs the first ten random questions
      .slice(0, 10)
      // maps the indecies to questions in the input questions array
      .map((num) => {
        let question = questions[num];
        // adds an answers array with randomized answer objects
        question.answers = randomize([
          // incorrect answers
          ...question.incorrect.map((answer) => {
            return { correct: false, answer };
          }),
          // correct answer
          { correct: true, answer: question.correct },
        ]);
        return question;
      })
  );
  // Keep track of score
  const [score, setScore] = useState(() => 0);
  // Keep track of the value of the clicked button
  const [value, setValue] = useState(() => "");
  // Disable answering a question after giving an answer
  const [disabled, setDisabled] = useState(() => false);
  // Keep track of what question to render
  const [questionIndex, setQuestionIndex] = useState(() => 0);
  // Set a message to show the user after they answer the question
  const [message, setMessage] = useState(() => ({ message: "", color: "" }));
  // Extract the current question using the index
  const [currentQuestion, setCurrentQuestion] = useState(
    () => questionsArray[questionIndex]
  );
  // Keep track od when the game is over
  const [gameOver, setGameOver] = useState(() => false);

  // Click handler for clicking an answer
  const handleAnswerClick = (e) => {
    // Disables the answer buttons
    setDisabled(true);
    // If correct, sets the message to a succes message and increments the score
    if (e.target.value === "true") {
      setMessage({ message: "Correct, good job!", color: "green" });
      setScore((num) => num + 1);
      // If incorrect sets a failure message
    } else {
      setMessage({
        message: `Wrong answer, better luck next time, the right answer is: ${currentQuestion.correct}`,
        color: "red",
      });
    }
    // Sets the values of the answer to keep the input field controlled
    setValue(e.target.name);
    // Increment the index for the current question
    setQuestionIndex((num) => num + 1);
  };

  // After the user clicks an answer they need to click the next button
  const handleNextClick = () => {
    // If it's not the last question, set the current question with the incremented index, enable the buttons and clear the message
    if (questionIndex < 9) {
      setCurrentQuestion(() => questionsArray[questionIndex]);
      setDisabled(false);
      // If it's the last question set the game mode to game over and display the game over modal
    } else {
      setGameOver(true);
    }
    setMessage({ message: "", color: "" });
  };

  // Click handler to restart the game with a new questions array
  const handleRestartClick = () => {
    setQuestionsArray(() =>
      randomize(Array.from(Array(21).keys()))
        .slice(0, 10)
        .map((num) => {
          let question = questions[num];
          question.answers = randomize([
            ...question.incorrect.map((answer) => {
              return { correct: false, answer };
            }),
            { correct: true, answer: question.correct },
          ]);
          return question;
        })
    );
    setScore(0);
    setValue("");
    setDisabled(false);
    setQuestionIndex(0);
    setCurrentQuestion(questionsArray[questionIndex]);
    setGameOver(false);
  };

  return (
    <>
      <div className="game-container">
        <div className="score">Score: {score}</div>
        <div className="game-header">
          <h1>Welcome to Trivia Practice</h1>
          <h3>Answer the questions by clicking the right answer</h3>
        </div>
        <div className="question-container">
          <div>{currentQuestion.question}</div>
          <Answers
            answers={currentQuestion.answers}
            disabled={disabled}
            value={value}
            handleClick={handleAnswerClick}
          />
        </div>
        <div className="message-container">
          <div className={`${message.color}`}>{message.message}</div>
          <button onClick={handleNextClick} disabled={!disabled}>Next</button>
        </div>
      </div>
      {gameOver && (
        <>
          <div className="blackout"></div>
          <div className="modal">
            <h1>Game over </h1>
            <h2>Your score is: {score}</h2>
            <button onClick={handleRestartClick}>Keep practicing</button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
