import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/dashBoardLayout";
import MainLayout from "./layouts/mainLayout";

import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/Authpage";
import Home from "./pages/Home";
import Analyzer from "./pages/Analysis";
import CompareVoices from "./pages/CompareVoices";
import ProjectCreation from "./pages/ProjectCreation";
import MediaStore from "./pages/MediaStore";
import UserSettings from "./pages/UserSettings";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminAllUsers from "./pages/AdminAllUsers";   

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
       
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
  
                <DashboardLayout />
      

              //  <ProtectedRoute>
              //  <DashboardLayout />
              // </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<Analyzer />} />
            <Route path="compare-voices" element={<CompareVoices />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="create-project" element={<ProjectCreation />} />
            <Route path="media-store" element={<MediaStore />} />
          </Route>

          <Route
            path="/admin-all-users"
            element={
              <ProtectedRoute role="admin">
                <AdminAllUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
