import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Root from "./pages/Root";
import MainPage from "./pages/MainPage";
import TableView from "./pages/TableViewPage";
import LandingPage from "./pages/LandingPage";
import { Toaster } from "react-hot-toast";

// Protected wrapper
import ProtectedRoute from "./layout/ProtectedRoute";
import EditProfile from "./pages/EditProfilePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'overview',
        element: (
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'table-view',
        element: (
          <ProtectedRoute>
            <TableView />
          </ProtectedRoute>
        )
      },
      {
        path: 'edit-profile',
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />

    </>

  )
}

export default App;
