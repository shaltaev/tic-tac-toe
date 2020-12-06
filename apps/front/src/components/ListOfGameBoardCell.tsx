import React, {FC} from "react";

import {TicTacMap} from "../models";
import {Cell} from "./GameBoardCell";

export const ListOfCell: FC<{ map: TicTacMap }> = ({map}) => (
    <>
        {map.map((cell, idx) => {
            return <Cell key={idx} cell={cell} field={idx}/>;
        })}
    </>
)
