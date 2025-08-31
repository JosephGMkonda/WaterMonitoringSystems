import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <TopBar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "1rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
