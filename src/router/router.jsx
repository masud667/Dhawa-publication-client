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
      { path: 'subjects', element: <Subjects /> },
      {
        path: '/books/:id',
        element: <BookDetails />,
      },


      {
        path: '/admin',
        element: <AdminLayout />,
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