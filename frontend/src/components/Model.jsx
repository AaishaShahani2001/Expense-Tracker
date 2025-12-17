export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "400px",
          padding: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}
      >
        {children}
      </div>
    </div>
  );
}
