/**
 * Copyright © 2026, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { PlayerScores } from "util/dataCatcherTypes";

type GameContextProps = {
	children: ReactNode;
};

type GameContextValues = Omit<GameContextProps, "children"> & {
	score: PlayerScores | undefined;
	setScore: Dispatch<SetStateAction<PlayerScores | undefined>>;
};

export const GameContext = createContext<GameContextValues>({} as GameContextValues);

const GameContextProvider: FC<GameContextProps> = ({ children }) => {
	const [score, setScore] = useState<PlayerScores | undefined>();

	return <GameContext.Provider value={{ score, setScore }}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
