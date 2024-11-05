import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginAdmin from "./pages/admin/auth/LoginAdmin"
import { Provider } from "react-redux"
import store from './redux/store';
import { PagesAdmin } from "./pages/admin";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { PagesKaryawan } from "./pages/karyawan";
import LoginKaryawan from "./pages/karyawan/auth/LoginKaryawan";

function App() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/admin/sign-in" element={<LoginAdmin />} />
            <Route path="/karyawan/sign-in" element={<LoginKaryawan/>} />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute role="admin">
                  <PagesAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/karyawan/*" 
              element={
                <ProtectedRoute role="karyawan">
                  <PagesKaryawan />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </Provider>
    )
}

export default App
