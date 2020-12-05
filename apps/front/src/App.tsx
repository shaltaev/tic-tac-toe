import React, { FC, useState } from 'react';
import {GamePage} from "./pages";

export const App: FC = () => {
  const [is888, setIs888] = useState(false)

  return <>
    <GamePage num={1}/>
    <GamePage num={777}/>
    <br/>
    <button onClick={() => setIs888(prevState => !prevState)}>888</button>
    <br/>
    { is888 && <GamePage num={888} /> }
  </>;
}
