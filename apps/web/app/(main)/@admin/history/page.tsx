import client from "@/api/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";

export default async function History() {
  const { data: reservationHistory } = await client.GET(
    "/admin/concert/reservation/history"
  );
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
              {reservationHistory?.reverse()?.map((reservation, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {dayjs(reservation.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell>{reservation.userId}</TableCell>
                  <TableCell>{reservation.concertName}</TableCell>
                  <TableCell>
                    {reservation.status === "RESERVE" ? "Reserve" : "Cancel"}
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
