import React, { useState, useEffect, useContext } from 'react'
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from '../../components/Modal';
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  
  // Get All Expense Details 
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
        console.log("Fetched expense data:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch expense data:", error);
      toast.error("Failed to fetch expense data");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Add Expense
  const handleAddExpense = async (expenseData) => {
    const { category, amount, date, icon } = expenseData;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount is required and should be a valid number.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category: category,  
        amount: Number(amount),
        date,
        icon,
      });

      console.log("Expense added:", response.data);
      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully 💰📩");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

// Delete Expense
const deleteExpense = async (id) => {
  if (!id) {
    toast.error("No expense ID provided for deletion");
    return;
  }

  try {
    const deleteUrl = API_PATHS.EXPENSE.DELETE_EXPENSE(id);
    console.log("Calling DELETE API:", deleteUrl);

    const response = await axiosInstance.delete(deleteUrl);
    console.log("Delete response:", response);

    toast.success("Expense Deleted Successfully 🗑️🚮");
    setOpenDeleteAlert({ show: false, data: null });
    await fetchExpenseDetails();
  } catch (error) {
    console.error("Error deleting expense:", error);
    toast.error(
      `Failed to delete expense: ${error.response?.data?.message || error.message}`
    );
  }
};
    
    const handleDownloadExpenseDetails = async () => {
      try{
        const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
          responseType: "blob",
        });
        //Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "expense_details.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Expense details downloaded successfully! ✅");
      }catch(error){
        console.error("Error downloading expense details:", error);
        toast.error("Failed to download expense details. Please try again.");
      }
     
    };

  useEffect(() => {
    fetchExpenseDetails();
    return() => {};
  } ,[]);
  
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={()=> setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id)=>{
              setOpenDeleteAlert({show: true, data: id});
            }}
            onDownload={handleDownloadExpenseDetails}
          />

        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Modal>

            {/* Delete Confirmation Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to DELETE this Expense Detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense