import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import store from "./redux/store";
import ProtectedRoute from "./components/layout/protectedRoute";
import Loading from "./components/element/Loading"; // Komponen loading sementara
import LoginAdmin from "./pages/admin/auth/loginAdmin";

// Lazy loading untuk PagesAdmin
const PagesAdmin = lazy(() => import("./pages/admin"));

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <PagesAdmin />
              }
            />
            <Route
              path="/admin/sign-in"
              element={
                <LoginAdmin />
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
