import React from "react";
import "./css/answers.css";

const Answers = ({ answers, disabled, value, handleClick }) => (
  <div className="answers-container">
    {answers.map((answer) => (
      <div>
        <input
          type="radio"
          value={answer.correct}
          name={answer.answer}
          checked={value === answer.answer}
          onClick={handleClick}
          disabled={disabled}
        />
        {answer.answer}
      </div>
    ))}
  </div>
);

export default Answers;
