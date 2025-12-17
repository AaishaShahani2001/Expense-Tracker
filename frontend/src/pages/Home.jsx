import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import RecentTransactions from "../components/RecentTransactions";
import AddTransaction from "../components/AddTransaction";
import FloatingAddButton from "../components/FloatingAddButton";
import Modal from "../components/Model";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);

  const refreshAll = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ background: "#FFF7ED", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "0 20px" }}>
        {/*  Summary listens to refreshKey */}
        <SummaryCard refreshKey={refreshKey} />

        {/*  Recent notifies Home */}
        <RecentTransactions
          refreshKey={refreshKey}
          onGlobalRefresh={refreshAll}
        />

        <FloatingAddButton onClick={() => setOpen(true)} />

        <Modal open={open} onClose={() => setOpen(false)}>
          <AddTransaction
            onAdd={() => {
              refreshAll(); //  add → refresh everything
              setOpen(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
