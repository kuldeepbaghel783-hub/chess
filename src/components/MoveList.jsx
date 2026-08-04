function MoveList({ moves }) {
  return (
    <div className="move-list">
      <h3>Move History</h3>

      {moves.length === 0 ? (
        <p>No moves yet.</p>
      ) : (
        moves.map((move, index) => (
          <div key={index} className="move">
            <strong>{index + 1}.</strong> {move}
          </div>
        ))
      )}
    </div>
  );
}

export default MoveList;