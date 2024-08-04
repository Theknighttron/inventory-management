'use client';
import { useState, useEffect } from 'react';
import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart, MdDashboard } from 'react-icons/md';
import Widget from 'components/widget/Widget';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../../../firebase';

interface DashboardData {
  totalItems: number;
  lowStockItems: number;
  itemCategories: number;
  recentlyAdded: number;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalItems: 0,
    lowStockItems: 0,
    itemCategories: 0,
    recentlyAdded: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const pantryRef = collection(firestore, 'pantryItems');
        const pantrySnapshot = await getDocs(pantryRef);

        const totalItems = pantrySnapshot.size;
        const lowStockItems = pantrySnapshot.docs.filter(doc => doc.data().quantity <= 5).length;

        const categoriesSet = new Set(pantrySnapshot.docs.map(doc => doc.data().category));
        const itemCategories = categoriesSet.size;

        const recentItemsQuery = query(pantryRef, orderBy('dateAdded', 'desc'), limit(7));
        const recentItemsSnapshot = await getDocs(recentItemsQuery);
        const recentlyAdded = recentItemsSnapshot.size;

        setDashboardData({
          totalItems,
          lowStockItems,
          itemCategories,
          recentlyAdded,
        });
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 ml-12 w-auto flex justify-center gap-3">
        <Widget
          icon={<MdDashboard className="h-7 w-7" />}
          title={'Total Items'}
          subtitle={dashboardData.totalItems.toString()}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={'Low Stock Items'}
          subtitle={dashboardData.lowStockItems.toString()}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={'Item Categories'}
          subtitle={dashboardData.itemCategories.toString()}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={'Recently Added'}
          subtitle={dashboardData.recentlyAdded.toString()}
        />
      </div>
      {/* Charts */}
      <div className="mt-5 ml-12 w-auto grid grid-cols-1 gap-5 md:grid-cols-1">
        <WeeklyRevenue />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
      </div>
    </div>
  );
};

export default Dashboard;
