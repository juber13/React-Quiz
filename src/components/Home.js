
import React, { useState, useEffect } from 'react';
import '../App.css';
const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(5); 
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  async function fetchQuestions() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10');
      const data = await response.json();
      setQuestions(
        data.results.map((question, index) => ({
          id: index,
          question: question.question,
          correct_answer: question.correct_answer,
          options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
        }))
      );
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(interval);
        handleNextQuestion();
      }
    }, 1000); 

    return () => clearInterval(interval);
     
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const handleSelectAnswer = (selectedAnswer) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer });
    clearInterval(timer);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(5); 
    } else {
      const userScore = calculateScore();
      setScore(userScore);
      setQuizCompleted(true);
      setCurrentQuestion(-1); 
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(5);
    } else {
      handleNextQuestion();
    }
  };

  const calculateScore = () => {
    let userScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        userScore++;
      }
    });
    return userScore;
  };

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
    setUserAnswers({});
    setScore(0);
    setCurrentQuestion(0);
  };

  const scoreDisplay = () => {
    if(score === 0) return score + "😢";
    else if(score <= 3 && score > 0) return + score + "😒"
    else if(score <= 8 && score > 3) return + score + "😐"
    else return + score + "🫡"
  }

  return (
   
    <div className='quizContainer'>
      {questions.length === 0 ? (
        <h2 className='loding'>Loading...</h2>
      ) : (
        <>
          {quizCompleted ? (
            <div className='resultContainer'>
              <p className='score'>Your final score is: {scoreDisplay()}</p>
              <button className='retake' onClick={handleRetakeQuiz}>Retake Quiz</button>
            </div>
          ) : (
            <div className='questionContainer' key={currentQuestion}>
              <p className='leftTime'>Time left: {timer} seconds</p>
              <p>Question {currentQuestion + 1}</p>
              <small>{questions[currentQuestion].question}</small>
               <div className="options-container"> 
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    className="option-button" 
                    onClick={() => handleSelectAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button className='skip' onClick={handleSkipQuestion}>Skip</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

