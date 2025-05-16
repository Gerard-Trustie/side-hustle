import { usageStatistics } from "@/actions/usageStatistics";
import BarChart from "../../../components/BarChart";
import { prepareChartData } from "./utils";

const GrowthChart = async () => {
  try {
    const growthData = await usageStatistics("growth");

    const chartData = prepareChartData(
      growthData,
      "User Growth - new monthly customers"
    );

    return <BarChart data={chartData} />;
  } catch (error) {
    console.error("Error fetching growth data:", error);
    return <div>Error fetching growth data</div>;
  }
};

export default GrowthChart;
