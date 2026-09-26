import { AuthProvider } from "../context/authContext";
import { ProductProvider } from "../context/ProductsContext";
import { ProductionProvider } from "../context/ProductionsContext";
import { ExpenseProvider } from "../context/ExpenseContext";
import { SalesProvider } from "../context/SalesContext";
import { ThemeProvider } from "../context/themeContext";

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <ProductionProvider>
            <SalesProvider>
              <ExpenseProvider>{children}</ExpenseProvider>
            </SalesProvider>
          </ProductionProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;