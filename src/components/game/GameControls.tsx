interface GameControlsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onMove: (direction: -1 | 1) => void;
  onRotate: () => void;
  onDrop: () => void;
  onRestart: () => void;
}

export function GameControls({
  isPlaying,
  isGameOver,
  onStart,
  onMove,
  onRotate,
  onDrop,
  onRestart,
}: GameControlsProps) {
  if (isGameOver) {
    return <button onClick={onRestart}>Restart game</button>;
  }

  if (!isPlaying) {
    return <button onClick={onStart}>Start game</button>;
  }

  return (
    <div className="game-controls" aria-label="Tetris controls">
      <button aria-label="Move piece left" onClick={() => onMove(-1)}>
        Left
      </button>
      <button aria-label="Rotate piece" onClick={onRotate}>
        Rotate
      </button>
      <button aria-label="Move piece right" onClick={() => onMove(1)}>
        Right
      </button>
      <button className="wide-control" onClick={onDrop}>
        Drop
      </button>
    </div>
  );
}
