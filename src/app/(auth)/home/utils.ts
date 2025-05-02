import { Colors } from "@/themes/colors";

export type UsageData = {
  month: string;
  value: number;
};

const formatMonth = (monthStr: string) => {
  if (monthStr === "total") return "Total";
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

export const prepareChartData = (data: UsageData[], label: string) => ({
  labels: data.map((item) => formatMonth(item.month)),
  datasets: [
    {
      label: label,
      data: data.map((item) => item.value),
      backgroundColor: data.map((item) =>
        item.month === "total" ? Colors.primary500 : Colors.primary200
      ),
      borderColor: data.map((item) =>
        item.month === "total" ? Colors.primary500 : Colors.primary500
      ),
      borderWidth: 1,
    },
  ],
});
