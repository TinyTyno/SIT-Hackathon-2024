import { useState, useEffect,useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Adjust the import path
import axios from "axios";

const StockTable = ({ data, itemsPerPage = 10,type='stock' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  console.log(totalPages)
  // Memoize paginated data to avoid recalculation on every render
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, data]);

  console.log(paginatedData)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchData = async () => {
    paginatedData.map((stock) => {
       axios.get(`http://localhost:3000/testing/api/stock?symbol=${stock}`)
      .then((response) => {
        console.log(response.data)
      }).catch((error) => {
         console.log(error)
      })
    }
    )
  };
  useEffect(() => {
    setCurrentData(paginatedData);
    fetchData();
  }
  , [paginatedData]);
  return (
    <div>
      <Table className="">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {type==='stock'?paginatedData.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          )):paginatedData.map((holding) => (
            <TableRow key={holding.id}>
              <TableCell className="font-medium">
                <div className="font-semibold">{holding.symbol}</div>
                <span>{holding.name}</span>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{holding.position}</div>
                <span>{holding.market}</span>
              </TableCell>
              <TableCell>{holding.amount}</TableCell>
              <TableCell className="text-right">{holding.price}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>

      {/* Pagination Controls with Shadcn */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>

         
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default StockTable;
