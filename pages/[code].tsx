import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import PageLayout from "../components/templates/PageLayout";
import Lobby from "../components/organisms/Lobby";
import NameEntry from "../components/organisms/NameEntry";
import GameLayout from "../components/templates/GameLayout";

const socket = socketIOClient();

export const Code = () => {
    const router = useRouter();
    const { code } = router.query;

    const [lobbyState, setLobbyState] = useState(initLobbyState());
    const {
        status,
        me,
        playerList,
        gameList,
        selectedGame,
        gameState,
    } = lobbyState;

    // only ran with initial value due to the []
    useEffect(() => {
        socket.open();

        socket.on("update", (newLobbyState) => setLobbyState(newLobbyState));
        socket.on("invalid-name", () => alert("Name already in use"));

        return () => {
            socket.close();
            setLobbyState(initLobbyState());
        };
    }, []);

    useEffect(() => {
        // "code" will be undefined during Automatic Static Optimization
        if (code) socket.emit("join-lobby", { code });

        socket.on("invalid-lobby", () => router.push("/join?invalid=" + code));
    }, [code]);

    const onNameEntry = (name) => {
        socket.emit("name", name);
        // TODO: store in cookie
    };

    const onGameSelect = (gameName: string) => {
        socket.emit("game-select", gameName);
    };

    const onStartGame = () => {
        socket.emit("game-start");
    };

    const showLoading = status === "loading";
    const showNameEntry = !showLoading && !me.name;
    const showLobby = !showLoading && !showNameEntry && status === "lobby";
    const showGame = !showLoading && !showNameEntry && status === "ingame";

    return (
        <>
            {!showGame && (
                <PageLayout path={code as string} loading={showLoading}>
                    <>
                        {showNameEntry && (
                            <NameEntry
                                onNameEntry={onNameEntry}
                                code={code}
                                socket={socket}
                            />
                        )}
                        {showLobby && (
                            <>
                                <Lobby
                                    playerList={playerList}
                                    gameList={gameList}
                                    onGameSelect={onGameSelect}
                                    selectedGame={selectedGame}
                                    onStartGame={onStartGame}
                                />
                                <div>{JSON.stringify(lobbyState)}</div>
                            </>
                        )}
                    </>
                </PageLayout>
            )}
            {showGame && <GameLayout gameState={gameState} />}
        </>
    );
};

const initLobbyState = () => ({
    status: "loading",
    playerList: [],
    gameList: [],
    me: { name: undefined },
    selectedGame: "",
    gameState: {},
});

export default Code;
