import { DatabaseList } from "@/components/DatabaseList";
import { MainLayout } from "@/components/MainLayout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <DatabaseList />
    </MainLayout>
  );
}
