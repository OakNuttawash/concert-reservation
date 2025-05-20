import client from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function History() {
  const { data : reservationHistory } = await client.GET("/admin/concert/reservation/history");
  return (
    <div className="flex flex-col h-full py-10 px-6 gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date time</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Concert Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservationHistory?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No history
              </TableCell>
            </TableRow>
          ) : (
            <>
              {reservationHistory?.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.createdAt}</TableCell>
                  <TableCell>{reservation.userId}</TableCell>
                  <TableCell>{reservation.concertName}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
