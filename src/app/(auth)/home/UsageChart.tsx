import { usageStatistics } from "@/actions/usageStatistics";
import BarChart from "../../../components/BarChart";
import { prepareChartData } from "./utils";

const UsageChart = async () => {
  try {
    const usageData = await usageStatistics("usage");

    const chartData = prepareChartData(usageData, "Usage - last Used Date");

    return <BarChart data={chartData} />;
  } catch (error) {
    console.error("Error fetching usage data:", error);
    return <div>Error fetching usage data</div>;
  }
};

export default UsageChart;
