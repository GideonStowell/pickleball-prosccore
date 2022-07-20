import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";
import {
  SIDEOUT,
  POINT,
  CHANGE_SERVER,
  gameGraph,
} from "../services/game_graph";

const TEAM_A_ID = "A";
const TEAM_B_ID = "B";
const FIRST_SERVER = 1;
const SECOND_SERVER = 2;
const GREEN_HIGHLIGHT = "#4aba68";
const GREEN_BORDER = "#28803f";
const SCORE_CAPS = [11, 15, 21];

// Game graph represents the plays in the game
const game = new gameGraph();

export default function Home() {
  const [teamAScore, setTeamAScore] = React.useState(0);
  const [teamBScore, setTeamBScore] = React.useState(0);
  const [servingTeamScore, setServingTeamScore] = React.useState(0);
  const [servingTeam, setServingTeam] = React.useState(TEAM_A_ID);
  const [receivingTeamScore, setReceivingTeamScore] = React.useState(0);
  const [serverNumber, setServerNumber] = React.useState(SECOND_SERVER);
  const [gameScoreCap, setGameScoreCap] = React.useState(11);

  const checkIfGameIsOver = score => {
    // Rules are:
    // if the servingTeamScore is greater than or equal to cap score
    // AND
    // (newscore - other team score) is greater than or equal to 2
    const difference = score - receivingTeamScore;
    if (score >= gameScoreCap && difference >= 2) {
      setTimeout(() => {
        alert(
          `Game over!\nTeam ${servingTeam} has won, ${
            servingTeamScore + 1
          }-${receivingTeamScore}`
        );
      }, 1);
    }
  };

  const addPoint = () => {
    // console.log("Add point");
    game.point();
    let newScore = servingTeamScore + 1;
    setScore(newScore);
    checkIfGameIsOver(newScore);
  };

  const setScore = score => {
    setServingTeamScore(score);
    switch (servingTeam) {
      case TEAM_A_ID:
        // console.log("Inc team A");
        setTeamAScore(score);
        break;
      case TEAM_B_ID:
        // console.log("Inc team B");
        setTeamBScore(score);
        break;
      default:
        break;
    }
  };

  const sideOut = () => {
    // Switch the serving team
    // Switch their scores on the scoreboard
    // Set server to number 1
    // update game object
    setServerNumber(FIRST_SERVER);
    switchDisplayedScores();
  };

  const switchDisplayedScores = () => {
    switch (servingTeam) {
      case TEAM_A_ID:
        // console.log("Switch to B");
        setServingTeamScore(teamBScore);
        setReceivingTeamScore(teamAScore);
        setServingTeam(TEAM_B_ID);
        break;
      case TEAM_B_ID:
        // console.log("Switch to A");
        setServingTeamScore(teamAScore);
        setReceivingTeamScore(teamBScore);
        setServingTeam(TEAM_A_ID);
        break;
      default:
        break;
    }
  };

  const changeServer = () => {
    // Logic for when we change server or sideout (aka error by serving team)
    switch (serverNumber) {
      case FIRST_SERVER:
        game.changeServer();
        setServerNumber(SECOND_SERVER);
        break;
      case SECOND_SERVER:
        game.sideout();
        sideOut();
        break;
      default:
        console.error("Unknown state in changeServer()");
        break;
    }
  };

  const undoLast = () => {
    // For when you accidently click something you shouldn't have
    const last_move =
      game.data.length > 0 ? Object.keys(game.undo())[0] : undefined;

    switch (last_move) {
      case SIDEOUT:
        // To undo a sideout we can just force another sideout
        setServerNumber(SECOND_SERVER);
        switchDisplayedScores();
        break;
      case CHANGE_SERVER:
        // To undo a changed server just set the server back to server 1
        setServerNumber(FIRST_SERVER);
        break;
      case POINT:
        // Undo a point by subtracting a point from the serving team
        console.log("undo");

        setScore(servingTeamScore - 1);
        break;
      default:
        // Game state returns anythign else don't do anything
        console.log("Nothing to undo");
        break;
    }
  };

  const resetGame = () => {
    // Reset the game to the initial starting postions
    setTeamBScore(0);
    setTeamAScore(0);
    setServingTeamScore(0);
    setReceivingTeamScore(0);
    setServingTeam(TEAM_A_ID);
    setServerNumber(SECOND_SERVER);
    game.reset();
  };
  const BUTTON_CONFIGS = [
    { text: "Point", onClick: addPoint, other: "hi" },
    {
      text: serverNumber == FIRST_SERVER ? "Change Server" : "Sideout",
      onClick: changeServer,
      other: "help",
    },
    { text: "Undo Last", onClick: undoLast, other: "Hi" },
    { text: "Reset Game", onClick: resetGame, other: "help" },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Pickleball Proscore Webapp</title>
        <meta
          name="description"
          content="Webapp to track pickleball game scores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pickleball Proscore</h1>

        <div className={styles.description}>
          <div className={styles.scoreboard}>
            {SCORE_CAPS.map((item, i) => (
              <button
                key={i}
                style={{
                  backgroundColor:
                    gameScoreCap == item ? GREEN_HIGHLIGHT : null,
                  borderColor: gameScoreCap == item ? GREEN_BORDER : null,
                }}
                value={item}
                className={styles.button}
                onClick={() => setGameScoreCap(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <h2>
            {servingTeamScore} - {receivingTeamScore} - {serverNumber}
          </h2>

          {BUTTON_CONFIGS.map((item, i) => (
            <div key={i} className={styles.scoreboard}>
              <button className={styles.button} onClick={() => item.onClick()}>
                {item.text}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.grid}>
          <a
            className={styles.card}
            style={{
              backgroundColor:
                servingTeam == TEAM_A_ID ? GREEN_HIGHLIGHT : null,
              borderColor: servingTeam == TEAM_A_ID ? GREEN_BORDER : null,
            }}
          >
            <h2>Team A: {teamAScore}</h2>
            <p>{servingTeam == TEAM_A_ID ? "Serving" : ""}</p>
          </a>

          <a
            className={styles.card}
            style={{
              backgroundColor:
                servingTeam == TEAM_B_ID ? GREEN_HIGHLIGHT : null,
              borderColor: servingTeam == TEAM_B_ID ? GREEN_BORDER : null,
            }}
          >
            <h2>Team B: {teamBScore}</h2>
            <p>{servingTeam == TEAM_B_ID ? "Serving" : ""}</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://usapickleball.org/what-is-pickleball/official-rules/rules-summary/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pickleball Scoring Rules via USA Pickleball{" "}
        </a>
      </footer>
    </div>
  );
}
