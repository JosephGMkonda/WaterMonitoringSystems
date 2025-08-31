import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/ContextAuth";
import SignIn from "./pages/Login";
import Home from "./pages/Home";
import WaterPoint from "./pages/waterpoint"; // capital W for component
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/login" element={<SignIn />} />

          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/waterpoints"
            element={
              <ProtectedRoute>
                <Layout>
                  <WaterPoint />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
