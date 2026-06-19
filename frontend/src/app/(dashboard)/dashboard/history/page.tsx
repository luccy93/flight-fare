"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePredictions } from "@/hooks/usePredictions";
import api from "@/lib/api";

const ITEMS_PER_PAGE = 10;

const priceCategoryVariant = (category: string) => {
  switch (category?.toLowerCase()) {
    case "low":
      return "success" as const;
    case "medium":
      return "warning" as const;
    case "high":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { getPredictionHistory } = usePredictions();
  const history = getPredictionHistory.data || [];

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter(
      (p: {
        airline: string;
        source: string;
        destination: string;
      }) =>
        p.airline?.toLowerCase().includes(q) ||
        p.source?.toLowerCase().includes(q) ||
        p.destination?.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const paginatedData = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/predictions/${id}/`);
      getPredictionHistory.refetch();
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Prediction History
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          View all your past flight fare predictions
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">All Predictions</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search by airline or route..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {getPredictionHistory.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg bg-secondary-100 dark:bg-secondary-800 animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Airline</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Predicted Price</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map(
                        (
                          pred: {
                            id: number;
                            airline: string;
                            source: string;
                            destination: string;
                            departure_date: string;
                            predicted_price: number;
                            confidence_score: number;
                            price_category: string;
                          },
                          idx: number
                        ) => (
                          <motion.tr
                            key={pred.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="border-b border-secondary-200 dark:border-secondary-700 transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Plane className="h-4 w-4 text-primary-600" />
                                <span>{pred.airline}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {pred.source} → {pred.destination}
                            </TableCell>
                            <TableCell className="text-secondary-500">
                              {pred.departure_date
                                ? new Date(
                                    pred.departure_date
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="font-semibold text-primary-600">
                              ₹{pred.predicted_price?.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={priceCategoryVariant(
                                    pred.price_category
                                  )}
                                  className="text-[10px]"
                                >
                                  {pred.price_category}
                                </Badge>
                                <span className="text-xs text-secondary-500">
                                  {(
                                    pred.confidence_score * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(pred.id)}
                                isLoading={deletingId === pred.id}
                                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-950/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <p className="text-sm text-secondary-500">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[36px]"
                          >
                            {page}
                          </Button>
                        )
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mx-auto mb-4">
                  {searchQuery ? (
                    <Search className="h-8 w-8 text-secondary-400" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-secondary-400" />
                  )}
                </div>
                <p className="text-secondary-500 dark:text-secondary-400 font-medium">
                  {searchQuery
                    ? "No predictions match your search"
                    : "No predictions yet"}
                </p>
                <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-1">
                  {searchQuery
                    ? "Try a different search term"
                    : "Make your first prediction to see it here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
