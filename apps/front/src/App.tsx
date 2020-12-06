import React, { FC, useState } from 'react';
import {GameBoard} from "./components";

import "./style.global.css"

export const App: FC = () => {
  const [isGameBoard, setIsGameBoard] = useState(false)

  return <>
    <button className="h-12 p-2 m-2 border border-blue-100 rounded" onClick={() => setIsGameBoard(prevState => !prevState)}>show board</button>
    { isGameBoard && <GameBoard /> }
  </>;
}
