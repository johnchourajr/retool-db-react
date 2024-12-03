import { DatabaseList } from "@/components/DatabaseList";
import { DatabaseNumber } from "@/components/DatabaseNumber";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { getInitialData } from "./actions";

export default async function Home() {
  const { initialTableData, initialBuenNumber } = await getInitialData();

  return (
    <MainLayout>
      <DatabaseList data={initialTableData} />
      <DatabaseNumber data={initialBuenNumber} />
    </MainLayout>
  );
}
