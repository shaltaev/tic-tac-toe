import styles from './Board.module.css'

import {useBoard} from "../use/board";

export function Board() {
    const {map, handleClear, handleStep} = useBoard();

    return (
        <div className={styles.box}>
            <div className={styles.control}>
                <button className={styles.clear} onClick={handleClear}>Clear</button>
            </div>
            <div className={styles.board}>
                <ul className={styles.map}>
                    {map && map.map((field, idx) => (
                        <li key={idx} className={styles.cell}>
                            {field === 'None'
                                ? <button onClick={() => handleStep(idx)}>{field}</button>
                                : <>{field}</>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
