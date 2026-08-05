import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home";
import { BookDetails } from "../Pages/Home/BookDetails";
import Login from "../Pages/Home/Login";
import Cart from "../cart/Cart";
import Checkout from "../Checkout/Checkout";
import Books from "../Pages/Books/Books";

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

      {
  path: '/books/:id',
  element: <BookDetails />,
}
    ]
  },
]);