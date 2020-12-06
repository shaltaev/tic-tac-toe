import React, { FC, useState } from 'react';
import {TryConnect, GameBoard} from "./components";

import "./style.global.css"

export const App: FC = () => {
  const [is888, setIs888] = useState(false)
  const [isGameBoard, setIsGameBoard] = useState(false)

  return <>
    <TryConnect num={1}/>
    <TryConnect num={777}/>
    <button className="h-12 p-2 m-2 border border-blue-100 rounded" onClick={() => setIs888(prevState => !prevState)}> show 888</button>
    { is888 && <TryConnect num={888} /> }
    <button className="h-12 p-2 m-2 border border-blue-100 rounded" onClick={() => setIsGameBoard(prevState => !prevState)}>show board</button>
    { isGameBoard && <GameBoard /> }
  </>;
}
