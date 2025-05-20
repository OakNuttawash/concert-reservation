import { ConcertCard } from "../../../components/ConcertCard";

export default async function Home() {
  return (
    <div className="flex flex-col h-full py-10 px-6 gap-6">
      <ConcertCard mode="reserve" />
      <ConcertCard mode="cancel" />
    </div>
  );
}
