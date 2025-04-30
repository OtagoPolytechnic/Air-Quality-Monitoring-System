import React, {useEffect, useState} from "react";

const QuickFilterButton = ({ label, onClick, isActive }) => (
  <button
    onClick={onClick}
    type="button"
    className={`py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-full border ${isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200'} hover:bg-black hover:text-white`}
    aria-label={label}
  >
    {label}
  </button>
);

export const QuickFilter = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("Today");

  useEffect(() => {
    setLast24Hours();
  }, []);

  const setLast24Hours = () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const startDate = yesterday.toISOString();
    const endDate = now.toISOString();
    onFilterChange({ startDate, endDate, viewType: "hourly" });
    setActiveFilter("Last 24 hours");
  };

  const setToday = () => {
    // get the full day for the today filter starts from 00:00:00 to now
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
    const endDate = now.toISOString();
    onFilterChange({ startDate, endDate, viewType: "hourly" });
    setActiveFilter("Today");
  };
 
  const setThisWeek = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const startDate = sevenDaysAgo.toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    onFilterChange({ startDate, endDate, viewType: "daily" });
    setActiveFilter("Week");
  };

  const setThisMonth = () => {
    const date = new Date();
    const aMonthAgo = new Date(date);
    aMonthAgo.setDate(date.getDate() - 30);
    const startDate = aMonthAgo.toISOString().split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    onFilterChange({ startDate, endDate, viewType: "daily" });
    setActiveFilter("Month");
  };

  return (
    <div data-cy="QuickFilter">
      <QuickFilterButton data-cy="FilterLast24Hours" label="Last 24 hours" isActive={activeFilter === "Last 24 hours"} onClick={setLast24Hours} />
      <QuickFilterButton data-cy="FilterToday" label="Today" isActive={activeFilter === "Today"} onClick={setToday} />
      <QuickFilterButton data-cy="FilterWeek" label="Last week" isActive={activeFilter === "Week"} onClick={setThisWeek} />
      <QuickFilterButton data-cy="FilterMonth" label="Last month" isActive={activeFilter === "Month"} onClick={setThisMonth} />
    </div>
  );
};
