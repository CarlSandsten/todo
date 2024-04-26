import { TodoItemType } from "../types";

export const todoDateSort = (arr: TodoItemType[]) =>
  arr.sort((a, b) => {
    const compareA = a.prioritizedAt === "" ? a.createdAt : a.prioritizedAt;
    const compareB = b.prioritizedAt === "" ? b.createdAt : b.prioritizedAt;

    return -compareA.localeCompare(compareB);
  });
