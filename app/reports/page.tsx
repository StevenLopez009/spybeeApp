import ReportsClient from "../../features/reports/components/ReportClients";

async function getIncidents() {
  const response = await fetch(
    "https://hkwjqhziteegahqjayvf.supabase.co/storage/v1/object/sign/vacancy-assets/fcebe58f-a13d-496d-9155-f109ea72880e/prueba-1781273693508-incidents.mock.json?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQ3NjdhNC02ZWFlLTQ5OTktYjVhMi0wYTFlNzk5MmVhNjAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2YWNhbmN5LWFzc2V0cy9mY2ViZTU4Zi1hMTNkLTQ5NmQtOTE1NS1mMTA5ZWE3Mjg4MGUvcHJ1ZWJhLTE3ODEyNzM2OTM1MDgtaW5jaWRlbnRzLm1vY2suanNvbiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODEyODA0NDIsImV4cCI6MTc4MjQ5MDA0Mn0.nB_B_CITEhPFKYuRWk_GRhz7fWQnjM9GMBg85vAFAqA",
    {
      cache: "no-store",
    },
  );

  return response.json();
}

export default async function ReportsPage() {
  const incidents = await getIncidents();

  return <ReportsClient incidents={incidents} />;
}
