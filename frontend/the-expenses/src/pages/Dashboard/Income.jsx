import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import IncomeOverview from "../../components/Income/IncomeOverview";
import { UserContext } from "../../context/userContext";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import useUserAuth from "../../hooks/useUserAuth";
const Income = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Get All Income Details 
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
        console.log("Fetched income data:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch income data:", error);
      toast.error("Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  };
  // Handle Add Income
  const handleAddIncome = async (incomeData) => {
    const { source, amount, date, icon } = incomeData;

    if (!source.trim()) {
      toast.error("Source is required.");
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
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        title: source,
        amount: Number(amount),
        date,
        icon,
      });

      console.log("Income added:", response.data);
      setOpenAddIncomeModal(false);
      toast.success("Income Added Successfully 💵📩");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const deleteIncome = async (id) => {
    if (!id) {
      toast.error("No income ID provided for deletion");
      return;
    }

    try {
      const deleteUrl = API_PATHS.INCOME.DELETE_INCOME(id);
      console.log("Calling DELETE API:", deleteUrl);

      const response = await axiosInstance.delete(deleteUrl);
      console.log("Delete response:", response);

      toast.success("Income Deleted Successfully 💵");
      setOpenDeleteAlert({ show: false, data: null });
      await fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error(
        `Failed to delete income: ${error.response?.data?.message || error.message}`
      );
    }
  };

  
  const handleDownloadIncomeDetails = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",
      });
      //Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully! ✅");
    }catch(error){
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
  }
   
  };
  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1">
          <div className="card">
            <IncomeOverview
              transactions={incomeData || []}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData || []}
            onDelete={(id)=>{
              setOpenDeleteAlert({show:true,data:id});
            }} 
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income 💵"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to DELETE this Income Detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ show: false, data: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
