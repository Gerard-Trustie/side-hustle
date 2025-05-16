import { Suspense } from "react";
import AnimatedSpinner from "@/components/AnimatedSpinner";
import GrowthChart from "./GrowthChart";
import UsageChart from "./UsageChart";

const Dashboard = () => {
  return (
    <>
      <div className="bg-card-element p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <AnimatedSpinner size={60} isCircle={false} />
            </div>
          }
        >
          <GrowthChart />
        </Suspense>
      </div>
      <div className="bg-card-element p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <AnimatedSpinner size={60} isCircle={false} />
            </div>
          }
        >
          <UsageChart />
        </Suspense>
      </div>
    </>
  );
};

export default Dashboard;
