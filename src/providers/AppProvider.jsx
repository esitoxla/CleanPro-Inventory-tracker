import { AuthProvider } from "../context/authContext";
import { ProductProvider } from "../context/ProductsContext";
import { ProductionProvider } from "../context/productionsContext";
import { ExpenseProvider } from "../context/ExpenseContext";
import { SalesProvider } from "../context/SalesContext";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <ProductionProvider>
          <SalesProvider>
            <ExpenseProvider>{children}</ExpenseProvider>
          </SalesProvider>
        </ProductionProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default AppProvider;