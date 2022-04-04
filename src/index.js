import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  let line = props.winner;

  return (
    /* arrow function to avoid problems with "this" */
    <button
      className={`square ${line.includes(props.id) ? "winner" : ""}`}
      id={props.id}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        // to know if the square is winner
        winner={this.props.winner}
        value={this.props.squares[i]}
        // to add id to squares
        id={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    /* */

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      column: 0,
      row: 0,
      switch: true,
    };
  }

  position(i) {
    let row = null,
      column = null;
    /* rows */
    if (i == 0 || i == 1 || i == 2) {
      row = 1;
    } else if (i == 3 || i == 4 || i == 5) {
      row = 2;
    } else if (i == 6 || i == 7 || i == 8) {
      row = 3;
    }

    /* columns */
    if (i == 0 || i == 3 || i == 6) {
      column = 1;
    } else if (i == 1 || i == 4 || i == 7) {
      column = 2;
    } else if (i == 2 || i == 5 || i == 8) {
      column = 3;
    }

    const arr = [row, column];
    return arr;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = this.position(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      row: position[0],
      column: position[1],
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  /* change order */
  changeOrder() {
    this.setState({
      switch: !this.state.switch,
    });
  }

  render() {
    const history = this.state.history,
      current = history[this.state.stepNumber],
      winner = calculateWinner(current.squares),
      row = this.state.row,
      column = this.state.column,
      stepNumber = this.state.stepNumber,
      /* to make the switch work */
      order = this.state.switch,
      moves = history.map((step, move) => {
        const desc = move
          ? `Go to move # ${move} (row: ${row} - column: ${column})`
          : "Go to game start";
        return (
          <li key={move}>
            <button
              className={stepNumber == move ? "active" : ""}
              onClick={() => this.jumpTo(move)}
            >
              {desc}
            </button>
          </li>
        );
      });

    let status;

    if (winner) {
      console.log(winner);
      status = "Winner: " + winner[0];
    }

    // to say if a Tie happens
    else if (stepNumber === 9) {
      status = "Tie :( refresh and try again!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <>
        <div className="background"></div>
        <div className="game">
          <div className="title">{status}</div>
          <div className="game-board">
            <Board
              squares={current.squares}
              // if not winner, send empty array to avoid errors
              winner={winner ? winner[1] : []}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <button onClick={() => this.changeOrder()}>
              Change order to {order ? "DESC" : "ASC"}
            </button>
            <ol>
              {
                //to change order
                order ? moves.reverse() : moves
              }
            </ol>
          </div>
        </div>
      </>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      /* changed to array to make work the highlights of winners squares */
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
