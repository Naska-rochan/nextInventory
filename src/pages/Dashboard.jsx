
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Plus, Trash2, Edit2, ArrowUpDown } from "lucide-react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://67f7183e42d6c71cca6403bd.mockapi.io/v1/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://67f7183e42d6c71cca6403bd.mockapi.io/v1/api/products/${id}`
      );
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    const sortedProducts = [...products].sort((a, b) => {
      const dateA = new Date(a.expiry);
      const dateB = new Date(b.expiry);
      return newOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setProducts(sortedProducts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text">
            Inventory Management
          </h1>
          <Button 
            onClick={() => navigate("/add")}
            className="hover-scale bg-gradient-to-r from-purple-600 to-blue-500 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50/50 dark:bg-purple-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    <button
                      onClick={handleSort}
                      className="flex items-center space-x-1 hover:text-purple-800 dark:hover:text-purple-200"
                    >
                      <span>Expiry Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 dark:divide-purple-800">
                {products.map((product) => (
                  <tr 
                    key={product.id}
                    className="hover:bg-purple-50/50 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-700"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(product.expiry), "PP")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit/${product.id}`)}
                          className="hover-scale border-purple-200 dark:border-purple-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="hover-scale"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
