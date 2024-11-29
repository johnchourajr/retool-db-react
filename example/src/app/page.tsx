import { DatabaseList } from "@/components/DatabaseList";
import { MainLayout } from "@/components/MainLayout/MainLayout";
import { queryRetoolDatabase } from "@muybuen/retool-db-react/server";

export default async function Home() {
  const initialData = await queryRetoolDatabase("buen_table");

  return (
    <MainLayout>
      <DatabaseList data={initialData} />
    </MainLayout>
  );
}
