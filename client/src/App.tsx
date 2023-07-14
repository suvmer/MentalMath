import React, { ChangeEvent, useState } from 'react';
import './App.css';

const TASKS_COUNT = 10;
function App() {
  const [answer, setAnswer] = useState("");
  const generateTasks = () : number[][] => {
    const res:number[][] = Array(TASKS_COUNT).fill(0).map((el, ind) => {
      const numberLength = ((ind/2)|0) + 1;
      return [(Math.random()*Math.pow(10, numberLength))|0, (Math.random()*Math.pow(10, numberLength))|0, (Math.random()*2)|0];
    });
    return res;
  };
  const [tasks, setTasks] = useState([...generateTasks(), [0, 0, 0, 0]]);
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(Date.now());
  const [tip, setTip] = useState("Подсказка");
  const [solveTime, setSolveTime] = useState(Array(TASKS_COUNT).fill(0));
  

  const doubleWidth = (num:number) : string => //example: 5 => 05
    "0".repeat(Math.max(0, 2 - num.toString().length)) + num.toString();

  const resetGame = () : void => {
    setTasks(generateTasks);
    setStep(0);
    setLoaded(Date.now())
  }
  const conversion:string = `${tasks[step][0]} ${['+', '-'][tasks[step][2]]} ${tasks[step][1]}`;
  const correct:number = tasks[step][0] + [1, -1][tasks[step][2]]*tasks[step][1];

  const checkAnsw = (text:string) : void => {
    if(parseInt(text) === correct) {
      setSolveTime(solveTime.map((el, ind) => ind === step ? Date.now() : el));
      setStep(step+1);
      setAnswer("");
      setTip("Подсказка");
    } else {
      setAnswer(text);
    }
  };

  return (
    <>
      <header>
        <a href="/">Math trainer</a>
      </header>
      {step !== TASKS_COUNT ?
      <div className="task">
        <p className="task__title">{conversion} = ?</p>
        <input onChange={(e:ChangeEvent<HTMLInputElement>) => checkAnsw(e.target.value)} value={answer}/>
        <div onClick={() => setTip((correct).toString())} className='button'>{tip}</div>
        <div className='score'>Очков: {step}</div>
      </div>
      :
      <div className='result'>
        Вы верно решили {TASKS_COUNT}/{TASKS_COUNT} примеров:
        {[...tasks].slice(0, -1).map((el, ind) => [...el, (((solveTime[ind] - (ind === 0 ? loaded : solveTime[ind-1]))/1000)|0)]).sort((a, b) => a[3] - b[3]).map((el, ind) => {//sort by time spent
          const task:string = `${el[0]} ${['+', '-'][el[2]]} ${el[1]} = ${el[0] + [1, -1][el[2]]*el[1]}`;
          return <div key={ind} className='result__item'><mark className='result__time'>{doubleWidth((el[3]/60)|0)}:{doubleWidth(el[3]%60)}</mark> {task}</div>
        }
        )}
        <div onClick={() => resetGame()} className='button button_offset'>Начать сначала</div>
      </div>
      }
    </>
  );
}

export default App;
