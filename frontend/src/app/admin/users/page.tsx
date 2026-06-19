"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  predictions_count: number;
}

const PAGE_SIZE = 8;

const mockUsers: User[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  username: [
    "rahul.sharma", "priya.patel", "amit.kumar", "sneha.reddy",
    "vikram.singh", "anjali.gupta", "rohit.verma", "neha.jain",
    "arjun.nair", "kavita.das", "manish.yadav", "pooja.malhotra",
    "sunil.kapoor", "deepa.iyer", "gaurav.bhatt", "meera.nair",
    "akash.saxena", "ritu.agarwal", "siddharth.roy", "tanya.ray",
    "vivek.mishra", "prachi.joshi", "karan.mehta", "ishita.rao",
  ][i],
  email: [
    "rahul@example.com", "priya@example.com", "amit@example.com",
    "sneha@example.com", "vikram@example.com", "anjali@example.com",
    "rohit@example.com", "neha@example.com", "arjun@example.com",
    "kavita@example.com", "manish@example.com", "pooja@example.com",
    "sunil@example.com", "deepa@example.com", "gaurav@example.com",
    "meera@example.com", "akash@example.com", "ritu@example.com",
    "sid@example.com", "tanya@example.com", "vivek@example.com",
    "prachi@example.com", "karan@example.com", "ishita@example.com",
  ][i],
  first_name: [
    "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali",
    "Rohit", "Neha", "Arjun", "Kavita", "Manish", "Pooja",
    "Sunil", "Deepa", "Gaurav", "Meera", "Akash", "Ritu",
    "Siddharth", "Tanya", "Vivek", "Prachi", "Karan", "Ishita",
  ][i],
  last_name: [
    "Sharma", "Patel", "Kumar", "Reddy", "Singh", "Gupta",
    "Verma", "Jain", "Nair", "Das", "Yadav", "Malhotra",
    "Kapoor", "Iyer", "Bhatt", "Nair", "Saxena", "Agarwal",
    "Roy", "Ray", "Mishra", "Joshi", "Mehta", "Rao",
  ][i],
  is_active: i % 5 !== 0,
  is_staff: i < 3,
  date_joined: new Date(2024, 0, 15 + i).toISOString().split("T")[0],
  predictions_count: Math.floor(Math.random() * 50) + 5,
}));

export default function AdminUsersPage() {
  const { users: apiUsers, isUsersLoading } = useAdmin();
  const [users, setUsers] = useState<User[]>(
    apiUsers.length > 0 ? apiUsers : mockUsers
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          `${u.first_name} ${u.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const handleToggle = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    );
    toast.success("User status updated");
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted successfully");
  };

  if (isUsersLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded-lg" />
        <div className="h-10 w-72 bg-secondary-200 dark:bg-secondary-700 rounded-lg" />
        <div className="h-96 bg-secondary-200 dark:bg-secondary-700 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">User Management</h1>
          <p className="text-sm text-secondary-500 mt-1">
            {users.length} total users
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Predictions</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-secondary-500">
                    <UsersIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="sm"
                          fallback={`${user.first_name[0]}${user.last_name[0]}`}
                        />
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-white text-sm">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-secondary-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_staff ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.is_staff ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_active ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-secondary-600 dark:text-secondary-400">
                      {user.predictions_count}
                    </TableCell>
                    <TableCell className="text-xs text-secondary-500">
                      {user.date_joined}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggle(user.id)}
                          title={user.is_active ? "Deactivate" : "Activate"}
                        >
                          {user.is_active ? (
                            <ToggleRight className="h-4 w-4 text-success-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-secondary-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i)}
                className="min-w-[36px]"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
