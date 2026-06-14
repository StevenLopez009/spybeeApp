import ReportsClient from "@/features/reports/components/ReportClients";
import { getIncidents } from "@/features/reports/services/reports.service";

export default async function ReportsPage() {
  const incidents = await getIncidents();

  return <ReportsClient incidents={incidents} />;
}
