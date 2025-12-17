export default function FloatingAddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "60px",
        height: "60px",
        borderRadius: "60%",
        border: "none",
        background: "#005ce6",
        color: "#fff",
        fontSize: "32px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1
      }}
    >
      +
    </button>
  );
}
