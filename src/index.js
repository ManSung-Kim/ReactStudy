import React from 'react';
import './index.css';
import ReactDom from 'react-dom';

// this code ref from https://ko.reactjs.org/tutorial/tutorial.html

// class Square extends React.Component {
//     // constructor(props) {
//     //     super(props);
//     //     this.state = { // 상태유지 필요시 ctor에 state추가해서 이용
//     //         value: 's', 
//     //     };
//     // }
    
//     render() {
//         return (
//             <button className="square"
//                 // onClick={function() {
//                 //     alert('click ');
//                 // }}
//                 onClick={() => 
//                     //this.setState({value: 'X'})
//                     this.props.onClick() // Board에서 props로 넘겨받은 onClick의 참조
//                 }
//                 >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) { // Square class를 함수컴포넌트로 변경함(더 단순해짐)
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null), // 자식데이터관리용
    //         xIsNext: true,
    //     }
    // }
    
    // handleClick(i) {
    //     const squares = this.state.squares.slice(); // 배열cpy
    //     if (caculateWinner(squares) || squares[i]) {
    //         return; // 누군가 승리하거나, 이미 누가 눌렀다면 return
    //     }
    //     //squares[i] = i + 'X';
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';        
    //     this.setState({
    //         squares: squares, // value가 새로운 const로 덮어씌워지면서 component가 업데이트되어야함을 react가 쉽게 catch할 수 있다고 함
    //         xIsNext: !this.state.xIsNext,
    //     });
    // }

    renderSquare(i) {
        //return <Square value={i}/>; // board->sq로 props.value를 input그대로 전달시
        return (
            <Square 
                // value={this.state.squares[i]} // 배열의 특정idx 값을 value로 전달
                value={this.props.squares[i]} // game에서 전달받은 배열로, 배열의 특정idx 값을 value로 전달
                //onClick={() => this.handleClick(i)}
                onClick={() => this.props.onClick(i)} // game에서 전달받은 onClick 수행
            />
        );
    }

    render() {
        // const status = 'Next player: ' +
        //     ((this.state.xIsNext) ? 'X' : 'O');
        // const winner = caculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' +
        //     ((this.state.xIsNext) ? 'X' : 'O');
        // }

        // <div className="status">{status}</div>
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
            history: [{
                squares: Array(9).fill(null),
            }], // 9짜리 hitstory
            stepNumber: 0, // history jump를 위한 step no.
            xIsNext: true,
        };
    }

    handleClick(i) {
        //const history = this.state.history;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
          // 시간을 거꾸로 돌린 후 새로운 말판 입력이 생기면 현재이 후의 모든 history를 날려버림.
        const current = history[history.length - 1];
        const squares = current.squares.slice(); // 배열cpy
        if (caculateWinner(squares) || squares[i]) {
            return; // 누군가 승리하거나, 이미 누가 눌렀다면 return
        }
        //squares[i] = i + 'X';
        squares[i] = this.state.xIsNext ? 'X' : 'O';        
        this.setState({
            //squares: squares, // value가 새로운 const로 덮어씌워지면서 component가 업데이트되어야함을 react가 쉽게 catch할 수 있다고 함
            history: history.concat([{
                squares: squares, // 희스토리에 현재말판정보 이어넣기
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step %2) === 0, // step no.가 짝수일때만 x턴으로 지정해줌. history진행상 짝수번째 순서마다 x가 턴임..
        });
    }

    render() {
        const history = this.state.history;
        //const current = history[history.length - 1];
        const current = history[this.state.stepNumber];
        const winner = caculateWinner(current.squares);
       
        // map함수는 left=>right 시 left를 right로 변환 후 lValue로 return
        // const num = [1, 2, 3];
        // const doubled = num.map(x => x * 2); // [2,4,6] 이 저장됨
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
                // li에 고유한 key를 넣어서 각 태그가 구분이 되도록 함
            return (
                <li key={move}> 
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
       
        let status;
        
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' +
            ((this.state.xIsNext) ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i)=>this.handleClick(i)}
                        />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDom.render(
    <Game />,
    document.getElementById('root')
);


function caculateWinner(squares) { // 대충 틱텍토 승자계산기..
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

    for(let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] 
            && squares[a] === squares[c]) {
                return squares[a];
            }
    }
    return null;
}