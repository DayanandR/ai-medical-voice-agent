import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, FileText, Calendar, User, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type historyListProps = {
  historyList?: any;
};

const HistoryTable = ({ historyList }: historyListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toString().split(" GMT")[0];
  }

  // Calculate pagination
  const totalItems = historyList?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = historyList?.slice(startIndex, endIndex) || [];

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewReport = (record: any) => {
    setSelectedReport(record);
    setIsModalOpen(true);
  };

  const renderReportContent = () => {
    if (!selectedReport?.report && !selectedReport?.conversation) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No report generated for this session</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Doctor:</span>
            <span>{selectedReport?.selectedDoctor?.specialist}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Date:</span>
            <span>{formatDateTime(selectedReport?.createdOn)}</span>
          </div>
          {selectedReport?.notes && (
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 mt-1" />
              <div>
                <span className="font-medium">Notes:</span>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedReport?.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Report Summary */}
        {selectedReport?.report && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Report
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              {selectedReport.report.summary && (
                <div>
                  <span className="font-medium text-blue-900">Summary:</span>
                  <p className="text-blue-800 text-sm mt-1">
                    {selectedReport.report.summary}
                  </p>
                </div>
              )}
              {selectedReport.report.recommendations && (
                <div>
                  <span className="font-medium text-blue-900">
                    Recommendations:
                  </span>
                  <p className="text-blue-800 text-sm mt-1">
                    {selectedReport.report.recommendations}
                  </p>
                </div>
              )}
              {selectedReport.report.messageCount && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedReport.report.messageCount} messages
                  </Badge>
                  {selectedReport.report.timestamp && (
                    <Badge variant="outline">
                      Generated:{" "}
                      {new Date(
                        selectedReport.report.timestamp
                      ).toLocaleString()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conversation History */}
        {selectedReport?.conversation &&
          selectedReport.conversation.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversation History
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedReport.conversation.map(
                  (message: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-green-50 border-l-4 border-green-400"
                          : "bg-gray-50 border-l-4 border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            message.role === "assistant"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.role === "assistant" ? "Doctor" : "Patient"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{message.text}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* Report Data (if available) */}
        {selectedReport?.report?.messages &&
          selectedReport.report.messages.length > 0 &&
          !selectedReport?.conversation && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Session Messages
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedReport.report.messages.map(
                  (message: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-green-50 border-l-4 border-green-400"
                          : "bg-gray-50 border-l-4 border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            message.role === "assistant"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.role === "assistant" ? "Doctor" : "Patient"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{message.text}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">AI Medical Specialist</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((rec: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {rec?.selectedDoctor?.specialist}
              </TableCell>
              <TableCell>{formatDateTime(rec?.createdOn)}</TableCell>
              <TableCell className="max-w-xs truncate">{rec?.notes}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewReport(rec)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Fixed Modal - Moved outside table and added proper z-index */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto z-[100] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Consultation Report
            </DialogTitle>
            <DialogDescription>
              Detailed report and conversation history for your consultation
              session
            </DialogDescription>
          </DialogHeader>
          {renderReportContent()}
        </DialogContent>
      </Dialog>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
