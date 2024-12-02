import { DatabaseList } from "@/components/DatabaseList";
import { DatabaseNumber } from "@/components/DatabaseNumber";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { queryRetoolDatabase } from "@muybuen/retool-db-react/server";

export default async function Home() {
  const initialData = await queryRetoolDatabase("buen_table");
  const initialBuenNumber = await queryRetoolDatabase("buen_number");

  return (
    <MainLayout>
      <DatabaseList data={initialData} />
      <DatabaseNumber data={initialBuenNumber} />
    </MainLayout>
  );
}
