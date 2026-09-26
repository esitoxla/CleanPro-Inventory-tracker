import { useState, useEffect } from "react";
import { api } from "../config/axios";

const LOW_STOCK_THRESHOLD = 5;

function sumByProduct(rows) {
  return (rows || []).reduce((totals, row) => {
    if (!row) return totals;
    totals[row.productId] =
      (totals[row.productId] || 0) + Number(row.quantity || 0);
    return totals;
  }, {});
}

export function useLowStockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const [productRes, productionRes, salesRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/productions"),
          api.get("/sales"),
        ]);

        const products =
          productRes.data.data ||
          productRes.data.products ||
          productRes.data;
        const productionRows = productionRes.data.data || [];
        const produced = sumByProduct(productionRows);
        const sold = sumByProduct(salesRes.data.data);
        const productsWithProduction = new Set(
          productionRows.filter((row) => row).map((row) => row.productId),
        );

        const low = (Array.isArray(products) ? products : [])
          .map((p) => ({
            ...p,
            remaining: (produced[p.id] || 0) - (sold[p.id] || 0),
          }))
          .filter(
            (p) =>
              productsWithProduction.has(p.id) &&
              p.remaining < LOW_STOCK_THRESHOLD,
          );

        if (isMounted) setLowStockProducts(low);
      } catch (err) {
        console.error("Failed to fetch low stock alerts:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    const interval = setInterval(fetchProducts, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    lowStockProducts,
    count: lowStockProducts.length,
    loading,
  };
}
