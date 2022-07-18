import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React from "react";

const TEAM_A_ID = "A";
const TEAM_B_ID = "B";
const FIRST_SERVER = 1;
const SECOND_SERVER = 2;
const GREEN_HIGHLIGHT = "#4aba68";
const GREEN_BORDER = "#28803f";

// Build the actions that will get recorded into the historical graph
const SIDEOUT = "sideout";
const CHANGE_SERVER = "change_server";
const POINT = "point";

export default function Home() {
  const [teamAScore, setTeamAScore] = React.useState(0);
  const [teamBScore, setTeamBScore] = React.useState(0);
  const [servingTeamScore, setServingTeamScore] = React.useState(0);
  const [servingTeam, setServingTeam] = React.useState(TEAM_A_ID);
  const [receivingTeamScore, setReceivingTeamScore] = React.useState(0);
  const [serverNumber, setServerNumber] = React.useState(SECOND_SERVER);

  const addPoint = () => {
    console.log("Add point");
    let newScore = servingTeamScore + 1;
    setServingTeamScore(newScore);
    switch (servingTeam) {
      case TEAM_A_ID:
        console.log("Inc team A");
        setTeamAScore(newScore);
        break;
      case TEAM_B_ID:
        console.log("Inc team B");
        setTeamBScore(newScore);
        break;
      default:
        break;
    }
  };

  const sideOut = () => {
    // Switch the serving team
    // Switch their scores on the scoreboard
    // Set server to number 1
    setServerNumber(FIRST_SERVER);

    switch (servingTeam) {
      case TEAM_A_ID:
        console.log("Switch to B");
        setServingTeamScore(teamBScore);
        setReceivingTeamScore(teamAScore);
        setServingTeam(TEAM_B_ID);
        break;
      case TEAM_B_ID:
        console.log("Switch to A");
        setServingTeamScore(teamAScore);
        setReceivingTeamScore(teamBScore);
        setServingTeam(TEAM_A_ID);
        break;
      default:
        break;
    }
  };

  const changeServer = () => {
    // Logic for when we change server or sideout (aka error by servering team)
    switch (serverNumber) {
      case FIRST_SERVER:
        setServerNumber(SECOND_SERVER);
        break;
      case SECOND_SERVER:
        sideOut();
        break;
      default:
        console.error("Unknown state in changeServer()");
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
  };

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
          <h2>
            {servingTeamScore} - {receivingTeamScore} - {serverNumber}
          </h2>

          <div className={styles.scoreboard}>
            <button className={styles.button} onClick={() => addPoint()}>
              Point
            </button>
          </div>
          <div className={styles.scoreboard}>
            <button className={styles.button} onClick={() => changeServer()}>
            {serverNumber == FIRST_SERVER ? `Change server` : `Sideout`}
          </button>
          </div>
          <div className={styles.scoreboard}>
            <button disabled className={styles.button}>
              Undo Last
            </button>
          </div>
          <div className={styles.scoreboard}>
            <button className={styles.button} onClick={() => resetGame()}>
              Reset Game
            </button>
          </div>
        </div>
        <div className={styles.grid}>
          <a
            className={styles.card}
            style={{
              backgroundColor: servingTeam == TEAM_A_ID ? GREEN_HIGHLIGHT : "",
              borderColor: servingTeam == TEAM_A_ID ? GREEN_BORDER : "",
            }}
          >
            <h2>Team A: {teamAScore}</h2>
            <p>{servingTeam == TEAM_A_ID ? "Serving" : ""}</p>
          </a>

          <a
            className={styles.card}
            style={{
              backgroundColor: servingTeam == TEAM_B_ID ? GREEN_HIGHLIGHT : "",
              borderColor: servingTeam == TEAM_B_ID ? GREEN_BORDER : "",
            }}
          >
            <h2>Team B: {teamBScore}</h2>
            <p>{servingTeam == TEAM_B_ID ? "Serving" : ""}</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
