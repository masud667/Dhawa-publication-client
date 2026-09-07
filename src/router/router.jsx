import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import { BookDetails } from "../Pages/Home/BookDetails";
import Login from "../Pages/Home/Login";
import Cart from "../cart/Cart";
import Checkout from "../Checkout/Checkout";
import Books from "../Pages/Books/Books";
import NotFoundPage from "../NotFound";
import Subjects from "../Pages/Subjects";
import AdminLayout from "../Admin/Components/AdminLayout";
import AdminDashboard from "../Admin/AdminDashboard";
import ProductList from "../Admin/Products/ProductList";
import ProductForm from "../Admin/Products/ProductForm";
import PrivateRoute from "../Context/PrivateRoute";
import AdminRoute from "./AdminRoute";
import AboutUs from "../Pages/About/AboutUs";
import OrderDashboard from "../Admin/Order/OrderDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      { path: 'login', element: <Login /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'books', element: <Books /> },
      { path: 'categories', element: <Subjects /> },
      { path: 'about', element: <AboutUs /> },
      {
        path: '/books/:id',
        element: <BookDetails />,
      },

      {
        path: '/admin',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
          },

          {
            path: 'books',
            element: <ProductList />,
          },

          {
            path: 'books/create',
            element: <ProductForm />,
          },
          {
            path: 'orders',
            element: <OrderDashboard />,
          },

          {
            path: 'books/edit/:id',
            element: <ProductForm />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      }
    ]
  },
]);